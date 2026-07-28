'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { getSavedListings, removeSavedListing, SAVED_LISTINGS_EVENT } from '@/app/utils/savedListings';
import { getSearchHistory, removeSearch, SEARCH_HISTORY_EVENT, timeAgo } from '@/app/utils/searchHistory';
import { getNotifications, markRead, markAllRead, removeNotification, NOTIFICATIONS_EVENT } from '@/app/utils/notifications';
import { runNotificationChecks } from '@/app/utils/notificationChecks';
import DashboardSettings from '@/app/components/profile/DashboardSettings';
import SaveListingButton from '@/app/components/common/SaveListingButton';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { USER_DETAIL_UPDATED_EVENT } from '@/app/utils/userDetail';
import { DASHBOARD_OVERVIEW_ENABLED, DASHBOARD_SEARCH_ENABLED } from '@/app/config/featureFlags';
import { toast } from 'react-toastify';

const API = process.env.NEXT_PUBLIC_API_URL;
const STORAGE = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

function recPrice(l) {
  const isRE = l.business_type === 'real-estate';
  if (isRE) {
    const sale = parseFloat(l.sale_price), rent = parseFloat(l.monthly_rent);
    if (!isNaN(sale) && sale > 0) return `$${sale.toLocaleString()}`;
    if (!isNaN(rent) && rent > 0) return `$${rent.toLocaleString()}/mo`;
  }
  const p = parseFloat(l.asking_price);
  return !isNaN(p) && p > 0 ? `$${p.toLocaleString()}` : null;
}

function recLocation(l) {
  const county = l.county?.name || l.county_name;
  const state = l.state?.name || l.state_name;
  if (county && state && !county.toLowerCase().includes(state.toLowerCase())) return `${county}, ${state}`;
  return county || state || l.country?.name || '';
}

const DARK = '#40433F';
const TEAL = '#2EC4B6';
const TEAL_DARK = '#22A99C';
const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

// Visual style per recorded search type
const SEARCH_STYLE = {
  business: { icon: 'briefcase', tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK },
  real_estate: { icon: 'home', tint: 'bg-emerald-500/10', color: '#059669' },
};

// Icon per notification kind
const NOTIF_STYLE = {
  business: { icon: 'briefcase', tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK },
  real_estate: { icon: 'home', tint: 'bg-emerald-500/10', color: '#059669' },
  price: { icon: 'bell', tint: 'bg-orange-500/10', color: '#ea580c' },
  forum: { icon: 'chat', tint: 'bg-violet-500/10', color: '#7c3aed' },
  general: { icon: 'bell', tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK },
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const PATHS = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
  person: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
  people: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  chat: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  chevron: <polyline points="9 18 15 12 9 6"/>,
  arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
  clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
};

const Icon = ({ name, size = 18, color = DARK, className = '', fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {PATHS[name]}
  </svg>
);

// ─── Sidebar config ──────────────────────────────────────────────────────────
const FULL_MENU = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { key: 'saved', label: 'My Saved Listings', icon: 'heart' },
  { key: 'searches', label: 'My Searches', icon: 'search' },
  { key: 'notifications', label: 'Notifications', icon: 'bell', badgeKey: 'unread' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
];

// Temporarily hidden per client request (DASHBOARD_OVERVIEW_ENABLED in
// featureFlags.js) — only Settings shows in the sidebar until re-enabled.
// FULL_MENU above is untouched; flip the flag to restore everything.
const MENU = DASHBOARD_OVERVIEW_ENABLED
  ? FULL_MENU
  : FULL_MENU.filter(item => item.key === 'settings');

const BROWSE = [
  { label: 'Businesses', icon: 'briefcase', href: '/buy-business' },
  { label: 'Real Estate', icon: 'home', href: '/real-estate' },
  { label: 'Professionals', icon: 'people', href: '/professionals' },
  { label: 'Forum', icon: 'chat', href: '/forum' },
  { label: 'Articles', icon: 'file', href: '/articles' },
];

const TABS = ['Businesses', 'Real Estate'];
const TAB_LINKS = { Businesses: '/buy-business', 'Real Estate': '/real-estate' };

// ─── Page ────────────────────────────────────────────────────────────────────
const VALID_SECTIONS = ['dashboard', 'saved', 'searches', 'notifications', 'settings'];

function DashboardContent() {
  const searchParams = useSearchParams();
  const rawSection = searchParams.get('section');
  // "profile" links open Settings on its Profile tab
  const defaultSection = DASHBOARD_OVERVIEW_ENABLED ? 'dashboard' : 'settings';
  const requestedSection = rawSection === 'profile'
    ? 'settings'
    : VALID_SECTIONS.includes(rawSection) ? rawSection : defaultSection;
  // Overview temporarily disabled — bounce any deep link into a hidden
  // section (dashboard/saved/searches/notifications) straight to Settings.
  const initialSection = !DASHBOARD_OVERVIEW_ENABLED && requestedSection !== 'settings'
    ? 'settings'
    : requestedSection;
  const initialSettingsTab = rawSection === 'profile' ? 'profile' : (searchParams.get('tab') || 'profile');
  const [section, setSection] = useState(initialSection);
  const [tab, setTab] = useState('Businesses');
  const [savedListings, setSavedListings] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recommended, setRecommended] = useState({ Businesses: [], 'Real Estate': [], Professionals: [] });
  const [recLoading, setRecLoading] = useState(true);
  const [searchIndex, setSearchIndex] = useState({ businesses: [], realEstate: [], professionals: [], articles: [] });
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [userName, setUserName] = useState('');
  const { user, loading } = useAuth();
  const router = useRouter();

  // Read the user's display name from stored profile
  useEffect(() => {
    const load = () => {
      try {
        const d = JSON.parse(localStorage.getItem('userDetail'));
        setUserName(d?.name || '');
      } catch { setUserName(''); }
    };
    load();
    window.addEventListener(USER_DETAIL_UPDATED_EVENT, load);
    return () => window.removeEventListener(USER_DETAIL_UPDATED_EVENT, load);
  }, [user]);
  const firstName = userName ? userName.split(' ')[0] : '';

  // Load real "Recommended for You" data from the APIs
  useEffect(() => {
    let active = true;
    (async () => {
      setRecLoading(true);
      const safe = async (url) => {
        try { const r = await fetch(url); const d = await r.json(); return d.result || []; }
        catch { return []; }
      };
      const [biz, re, pros, blogs] = await Promise.all([
        safe(`${API}/api/business/find-business?search_type=business`),
        safe(`${API}/api/business/find-business?search_type=real_estate`),
        safe(`${API}/api/professionals/featured-professionals`),
        safe(`${API}/api/blogs-list`),
      ]);
      if (!active) return;
      setRecommended({
        Businesses: (biz || []).slice(0, 3),
        'Real Estate': (re || []).slice(0, 3),
        Professionals: (pros || []).slice(0, 3),
      });
      // Full lists power the top search bar
      setSearchIndex({
        businesses: biz || [],
        realEstate: re || [],
        professionals: pros || [],
        articles: Array.isArray(blogs) ? blogs : (blogs?.data || []),
      });
      setRecLoading(false);
    })();
    return () => { active = false; };
  }, []);

  // Overview temporarily disabled — if section ever lands on a hidden value
  // (e.g. a deep link followed while already mounted), bounce to Settings.
  useEffect(() => {
    if (!DASHBOARD_OVERVIEW_ENABLED && section !== 'settings') {
      setSection('settings');
    }
  }, [section]);

  // Dashboard is for signed-in users only
  useEffect(() => {
    if (!loading && !user) router.replace('/signin');
  }, [loading, user, router]);

  useEffect(() => {
    const sync = () => setSavedListings(getSavedListings());
    sync();
    window.addEventListener(SAVED_LISTINGS_EVENT, sync);
    return () => window.removeEventListener(SAVED_LISTINGS_EVENT, sync);
  }, [user]);

  useEffect(() => {
    const sync = () => setSearchHistory(getSearchHistory());
    sync();
    window.addEventListener(SEARCH_HISTORY_EVENT, sync);
    return () => window.removeEventListener(SEARCH_HISTORY_EVENT, sync);
  }, [user]);

  useEffect(() => {
    const sync = () => setNotifications(getNotifications());
    sync();
    window.addEventListener(NOTIFICATIONS_EVENT, sync);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, sync);
  }, [user]);

  // Check for new listings / saved-search matches / price changes on load
  useEffect(() => {
    if (user) runNotificationChecks();
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Top search: filter the cached lists across all categories ──
  const q = query.trim().toLowerCase();
  const searchResults = (() => {
    if (q.length < 2) return null;
    const listingMatch = (l) => {
      const hay = [l.listing_heading, l.business_name, l.category?.name, l.county?.name, l.state?.name, l.state_name, l.property_type]
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    };
    const businesses = searchIndex.businesses.filter(listingMatch).slice(0, 4);
    const realEstate = searchIndex.realEstate.filter(listingMatch).slice(0, 4);
    const professionals = searchIndex.professionals.filter(p =>
      [p.name, p.role, p.user_information?.state_name].filter(Boolean).join(' ').toLowerCase().includes(q)
    ).slice(0, 4);
    const articles = searchIndex.articles.filter(a =>
      (a.title || '').toLowerCase().includes(q)
    ).slice(0, 4);
    return { businesses, realEstate, professionals, articles };
  })();

  const totalResults = searchResults
    ? searchResults.businesses.length + searchResults.realEstate.length + searchResults.professionals.length + searchResults.articles.length
    : 0;

  if (loading || !user) {
    return (
      <div className="bg-[#F4F5F4] min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const savedBusinesses = savedListings.filter(l => l.type === 'Business');
  const savedProperties = savedListings.filter(l => l.type === 'Real Estate');

  // Businesses & properties counts are live (from saved listings);
  // professionals & articles stay mocked until their save feature exists.
  const stats = [
    { label: 'Saved Businesses', value: savedBusinesses.length, tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK, icon: 'briefcase', onClick: () => setSection('saved') },
    { label: 'Saved Real Estate', value: savedProperties.length, tint: 'bg-emerald-500/10', color: '#059669', icon: 'home', onClick: () => setSection('saved') },
  ];

  const handleRemoveSaved = (item) => {
    removeSavedListing(item.id);
    toast.info('Removed from your saved listings', { position: 'top-right', autoClose: 2000 });
  };

  const SectionPlaceholder = ({ icon, title, text }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center text-center">
      <span className="w-14 h-14 rounded-2xl bg-[#2EC4B6]/10 flex items-center justify-center mb-4">
        <Icon name={icon} size={26} color={TEAL_DARK} />
      </span>
      <h2 className="text-xl font-bold mb-1" style={{ color: DARK }}>{title}</h2>
      <p className="text-sm text-gray-500 max-w-sm">{text}</p>
    </div>
  );

  return (
    <div className="bg-[#F4F5F4] min-h-screen">
      <div className="flex">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 px-4 py-6 flex-shrink-0">
          <nav className="space-y-1">
            {MENU.map(item =>
              item.href ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#40433F] hover:bg-gray-50 transition-colors"
                >
                  <Icon name={item.icon} size={17} />
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => setSection(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    section === item.key
                      ? 'bg-[#40433F]/10 text-[#40433F]'
                      : 'text-[#40433F] hover:bg-gray-50'
                  }`}
                >
                  <Icon name={item.icon} size={17} color={DARK} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badgeKey === 'unread' && unreadCount > 0 && (
                    <span className="min-w-[20px] h-5 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: TEAL }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              )
            )}
          </nav>

          <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mt-8 mb-2 px-3.5">Browse</p>
          <nav className="space-y-1">
            {BROWSE.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#40433F] hover:bg-gray-50 transition-colors"
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 min-w-0">
          {/* Top bar — hidden entirely when neither the search box nor the
              notification/profile icons (its only contents) are enabled,
              so it doesn't leave an empty padded strip above the content. */}
          {(DASHBOARD_SEARCH_ENABLED || DASHBOARD_OVERVIEW_ENABLED) && (
          <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center gap-4">
            <div className={`flex-1 max-w-xl relative ${DASHBOARD_SEARCH_ENABLED ? '' : 'hidden'}`}>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                <Icon name="search" size={16} color="#9ca3af" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="Search businesses, real estate, professionals, articles…"
                className="w-full text-sm pl-10 pr-9 py-2.5 rounded-xl bg-[#F4F5F4] border border-transparent focus:bg-white focus:border-[#2EC4B6] focus:outline-none focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                style={{ color: DARK }}
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}

              {/* Results dropdown */}
              {searchFocused && searchResults && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-gray-200 shadow-xl z-30 max-h-[70vh] overflow-y-auto">
                  {totalResults === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500 text-center">No results for “{query}”.</p>
                  ) : (
                    <div className="py-2">
                      {[
                        { title: 'Businesses', items: searchResults.businesses, kind: 'listing', icon: 'briefcase' },
                        { title: 'Real Estate', items: searchResults.realEstate, kind: 'listing', icon: 'home' },
                        { title: 'Professionals', items: searchResults.professionals, kind: 'pro', icon: 'people' },
                        { title: 'Articles', items: searchResults.articles, kind: 'article', icon: 'file' },
                      ].filter(g => g.items.length > 0).map(group => (
                        <div key={group.title}>
                          <p className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">{group.title}</p>
                          {group.items.map(item => {
                            const href = group.kind === 'pro' ? `/professional/${item.id}`
                              : group.kind === 'article' ? `/articles/${item.id}`
                              : `/buy-business/${item.id}`;
                            const title = group.kind === 'pro' ? item.name
                              : group.kind === 'article' ? item.title
                              : (item.listing_heading || item.business_name);
                            const sub = group.kind === 'pro' ? item.role
                              : group.kind === 'article' ? 'Article'
                              : recLocation(item);
                            const thumb = group.kind === 'pro' ? (item.image ? `${STORAGE}/${item.image}` : null)
                              : group.kind === 'article' ? item.banner
                              : (item.business_images?.[0]?.image_path ? `${STORAGE}/${item.business_images[0].image_path}` : null);
                            return (
                              <Link key={`${group.kind}-${item.id}`} href={href} onClick={() => { setQuery(''); setSearchFocused(false); }} className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors">
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                                  {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : <Icon name={group.icon} size={15} color="#9ca3af" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold truncate" style={{ color: DARK }}>{title}</p>
                                  {sub && <p className="text-xs text-gray-500 truncate">{sub}</p>}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 ml-auto">
              {DASHBOARD_OVERVIEW_ENABLED && (
                <button
                  onClick={() => setSection('notifications')}
                  className="relative w-10 h-10 rounded-full bg-[#F4F5F4] hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icon name="bell" size={17} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: TEAL }}>{unreadCount}</span>
                  )}
                </button>
              )}
              {DASHBOARD_OVERVIEW_ENABLED && (
                <button
                  onClick={() => setSection('settings')}
                  aria-label="My profile"
                  title="My profile"
                  className="w-10 h-10 rounded-full bg-[#F4F5F4] hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Icon name="person" size={17} />
                </button>
              )}
            </div>
          </div>
          )}

          <div className="px-4 md:px-8 py-8 space-y-8 max-w-[1200px]">
            {section === 'dashboard' && (
              <>
                {/* Welcome */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold" style={{ color: DARK }}>Welcome back{firstName ? `, ${firstName}` : ''}!</h1>
                  <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your E-2 Visa journey today.</p>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stats.map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <span className={`w-11 h-11 rounded-xl ${s.tint} flex items-center justify-center flex-shrink-0`}>
                          <Icon name={s.icon} size={20} color={s.color} />
                        </span>
                        <div>
                          <p className="text-[13px] text-gray-500 font-medium">{s.label}</p>
                          <p className="text-2xl font-bold leading-tight" style={{ color: DARK }}>{s.value}</p>
                        </div>
                      </div>
                      {s.onClick ? (
                        <button onClick={s.onClick} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline" style={{ color: TEAL_DARK }}>
                          View all <Icon name="arrowRight" size={13} color={TEAL_DARK} />
                        </button>
                      ) : (
                        <Link href={s.href} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline" style={{ color: TEAL_DARK }}>
                          View all <Icon name="arrowRight" size={13} color={TEAL_DARK} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recommended */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold" style={{ color: DARK }}>Recommended Listings</h2>
                      <p className="text-[12px] text-gray-500 mt-0.5">Based on your searches and interests.</p>
                    </div>
                    <Link href={TAB_LINKS[tab]} className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline flex-shrink-0" style={{ color: TEAL_DARK }}>
                      View all <Icon name="arrowRight" size={13} color={TEAL_DARK} />
                    </Link>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 border-b border-gray-200 mb-5 overflow-x-auto">
                    {TABS.map(t => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`pb-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                          tab === t ? 'border-[#2EC4B6] text-[#22A99C]' : 'border-transparent text-gray-500 hover:text-[#40433F]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Cards */}
                  {recLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                          <div className="h-40 bg-gray-100" />
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                            <div className="h-4 bg-gray-100 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recommended[tab].length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-sm text-gray-500">Nothing to recommend here yet — check back soon.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {tab === 'Professionals' && recommended.Professionals.map(p => {
                        const loc = [p.user_information?.state_name, p.user_information?.country_name].filter(Boolean).join(', ');
                        return (
                          <Link key={p.id} href={`/professional/${p.id}`} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white block">
                            <div className="relative h-40 overflow-hidden bg-gradient-to-b from-[#e8edf5] to-[#c8d4e8]">
                              {p.image
                                ? <img src={`${STORAGE}/${p.image}`} alt={p.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                                : <div className="w-full h-full flex items-center justify-center"><Icon name="person" size={40} color="#8fa8c4" /></div>}
                              {p.badge_icon && (
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow">
                                  <img src={`${STORAGE}/${p.badge_icon}`} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="text-[15px] font-bold truncate" style={{ color: DARK }}>{p.name}</h3>
                              <p className="text-xs font-semibold mt-0.5 truncate" style={{ color: TEAL_DARK }}>{p.role}</p>
                              {loc && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                                  <Icon name="pin" size={11} color="#6b7280" className="flex-shrink-0" />{loc}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}

                      {(tab === 'Businesses' || tab === 'Real Estate') && recommended[tab].map(l => {
                        const img = l.business_images?.[0]?.image_path ? `${STORAGE}/${l.business_images[0].image_path}` : null;
                        const price = recPrice(l);
                        const loc = recLocation(l);
                        return (
                          <div key={l.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white">
                            <div className="relative h-40 overflow-hidden bg-gray-100">
                              <Link href={`/buy-business/${l.id}`} className="block w-full h-full">
                                {img
                                  ? <img src={img} alt={l.listing_heading} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                  : <div className="w-full h-full flex items-center justify-center"><Icon name={tab === 'Real Estate' ? 'home' : 'briefcase'} size={28} color="#d1d5db" /></div>}
                              </Link>
                              <SaveListingButton listing={l} className="absolute top-2.5 right-2.5 z-10" />
                            </div>
                            <Link href={`/buy-business/${l.id}`} className="block p-4">
                              <h3 className="text-[15px] font-bold truncate" style={{ color: DARK }}>{l.listing_heading || l.business_name}</h3>
                              {loc && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                  <Icon name="pin" size={11} color="#6b7280" className="flex-shrink-0" />{loc}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-1.5">
                                {price ? <p className="text-[15px] font-bold" style={{ color: TEAL_DARK }}>{price}</p> : <p className="text-xs text-gray-400">Contact for price</p>}
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2EC4B6]/10 flex-shrink-0 ml-2" style={{ color: TEAL_DARK }}>Active</span>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent searches */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold" style={{ color: DARK }}>Recent Searches</h2>
                    <button onClick={() => setSection('searches')} className="text-[13px] font-semibold hover:underline" style={{ color: TEAL_DARK }}>
                      View all
                    </button>
                  </div>
                  {searchHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">
                      No searches yet — use the filters on the Find a Business or Real Estate pages and hit &quot;Search Now&quot;. Your searches will appear here.
                    </p>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {searchHistory.slice(0, 3).map(s => {
                        const style = SEARCH_STYLE[s.type] || SEARCH_STYLE.business;
                        return (
                          <Link key={s.id} href={s.url} className="w-full flex items-center gap-4 py-3.5 text-left hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors">
                            <span className={`w-10 h-10 rounded-xl ${style.tint} flex items-center justify-center flex-shrink-0`}>
                              <Icon name={style.icon} size={17} color={style.color} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: DARK }}>{s.label}</p>
                              <p className="text-xs text-gray-500 truncate">{s.meta}{typeof s.resultCount === 'number' ? ` · ${s.resultCount} result${s.resultCount === 1 ? '' : 's'}` : ''}</p>
                            </div>
                            <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(s.searchedAt)}</span>
                            <Icon name="chevron" size={15} color="#9ca3af" className="flex-shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {section === 'saved' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: DARK }}>My Saved Listings</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {savedListings.length
                      ? `You have ${savedListings.length} saved listing${savedListings.length > 1 ? 's' : ''}.`
                      : 'Everything you ❤️ across the site lands here.'}
                  </p>
                </div>

                {savedListings.length === 0 ? (
                  <SectionPlaceholder
                    icon="heart"
                    title="Nothing saved yet"
                    text="Browse businesses or real estate and tap the heart icon on any listing — it will show up here instantly."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {savedListings.map(item => (
                      <div key={item.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <Link href={`/buy-business/${item.id}`} className="block">
                          <div className="relative h-40 overflow-hidden bg-gray-100">
                            {item.image ? (
                              <img
                                src={`${STORAGE_URL}/${item.image}`}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Icon name={item.type === 'Real Estate' ? 'home' : 'briefcase'} size={28} color="#d1d5db" />
                              </div>
                            )}
                            <button
                              onClick={(e) => { e.preventDefault(); handleRemoveSaved(item); }}
                              aria-label="Remove from saved listings"
                              title="Remove from saved listings"
                              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Icon name="heart" size={15} color={DARK} fill={DARK} />
                            </button>
                            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 shadow-sm" style={{ color: TEAL_DARK }}>
                              {item.type}
                            </span>
                          </div>
                          <div className="p-4">
                            <h3 className="text-[15px] font-bold truncate" style={{ color: DARK }}>{item.title}</h3>
                            {item.location && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                                <Icon name="pin" size={11} color="#6b7280" className="flex-shrink-0" />
                                {item.location}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              {item.price
                                ? <p className="text-[15px] font-bold" style={{ color: TEAL_DARK }}>{item.price}</p>
                                : <p className="text-xs text-gray-400">Contact for price</p>}
                              <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                                Saved {new Date(item.savedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {section === 'searches' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: DARK }}>My Searches</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchHistory.length
                      ? `Your last ${searchHistory.length} search${searchHistory.length > 1 ? 'es' : ''} — click one to run it again.`
                      : 'Your search history from the listing pages will appear here.'}
                  </p>
                </div>

                {searchHistory.length === 0 ? (
                  <SectionPlaceholder
                    icon="search"
                    title="No searches yet"
                    text="Use the filters on the Find a Business or Real Estate pages and hit “Search Now” — every search you run is saved here so you can re-run it in one click."
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6">
                    <div className="divide-y divide-gray-100">
                      {searchHistory.map(s => {
                        const style = SEARCH_STYLE[s.type] || SEARCH_STYLE.business;
                        return (
                          <div key={s.id} className="flex items-center gap-2 group">
                            <Link href={s.url} className="flex-1 min-w-0 flex items-center gap-4 py-3.5 text-left hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors">
                              <span className={`w-10 h-10 rounded-xl ${style.tint} flex items-center justify-center flex-shrink-0`}>
                                <Icon name={style.icon} size={17} color={style.color} />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate" style={{ color: DARK }}>{s.label}</p>
                                <p className="text-xs text-gray-500 truncate">{s.meta}{typeof s.resultCount === 'number' ? ` · ${s.resultCount} result${s.resultCount === 1 ? '' : 's'}` : ''}</p>
                              </div>
                              <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                                <Icon name="clock" size={12} color="#9ca3af" />
                                {timeAgo(s.searchedAt)}
                              </span>
                            </Link>
                            <button
                              onClick={() => removeSearch(s.id)}
                              aria-label="Remove search"
                              title="Remove search"
                              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold" style={{ color: DARK }}>Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">
                      {unreadCount > 0
                        ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
                        : 'You’re all caught up.'}
                    </p>
                  </div>
                  {notifications.length > 0 && unreadCount > 0 && (
                    <button
                      onClick={() => markAllRead()}
                      className="text-[13px] font-semibold hover:underline"
                      style={{ color: TEAL_DARK }}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <SectionPlaceholder
                    icon="bell"
                    title="No notifications yet"
                    text="We’ll alert you here when new listings are published, a saved search gets a new match, or a saved listing’s price changes."
                  />
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-2 md:p-3">
                    <div className="divide-y divide-gray-100">
                      {notifications.map(n => {
                        const style = NOTIF_STYLE[n.kind] || NOTIF_STYLE.general;
                        return (
                          <div key={n.id} className={`group flex items-start gap-3.5 p-3.5 rounded-xl transition-colors ${!n.read ? 'bg-[#2EC4B6]/5' : ''}`}>
                            <span className={`w-9 h-9 rounded-full ${style.tint} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Icon name={style.icon} size={15} color={style.color} />
                            </span>
                            <Link
                              href={n.url || '#'}
                              onClick={() => markRead(n.id)}
                              className="flex-1 min-w-0"
                            >
                              <p className="text-sm font-semibold" style={{ color: DARK }}>{n.title}</p>
                              {n.meta && <p className="text-xs text-gray-500 mt-0.5 truncate">{n.meta}</p>}
                              <p className="text-[11px] text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
                            </Link>
                            <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                              {!n.read && <span className="w-2 h-2 rounded-full" style={{ background: TEAL }}></span>}
                              <button
                                onClick={() => removeNotification(n.id)}
                                aria-label="Dismiss notification"
                                title="Dismiss"
                                className="w-6 h-6 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'settings' && <DashboardSettings initialTab={initialSettingsTab} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="bg-[#F4F5F4] min-h-screen" />}>
      <DashboardContent />
    </Suspense>
  );
}
