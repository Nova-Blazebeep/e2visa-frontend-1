// Generates notifications by comparing live listings with what the user has
// already seen: new listings, saved-search matches, and price changes on
// saved listings. Runs client-side until a backend notification feed exists.
import { addNotification, getNotificationMeta, setNotificationMeta } from './notifications';
import { getSavedListings, updateSavedListingPrice } from './savedListings';
import { getSearchHistory } from './searchHistory';
import { getNotificationPrefs } from './notificationPrefs';

function currentUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

// Readable "County, State" (county name from the API often already includes
// the state, so we dedupe to avoid "Alabama · Autauga County, Alabama").
function listingLocation(listing) {
  const county = listing.county?.name || listing.county_name;
  const state = listing.state?.name || listing.state_name;
  const country = listing.country?.name;
  if (county && state && !county.toLowerCase().includes(state.toLowerCase())) {
    return `${county}, ${state}`;
  }
  return county || state || country || '';
}

function withLocation(title, listing) {
  const loc = listingLocation(listing);
  return loc ? `${title} · ${loc}` : title;
}

function priceLabelFor(listing) {
  const isRE = listing.business_type === 'real-estate';
  if (isRE) {
    const sale = parseFloat(listing.sale_price);
    const rent = parseFloat(listing.monthly_rent);
    if (!isNaN(sale) && sale > 0) return `$${sale.toLocaleString()}`;
    if (!isNaN(rent) && rent > 0) return `$${rent.toLocaleString()}/mo`;
  }
  const price = parseFloat(listing.asking_price);
  if (!isNaN(price) && price > 0) return `$${price.toLocaleString()}`;
  return null;
}

// Does a listing match the id-based filters of a recorded search?
// (Range filters like price/sqft are skipped — location + type is enough
// for a useful "new match" signal.)
function matchesSearch(listing, searchUrl) {
  let params;
  try {
    params = new URL(searchUrl, 'http://x').searchParams;
  } catch {
    return false;
  }
  const idFilters = [
    ['country_id', 'country_id'],
    ['state_id', 'state_id'],
    ['county_id', 'county_id'],
    ['category_id', 'category_id'],
    ['sub_category_id', 'sub_category_id'],
  ];
  for (const [param, field] of idFilters) {
    const want = params.get(param);
    if (want && String(listing[field]) !== String(want)) return false;
  }
  const wantType = params.get('property_type');
  if (wantType && (listing.property_type || '').toLowerCase() !== wantType.toLowerCase()) return false;

  const isRealEstateSearch = searchUrl.startsWith('/real-estate');
  const listingIsRE = listing.business_type === 'real-estate';
  if (isRealEstateSearch !== listingIsRE) return false;

  return true;
}

// ── Forum activity: new comments/replies from others on the user's own posts ──
async function checkForumActivity(API_URL, meta) {
  const user = currentUser();
  if (!user?.id) return;

  // Fetch all forum pages
  let forums = [];
  try {
    const first = await fetch(`${API_URL}/api/forum/list?page=1`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
    const paginator = first.result;
    forums = paginator?.data || [];
    const lastPage = paginator?.last_page || 1;
    for (let p = 2; p <= lastPage; p++) {
      const res = await fetch(`${API_URL}/api/forum/list?page=${p}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
      forums = forums.concat(res.result?.data || []);
    }
  } catch {
    return;
  }

  // Only forums created by this user
  const myForums = forums.filter(f => String(f.created_by_id) === String(user.id));
  if (!myForums.length) return;

  const seen = meta.forumCounts || {};
  const nextCounts = { ...seen };
  const firstRun = !meta.forumInitialized;

  // For each of my forums, count comments + replies authored by OTHERS
  for (const f of myForums) {
    let detail;
    try {
      detail = await fetch(`${API_URL}/api/forum/forum-detail/${f.id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' } }).then(r => r.json());
    } catch {
      continue;
    }
    const forum = detail?.result;
    if (!forum) continue;

    let othersCount = 0;
    for (const c of forum.comment || []) {
      if (String(c.created_by_id) !== String(user.id)) othersCount++;
      for (const r of c.replies || []) {
        if (String(r.created_by_id) !== String(user.id)) othersCount++;
      }
    }

    const prev = seen[f.id] ?? 0;
    if (!firstRun && othersCount > prev && getNotificationPrefs().forumActivity) {
      const added = othersCount - prev;
      addNotification({
        key: `forum-${f.id}-${othersCount}`,
        kind: 'forum',
        title: `${added} new ${added === 1 ? 'reply' : 'replies'} on your forum post`,
        meta: `“${forum.title}”`,
        url: `/forum/${f.id}`,
      });
    }
    nextCounts[f.id] = othersCount;
  }

  setNotificationMeta({ ...getNotificationMeta(), forumInitialized: true, forumCounts: nextCounts });
}

export async function runNotificationChecks() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Forum activity check runs independently of the listing check
  await checkForumActivity(API_URL, getNotificationMeta());

  let listings = [];
  try {
    const [biz, re] = await Promise.all([
      fetch(`${API_URL}/api/business/find-business?search_type=business`).then(r => r.json()),
      fetch(`${API_URL}/api/business/find-business?search_type=real_estate`).then(r => r.json()),
    ]);
    listings = [...(biz.result || []), ...(re.result || [])];
  } catch {
    return; // offline / API down — try again next visit
  }
  if (!listings.length) return;

  const meta = getNotificationMeta();
  const currentIds = listings.map(l => l.id);

  if (!meta.initialized) {
    // First run for this user: baseline what exists, don't spam history.
    setNotificationMeta({ ...getNotificationMeta(), initialized: true, knownIds: currentIds });
    return;
  }

  const prefs = getNotificationPrefs();
  const known = new Set(meta.knownIds || []);
  const fresh = listings.filter(l => !known.has(l.id));
  const searches = getSearchHistory();

  fresh.forEach(l => {
    const title = l.listing_heading || l.business_name || 'New listing';
    const isRE = l.business_type === 'real-estate';

    // Saved-search matches take priority; otherwise a generic "new listing".
    const matched = searches.find(s => matchesSearch(l, s.url));
    if (matched) {
      if (!prefs.savedSearchMatches) return;
      addNotification({
        key: `match-${l.id}`,
        kind: isRE ? 'real_estate' : 'business',
        title: `New match for “${matched.label}”`,
        meta: withLocation(title, l),
        url: `/buy-business/${l.id}`,
      });
    } else {
      if (!prefs.newListings) return;
      addNotification({
        key: `new-${l.id}`,
        kind: isRE ? 'real_estate' : 'business',
        title: `New ${isRE ? 'real estate' : 'business'} listing published`,
        meta: withLocation(title, l),
        url: `/buy-business/${l.id}`,
      });
    }
  });

  // Price changes on saved listings
  getSavedListings().forEach(saved => {
    if (!prefs.priceChanges) return;
    const current = listings.find(l => l.id === saved.id);
    if (!current) return;
    const nowPrice = priceLabelFor(current);
    if (saved.price && nowPrice && nowPrice !== saved.price) {
      const loc = listingLocation(current);
      addNotification({
        key: `price-${saved.id}-${nowPrice}`,
        kind: 'price',
        title: 'Price updated on a saved listing',
        meta: `${saved.title}${loc ? ` (${loc})` : ''} — was ${saved.price}, now ${nowPrice}`,
        url: `/buy-business/${saved.id}`,
      });
      updateSavedListingPrice(saved.id, nowPrice);
    }
  });

  setNotificationMeta({ ...getNotificationMeta(), initialized: true, knownIds: currentIds });
}
