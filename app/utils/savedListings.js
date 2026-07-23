// Saved listings live in localStorage until the backend endpoint exists.
// Favorites are stored per signed-in user so accounts don't share them.
export const SAVED_LISTINGS_EVENT = 'saved-listings-updated';

function storageKey() {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userKey = user?.id ?? user?.email;
    return userKey ? `savedListings:${userKey}` : null;
  } catch {
    return null;
  }
}

export function getSavedListings() {
  const key = storageKey();
  if (!key) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function isListingSaved(id) {
  return getSavedListings().some(l => l.id === id);
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

// Keep a small snapshot so the dashboard can render without refetching.
function makeSnapshot(listing) {
  return {
    id: listing.id,
    title: listing.listing_heading || listing.business_name || 'Listing',
    image: listing.business_images?.[0]?.image_path || null,
    location: [listing.zip_code, listing.state?.name || listing.state_name]
      .filter(Boolean)
      .join(', '),
    type: listing.business_type === 'real-estate' ? 'Real Estate' : 'Business',
    price: priceLabelFor(listing),
    savedAt: Date.now(),
  };
}

// Returns true if the listing is saved after the toggle.
export function toggleSavedListing(listing) {
  const key = storageKey();
  if (!key) return false; // not signed in — caller should gate on auth
  const all = getSavedListings();
  const exists = all.some(l => l.id === listing.id);
  const next = exists
    ? all.filter(l => l.id !== listing.id)
    : [makeSnapshot(listing), ...all];
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(SAVED_LISTINGS_EVENT));
  return !exists;
}

// Used by the notification checker to keep saved snapshots current.
export function updateSavedListingPrice(id, price) {
  const key = storageKey();
  if (!key) return;
  const next = getSavedListings().map(l => (l.id === id ? { ...l, price } : l));
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(SAVED_LISTINGS_EVENT));
}

export function removeSavedListing(id) {
  const key = storageKey();
  if (!key) return;
  const next = getSavedListings().filter(l => l.id !== id);
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(SAVED_LISTINGS_EVENT));
}
