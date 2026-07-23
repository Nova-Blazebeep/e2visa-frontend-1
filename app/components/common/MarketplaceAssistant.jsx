'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { getSavedListings } from '@/app/utils/savedListings';
import { getSearchHistory, timeAgo } from '@/app/utils/searchHistory';
import { getNotifications } from '@/app/utils/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

// Brand palette
const DARK = '#2B2D2A';
const TEAL = '#2EC4B6';
const TEAL_DARK = '#22A99C';
const HEADER_GRADIENT = 'linear-gradient(135deg, #232522 0%, #40433F 55%, #2B2D2A 100%)';
const USER_GRADIENT = 'linear-gradient(135deg, #353834 0%, #232522 100%)';

// ─── Intent keywords ─────────────────────────────────────────────────────────
const RE_REAL_ESTATE = /real\s?estate|propert(y|ies)|house|home(?!\s?page)|apartment|condo|rent|lease|bedroom/i;
const RE_BUSINESS = /business|compan(y|ies)|store|shop|franchise|startup|e-?commerce|restaurant|cafe|café|hotel|salon/i;
const RE_PROFESSIONAL = /professional|broker|attorney|lawyer|agent|consultant|accountant|cpa|inspector|advisor|lender|loan officer|appraiser|insurance|moderator|title\s?company|financial advisor/i;
const RE_CONTACT = /contact|support|help\s?desk|complain|issue|problem|reach\s?(you|out)|talk to (someone|human)|customer service/i;
const RE_SELL = /sell my|list my|post my|add (a |my )?(listing|business|property)/i;
const RE_FORUM = /\b(forums?|discussions?|community|threads?)\b|ask (a )?question|post (a )?(question|comment)|\breply\b/i;
const RE_ARTICLES = /\b(articles?|blogs?|read|news|guides?|tips|learn)\b/i;
const RE_HELP = /\b(help|faq|faqs|what can you do|how (do|does) (this|it) work)\b/i;
const RE_GREETING = /^(hi|hello|hey|salam|assalam|good\s?(morning|afternoon|evening))\b/i;
const RE_LISTING = /listing|buy|sale|purchase|invest/i;

// ─── Dashboard (personal) intents ──
const RE_MY_SAVED = /\b(saved|favou?rite[ds]?|bookmark(ed|s)?|wish\s?list)\b/i;
const RE_MY_SEARCHES = /\b(my )?(recent )?(searches|search history|past searches)\b/i;
const RE_MY_NOTIFS = /\bnotification|\balerts?\b/i;
const RE_RECOMMENDED = /\brecommend(ed|ations?)?\b|\bsuggest(ed|ions?)?\b|recommended for me/i;
const RE_DASHBOARD = /\b(my )?dashboard\b|\bmy account\b/i;

const STOPWORDS = new Set([
  'show', 'find', 'want', 'need', 'looking', 'search', 'give', 'list', 'listings', 'listing',
  'business', 'businesses', 'real', 'estate', 'property', 'properties', 'with', 'that', 'have',
  'under', 'below', 'over', 'above', 'about', 'around', 'near', 'from', 'this', 'there', 'here',
  'please', 'some', 'any', 'the', 'and', 'for', 'buy', 'sale', 'sell', 'purchase', 'me', 'a', 'an', 'in',
]);

function extractPlace(text) {
  const cleaned = text.replace(/under|below|less than|over|above|more than/gi, '|').split('|')[0];
  const m = cleaned.match(/(?:in|at|near|around|from)\s+([a-z][a-z\s]{2,40}?)(?:\s*$|,)/i);
  if (m) return m[1].trim();
  return null;
}

function extractMaxPrice(text) {
  const m = text.match(/(?:under|below|less than|max(?:imum)?|up to)\s*\$?\s*([\d.,]+)\s*(k|m|million|thousand)?/i);
  if (!m) return null;
  let n = parseFloat(m[1].replace(/,/g, ''));
  if (isNaN(n)) return null;
  const unit = (m[2] || '').toLowerCase();
  if (unit === 'k' || unit === 'thousand') n *= 1_000;
  if (unit === 'm' || unit === 'million') n *= 1_000_000;
  return n;
}

function extractKeywords(text, place) {
  const placeWords = new Set((place || '').toLowerCase().split(/\s+/));
  return text
    .toLowerCase()
    .replace(/\$?[\d.,]+(k|m)?/g, ' ')
    .split(/[^a-z]+/)
    .filter(w => w.length > 3 && !STOPWORDS.has(w) && !placeWords.has(w));
}

function listingPrice(listing) {
  const isRE = listing.business_type === 'real-estate';
  if (isRE) {
    const rent = parseFloat(listing.monthly_rent);
    const sale = parseFloat(listing.sale_price);
    if (!isNaN(sale) && sale > 0) return { value: sale, label: `$${sale.toLocaleString()}` };
    if (!isNaN(rent) && rent > 0) return { value: rent, label: `$${rent.toLocaleString()}/mo` };
  }
  const price = parseFloat(listing.asking_price);
  if (!isNaN(price) && price > 0) return { value: price, label: `$${price.toLocaleString()}` };
  return { value: null, label: null };
}

function compact(n) {
  const v = parseFloat(n);
  if (isNaN(v) || v <= 0) return null;
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (v >= 1_000) return `$${Math.round(v / 1_000)}K`;
  return `$${v.toLocaleString()}`;
}

function listingLocation(listing) {
  return [listing.zip_code, listing.state?.name, listing.state_name, listing.country?.name]
    .filter(Boolean)
    .slice(0, 2)
    .join(', ');
}

function textFields(listing) {
  return [
    listing.zip_code, listing.street_address, listing.listing_heading, listing.business_name,
    listing.listing_summary, listing.state?.name, listing.county?.name, listing.country?.name,
    listing.state_name, listing.county_name, listing.category?.name, listing.property_type,
  ].filter(f => typeof f === 'string').map(f => f.toLowerCase());
}

function matchListing(listing, { place, keywords, maxPrice }) {
  const fields = textFields(listing);
  if (place && !fields.some(f => f.includes(place.toLowerCase()))) return false;
  if (keywords.length && !keywords.some(k => fields.some(f => f.includes(k)))) return false;
  if (maxPrice) {
    const { value } = listingPrice(listing);
    if (value !== null && value > maxPrice) return false;
  }
  return true;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Soft two-tone chime via Web Audio (may be silently blocked before first interaction)
function playChime(startFreq = 880, endFreq = 1174) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const play = (freq, at, dur = 0.12) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + at);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + at + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + dur + 0.05);
    };
    play(startFreq, 0);
    play(endFreq, 0.13);
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch { /* ignore */ }
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const I = {
  building: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  person: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  scales: <><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  headset: <><path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-6a9 9 0 0 1 18 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/><path d="M21 17v1a3 3 0 0 1-3 3h-4"/></>,
  news: <><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V6"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/></>,
  people: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chat: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  listIcon: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
};

const Icon = ({ path, size = 22, color = DARK, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {path}
  </svg>
);

const RobotIcon = ({ size = 16, color = 'white' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <circle cx="9" cy="14" r="1" fill={color} stroke="none" />
    <circle cx="15" cy="14" r="1" fill={color} stroke="none" />
    <path d="M12 8V5" />
    <circle cx="12" cy="4" r="1" fill={color} stroke="none" />
  </svg>
);

const QUICK_ACTIONS = [
  { icon: I.building, label: 'Find a Business', query: 'Show me businesses for sale' },
  { icon: I.home, label: 'Find Real Estate', query: 'Show me real estate listings' },
  { icon: I.person, label: 'Find a Broker', query: 'I need a business broker' },
  { icon: I.scales, label: 'Find an Attorney', query: 'I need an attorney' },
  { icon: I.briefcase, label: 'Sell My Business', query: 'I want to sell my business' },
  { icon: I.chat, label: 'Forum', query: 'I want to ask a question on the forum' },
  { icon: I.news, label: 'Articles', query: 'I want to read articles' },
  { icon: I.people, label: 'Find a Professional', query: 'I need a professional' },
  { icon: I.heart, label: 'My Saved Listings', query: 'Show my saved listings' },
];

const BotAvatar = () => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ring-2 ring-white shadow"
    style={{ background: HEADER_GRADIENT }}
  >
    <RobotIcon size={15} color={TEAL} />
  </div>
);

const ListingRow = ({ listing, onNavigate }) => {
  const img = listing.business_images?.[0]?.image_path
    ? `${STORAGE_URL}/${listing.business_images[0].image_path}`
    : null;
  const { label: price } = listingPrice(listing);
  const loc = listingLocation(listing);
  const revenue = compact(listing.gross_revenue);
  const cashFlow = compact(listing.cash_flow);
  return (
    <Link
      href={`/buy-business/${listing.id}`}
      onClick={onNavigate}
      className="group flex gap-3 items-center px-3 py-2.5 hover:bg-[#2EC4B6]/5 transition-colors"
    >
      <div className="w-[72px] h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {img ? (
          <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold truncate" style={{ color: DARK }}>{listing.listing_heading || listing.business_name}</p>
        {loc && (
          <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
            <Icon path={I.pin} size={11} color="#6b7280" className="flex-shrink-0" />
            {loc}
          </p>
        )}
        <p className="text-[12px] truncate">
          {price && <span className="font-bold" style={{ color: TEAL_DARK }}>{price}</span>}
          {revenue && <span className="text-gray-500 ml-2.5">{revenue} Revenue</span>}
          {cashFlow && <span className="text-gray-500 ml-2.5">{cashFlow} Cash Flow</span>}
        </p>
      </div>
      <svg className="flex-shrink-0 text-gray-300 group-hover:text-[#2EC4B6] group-hover:translate-x-0.5 transition-all" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
    </Link>
  );
};

const MarketplaceAssistant = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hi! I'm your E2Visa Marketplace Assistant 👋\nI can help you find businesses, real estate, brokers, attorneys, and advisors.\n\nHow can I help you today?",
      quickActions: true,
      ts: nowTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef(null);
  const rolesRef = useRef(null);
  const listingsCache = useRef({});

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, typing, open, expanded]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!hasOpened) playChime();
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushBot = (msg) => setMessages(prev => [...prev, { from: 'bot', ts: nowTime(), ...msg }]);

  async function getListings(type) {
    if (listingsCache.current[type]) return listingsCache.current[type];
    const res = await fetch(`${API_URL}/api/business/find-business?search_type=${type}`);
    const data = await res.json();
    const items = data.result || [];
    listingsCache.current[type] = items;
    return items;
  }

  async function getRoles() {
    if (rolesRef.current) return rolesRef.current;
    const res = await fetch(`${API_URL}/api/professionals/list`);
    const data = await res.json();
    rolesRef.current = data.result || [];
    return rolesRef.current;
  }

  async function searchListings(types, text) {
    const place = extractPlace(text);
    const maxPrice = extractMaxPrice(text);
    const keywords = extractKeywords(text, place);
    const criteria = { place, keywords, maxPrice };

    const all = (await Promise.all(types.map(getListings))).flat();
    const matched = all.filter(l => matchListing(l, criteria));
    const browseHref = types.length === 1 && types[0] === 'real_estate' ? '/real-estate' : '/buy-business';

    const describe = [
      place ? `in ${place.replace(/\b\w/g, c => c.toUpperCase())}` : null,
      maxPrice ? `under $${maxPrice.toLocaleString()}` : null,
    ].filter(Boolean).join(' ');

    if (matched.length === 0) {
      pushBot({
        text: `I couldn't find any listings ${describe || 'matching that'}. Try another city, a higher budget, or browse everything.`,
        link: { href: browseHref, text: 'Browse all listings' },
      });
    } else {
      pushBot({
        text: `I found ${matched.length} listing${matched.length > 1 ? 's' : ''} ${describe ? describe + ' ' : ''}matching your requirements.`,
        listings: matched.slice(0, 4),
        viewAll: { href: browseHref, count: matched.length },
      });
    }
  }

  async function handleProfessionals(text) {
    try {
      const roles = await getRoles();
      const t = text.toLowerCase();
      const matched = roles.filter(r => {
        const words = r.name.toLowerCase().split(/[^a-z]+/).filter(w => w.length > 3);
        return words.some(w => t.includes(w));
      });
      pushBot({
        text: matched.length === 1
          ? `You can find our ${matched[0].name}s here:`
          : matched.length > 1
            ? 'I found a few types of professionals that might fit — pick one:'
            : 'We have trusted professionals across many fields — which one do you need?',
        roles: matched.length ? matched : roles,
      });
    } catch {
      pushBot({
        text: 'You can browse all our professionals from the "Find a Professional" menu.',
        link: { href: '/professionals', text: 'Find a Professional →' },
      });
    }
  }

  function handleSavedListings() {
    const saved = getSavedListings();
    if (saved.length === 0) {
      pushBot({
        text: "You haven't saved any listings yet. Tap the heart on any business or property and it'll show up here and in your dashboard.",
        link: { href: '/buy-business', text: 'Browse businesses →' },
      });
      return;
    }
    pushBot({
      text: `You have ${saved.length} saved listing${saved.length > 1 ? 's' : ''}:`,
      items: saved.slice(0, 5).map(s => ({
        title: s.title,
        sub: [s.location, s.price].filter(Boolean).join(' · '),
        url: `/buy-business/${s.id}`,
        thumb: s.image ? `${STORAGE_URL}/${s.image}` : null,
        icon: s.type === 'Real Estate' ? 'home' : 'briefcase',
      })),
      dashLink: { href: '/dashboard?section=saved', text: 'View all saved listings →' },
    });
  }

  function handleMySearches() {
    const searches = getSearchHistory();
    if (searches.length === 0) {
      pushBot({
        text: "You haven't run any searches yet. Use the filters on the Find a Business or Real Estate pages and I'll keep your history here.",
        link: { href: '/buy-business', text: 'Start searching →' },
      });
      return;
    }
    pushBot({
      text: `Here are your recent searches:`,
      items: searches.slice(0, 5).map(s => ({
        title: s.label,
        sub: [s.meta, timeAgo(s.searchedAt)].filter(Boolean).join(' · '),
        url: s.url,
        icon: s.type === 'real_estate' ? 'home' : 'briefcase',
      })),
      dashLink: { href: '/dashboard?section=searches', text: 'View all searches →' },
    });
  }

  async function handleRecommended() {
    try {
      const [biz, re] = await Promise.all([getListings('business'), getListings('real_estate')]);
      const all = [...(biz || []), ...(re || [])];
      if (all.length === 0) {
        pushBot({
          text: 'No listings are published yet — check back soon for recommendations!',
          link: { href: '/buy-business', text: 'Browse listings →' },
        });
        return;
      }

      // Build interest tokens from the user's searches + saved listings
      const tokens = new Set();
      getSearchHistory().forEach(s => `${s.label} ${s.meta}`.toLowerCase().split(/[^a-z]+/).forEach(w => w.length > 3 && tokens.add(w)));
      getSavedListings().forEach(s => `${s.title} ${s.location}`.toLowerCase().split(/[^a-z]+/).forEach(w => w.length > 3 && tokens.add(w)));
      const savedIds = new Set(getSavedListings().map(s => s.id));

      // Score each listing by how many interest tokens it matches; skip already-saved
      const scored = all
        .filter(l => !savedIds.has(l.id))
        .map(l => {
          const hay = textFields(l).join(' ');
          let score = 0;
          tokens.forEach(t => { if (hay.includes(t)) score += 1; });
          return { l, score };
        })
        .sort((a, b) => b.score - a.score || b.l.id - a.l.id);

      const personalized = tokens.size > 0 && scored.some(s => s.score > 0);
      const picks = scored.slice(0, 4).map(s => s.l);

      pushBot({
        text: personalized
          ? 'Based on your searches and saved listings, here are a few you might like:'
          : 'Here are some listings you might be interested in:',
        listings: picks,
        link: { href: '/dashboard', text: 'See more on my dashboard →' },
      });
    } catch {
      pushBot({
        text: 'Your personalized recommendations are on your dashboard.',
        link: { href: '/dashboard', text: 'Open my dashboard →' },
      });
    }
  }

  function handleNotifications(text) {
    let notifs = getNotifications();
    const unreadOnly = /\bunread\b/i.test(text);
    if (unreadOnly) notifs = notifs.filter(n => !n.read);
    if (notifs.length === 0) {
      pushBot({
        text: unreadOnly
          ? "You're all caught up — no unread notifications."
          : "You don't have any notifications yet. I'll alert you here when new listings match your searches or a saved listing changes price.",
        link: { href: '/dashboard?section=notifications', text: 'Open notifications →' },
      });
      return;
    }
    const unread = getNotifications().filter(n => !n.read).length;
    pushBot({
      text: unreadOnly
        ? `You have ${notifs.length} unread notification${notifs.length > 1 ? 's' : ''}:`
        : `You have ${notifs.length} notification${notifs.length > 1 ? 's' : ''}${unread ? ` (${unread} unread)` : ''}:`,
      items: notifs.slice(0, 5).map(n => ({
        title: n.title,
        sub: [n.meta, timeAgo(n.createdAt)].filter(Boolean).join(' · '),
        url: n.url || '/dashboard?section=notifications',
        icon: n.kind === 'real_estate' ? 'home' : n.kind === 'price' ? 'pin' : n.kind === 'forum' ? 'chat' : 'briefcase',
      })),
      dashLink: { href: '/dashboard?section=notifications', text: 'View all notifications →' },
    });
  }

  async function respond(text) {
    if (RE_HELP.test(text) && !RE_CONTACT.test(text)) {
      pushBot({
        text: "Here's what I can do:\n• Search businesses for sale — “restaurants in Miami under $700,000”\n• Search real estate — “houses for rent in Naples”\n• Connect you with professionals — “I need an attorney”\n• Show your personal stuff — “my saved listings”, “my recent searches”, “my notifications”\n• Point you to the forum, articles, or support.\n\nJust type what you're looking for!",
        quickActions: true,
      });
      return;
    }
    if (RE_CONTACT.test(text)) {
      pushBot({
        text: 'Our team is happy to help! Reach us through the contact page and we usually respond quickly.',
        link: { href: '/contact', text: 'Go to Contact Us →' },
      });
      return;
    }

    // ── Personal dashboard questions (require sign-in) ──
    const asksDashboard = RE_MY_SAVED.test(text) || RE_MY_SEARCHES.test(text) ||
      RE_MY_NOTIFS.test(text) || RE_RECOMMENDED.test(text) || RE_DASHBOARD.test(text);
    if (asksDashboard) {
      if (!user) {
        pushBot({
          text: 'Sign in to see your saved listings, searches, and notifications — they live in your personal dashboard.',
          links: [
            { href: '/signin', text: 'Sign In', primary: true },
            { href: '/signup-options', text: 'Create Account' },
          ],
        });
        return;
      }
      if (RE_MY_SAVED.test(text)) { handleSavedListings(); return; }
      if (RE_MY_NOTIFS.test(text)) { handleNotifications(text); return; }
      if (RE_MY_SEARCHES.test(text)) { handleMySearches(); return; }
      if (RE_RECOMMENDED.test(text)) { await handleRecommended(); return; }
      // Generic dashboard
      pushBot({
        text: 'Your dashboard has your saved listings, recent searches, notifications, and recommendations all in one place.',
        link: { href: '/dashboard', text: 'Open my dashboard →' },
      });
      return;
    }

    if (RE_SELL.test(text)) {
      pushBot({
        text: 'Great — to sell on E2Visa you can publish your listing with photos, financials, and an NDA if you need one.\n\nCreate a new seller account, or sign in if you already have one:',
        links: [
          { href: '/signup-options', text: 'Create Account', primary: true },
          { href: '/signin', text: 'Sign In' },
        ],
      });
      return;
    }
    if (RE_FORUM.test(text)) {
      pushBot({
        text: 'Our community forum is the place to ask questions, share your experience, comment, and reply to other members — buyers, sellers, and professionals are all there.',
        link: { href: '/forum', text: 'Go to the Forum →' },
      });
      return;
    }
    if (RE_ARTICLES.test(text)) {
      pushBot({
        text: 'We publish articles and guides about buying businesses, real estate, and the E-2 visa journey. Have a read!',
        link: { href: '/articles', text: 'Browse Articles →' },
      });
      return;
    }
    if (RE_PROFESSIONAL.test(text)) {
      await handleProfessionals(text);
      return;
    }
    try {
      if (RE_REAL_ESTATE.test(text) && RE_BUSINESS.test(text)) {
        await searchListings(['business', 'real_estate'], text);
      } else if (RE_REAL_ESTATE.test(text)) {
        await searchListings(['real_estate'], text);
      } else if (RE_BUSINESS.test(text)) {
        await searchListings(['business'], text);
      } else if (RE_LISTING.test(text) || extractPlace(text)) {
        await searchListings(['business', 'real_estate'], text);
      } else if (RE_GREETING.test(text)) {
        pushBot({ text: 'Hello! 👋 What can I help you with today?', quickActions: true });
      } else {
        pushBot({
          text: 'I can help you find businesses for sale, real estate listings, or professionals like brokers and attorneys. Try “restaurants in Miami under $700,000” or “I need an attorney”.',
          quickActions: true,
        });
      }
    } catch {
      pushBot({ text: 'Sorry, something went wrong while searching. Please try again in a moment.' });
    }
  }

  const send = async (raw) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text, ts: nowTime() }]);
    setTyping(true);
    await new Promise(r => setTimeout(r, 450));
    await respond(text);
    setTyping(false);
    playChime(660, 880);
  };

  const close = () => setOpen(false);
  const toggle = () => {
    setOpen(o => !o);
    setHasOpened(true);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes assistant-nudge {
          0%, 74%, 100% { transform: translateY(0) rotate(0deg); }
          76% { transform: translateY(-6px) rotate(-8deg); }
          80% { transform: translateY(0) rotate(8deg); }
          84% { transform: translateY(-4px) rotate(-6deg); }
          88% { transform: translateY(0) rotate(4deg); }
          92% { transform: translateY(0) rotate(0deg); }
        }
        .assistant-attention { animation: assistant-nudge 4s ease-in-out infinite; }

        @keyframes assistant-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        .assistant-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: ${TEAL};
          animation: assistant-ring 2s ease-out infinite;
          z-index: -1;
        }

        @keyframes chat-pop {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-pop { animation: chat-pop 0.28s ease-out both; }

        @keyframes panel-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .panel-in { animation: panel-in 0.24s ease-out both; }

        .assistant-scroll { scrollbar-width: thin; scrollbar-color: ${TEAL} #e8eae8; }
        .assistant-scroll::-webkit-scrollbar { width: 9px; }
        .assistant-scroll::-webkit-scrollbar-track { background: #e8eae8; border-radius: 99px; }
        .assistant-scroll::-webkit-scrollbar-thumb {
          background: ${TEAL};
          border-radius: 99px;
          border: 2px solid #e8eae8;
        }
        .assistant-scroll::-webkit-scrollbar-thumb:hover { background: ${TEAL_DARK}; }
      `}</style>

      {/* Floating toggle button */}
      <button
        onClick={toggle}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        className={`fixed bottom-5 right-5 z-[9998] w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 ${
          !open && !hasOpened ? 'assistant-attention assistant-ring' : ''
        }`}
        style={{ background: HEADER_GRADIENT }}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <>
            <RobotIcon size={26} color={TEAL} />
            {!hasOpened && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">1</span>
            )}
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className={`panel-in fixed bottom-24 right-5 z-[9998] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden ${
            expanded ? 'w-[95vw] max-w-[560px] h-[calc(100vh-130px)]' : 'w-[92vw] max-w-[400px] h-[600px] max-h-[calc(100vh-120px)]'
          }`}
        >
          {/* Header */}
          <div className="relative text-white px-4 py-3.5 flex items-center gap-3" style={{ background: HEADER_GRADIENT }}>
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center ring-2 ring-[#2EC4B6]/40">
                <RobotIcon size={24} color={DARK} />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2" style={{ borderColor: '#2B2D2A' }}></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[16px] font-bold leading-tight truncate">E2Visa Marketplace Assistant</p>
              <p className="text-[12px] truncate flex items-center gap-1.5 text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                Online · Your Investment Guide
              </p>
            </div>
            <button
              onClick={() => setExpanded(e => !e)}
              aria-label={expanded ? 'Shrink' : 'Expand'}
              className="p-1.5 text-gray-300 hover:text-white transition-colors hidden sm:block"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {expanded
                  ? <><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></>
                  : <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></>}
              </svg>
            </button>
            <button onClick={close} aria-label="Close" className="p-1.5 text-gray-300 hover:text-white transition-colors">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            {/* Teal accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${TEAL} 0%, ${TEAL}55 60%, transparent 100%)` }}></div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="assistant-scroll flex-1 overflow-y-auto px-3.5 py-4 space-y-3 bg-[#F7F8F7]">
            {messages.map((m, i) => (
              <div key={i} className={`chat-pop flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.from === 'bot' && <BotAvatar />}
                <div className={`space-y-2 ${m.from === 'user' ? 'max-w-[80%]' : 'flex-1 max-w-[88%]'}`}>
                  <div className={m.from === 'user' ? 'flex flex-col items-end' : ''}>
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed w-fit whitespace-pre-line ${
                        m.from === 'user' ? 'text-white rounded-br-md shadow-md' : 'bg-white border border-gray-100 shadow-sm rounded-tl-md'
                      }`}
                      style={m.from === 'user' ? { background: USER_GRADIENT } : { color: DARK }}
                    >
                      {m.text}
                      {m.from === 'bot' && m.ts && (
                        <div className="text-[10px] text-gray-400 mt-1.5">{m.ts}</div>
                      )}
                    </div>
                    {m.from === 'user' && m.ts && (
                      <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                        {m.ts}
                        <svg width="14" height="10" viewBox="0 0 18 12" fill="none" stroke={TEAL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 6 4.5 9.5 10.5 2.5" />
                          <polyline points="7 6.5 10 9.5 16 2.5" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {m.listings && (
                    <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                      {m.listings.map(l => (
                        <ListingRow key={l.id} listing={l} onNavigate={close} />
                      ))}
                      {m.viewAll && (
                        <Link
                          href={m.viewAll.href}
                          onClick={close}
                          className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold hover:bg-[#2EC4B6]/5 transition-colors"
                          style={{ color: TEAL_DARK }}
                        >
                          <Icon path={I.listIcon} size={15} color={TEAL_DARK} />
                          View All {m.viewAll.count} Result{m.viewAll.count > 1 ? 's' : ''}
                        </Link>
                      )}
                    </div>
                  )}

                  {m.items && (
                    <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                      {m.items.map((it, idx) => (
                        <Link
                          key={idx}
                          href={it.url}
                          onClick={close}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#2EC4B6]/5 transition-colors"
                        >
                          <span className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {it.thumb
                              ? <img src={it.thumb} alt="" className="w-full h-full object-cover" />
                              : <Icon path={I[it.icon] || I.briefcase} size={15} color={TEAL_DARK} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold truncate" style={{ color: DARK }}>{it.title}</p>
                            {it.sub && <p className="text-[11px] text-gray-500 truncate">{it.sub}</p>}
                          </div>
                          <svg className="flex-shrink-0 text-gray-300" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        </Link>
                      ))}
                      {m.dashLink && (
                        <Link
                          href={m.dashLink.href}
                          onClick={close}
                          className="flex items-center justify-center gap-2 py-2.5 text-sm font-bold hover:bg-[#2EC4B6]/5 transition-colors"
                          style={{ color: TEAL_DARK }}
                        >
                          {m.dashLink.text}
                        </Link>
                      )}
                    </div>
                  )}

                  {m.roles && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.roles.map(r => (
                        <Link
                          key={r.id}
                          href={`/professionals?role=${r.id}`}
                          onClick={close}
                          className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-[#2EC4B6] hover:shadow-sm rounded-full pl-1 pr-3 py-1 text-xs font-medium transition-all"
                          style={{ color: DARK }}
                        >
                          {r.badge?.icon ? (
                            <img src={`${STORAGE_URL}/${r.badge.icon}`} alt="" className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center">
                              <Icon path={I.person} size={11} color={TEAL_DARK} />
                            </span>
                          )}
                          {r.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.link && (
                    <Link
                      href={m.link.href}
                      onClick={close}
                      className="inline-flex items-center gap-1 text-sm font-bold hover:underline"
                      style={{ color: TEAL_DARK }}
                    >
                      {m.link.text}
                    </Link>
                  )}

                  {m.links && (
                    <div className="flex flex-wrap gap-2">
                      {m.links.map((lnk, li) => (
                        <Link
                          key={li}
                          href={lnk.href}
                          onClick={close}
                          className={`inline-flex items-center gap-1 text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors ${
                            lnk.primary
                              ? 'text-white hover:opacity-90'
                              : 'border border-gray-200 hover:border-[#2EC4B6]'
                          }`}
                          style={lnk.primary ? { background: TEAL_DARK } : { color: DARK }}
                        >
                          {lnk.text}
                        </Link>
                      ))}
                    </div>
                  )}

                  {m.quickActions && (
                    <div className="grid grid-cols-3 gap-2">
                      {QUICK_ACTIONS.map(a => (
                        <button
                          key={a.label}
                          onClick={() => send(a.query)}
                          className="group bg-white border border-gray-200 hover:border-[#2EC4B6] hover:shadow-md hover:-translate-y-0.5 rounded-2xl px-2 py-3 flex flex-col items-center gap-2 transition-all duration-200"
                        >
                          <span className="w-9 h-9 rounded-xl bg-[#2EC4B6]/10 group-hover:bg-[#2EC4B6]/20 flex items-center justify-center transition-colors">
                            <Icon path={a.icon} size={18} color={TEAL_DARK} />
                          </span>
                          <span className="text-[11px] font-semibold text-center leading-tight" style={{ color: DARK }}>{a.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="chat-pop flex gap-2 justify-start">
                <BotAvatar />
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-md px-4 py-3 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: TEAL, animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask me anything…"
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-gray-200 focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 bg-gray-50 transition-shadow"
                style={{ color: DARK }}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                aria-label="Send"
                className="w-10 h-10 rounded-full disabled:opacity-40 text-white flex items-center justify-center transition-all hover:scale-105 shadow-md flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)` }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-1.5">AI responses may not be 100% accurate.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplaceAssistant;
