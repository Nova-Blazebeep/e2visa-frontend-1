'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { canManageListings } from '../../utils/listingGate';
import LoadingSpinner from '../common/LoadingSpinner';

const DARK = '#40433F';
const TEAL = '#2EC4B6';
const TEAL_DARK = '#22A99C';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

const PAGE_SIZE = 6;

const selectCls =
  'text-sm px-3.5 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(localStorage.getItem('userDetail')); } catch { return null; }
};

function listingPrice(l) {
  if (l.business_type === 'real-estate') {
    const sale = parseFloat(l.sale_price), rent = parseFloat(l.monthly_rent);
    if (!isNaN(sale) && sale > 0) return `$${sale.toLocaleString()}`;
    if (!isNaN(rent) && rent > 0) return `$${rent.toLocaleString()}/mo`;
  }
  const p = parseFloat(l.asking_price);
  return !isNaN(p) && p > 0 ? `$${p.toLocaleString()}` : null;
}

function listingLocation(l) {
  const county = l.county?.name;
  const state = l.state?.name;
  if (county && state) return `${county}, ${state}`;
  return county || state || l.country?.name || '';
}

function GateBanner() {
  return (
    <div className="bg-[#40433F] rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-white">Get your badge to create and manage listings.</p>
          <p className="text-sm text-white/80">Visit Settings to see your badge status and get started.</p>
        </div>
      </div>
      <Link href="/dashboard?section=settings" className="px-5 py-2 rounded-lg bg-white text-[#40433F] text-sm font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
        Go to Settings
      </Link>
    </div>
  );
}

function ListingCard({ listing, onDelete, deleting }) {
  const isRealEstate = listing.business_type === 'real-estate';
  const img = listing.business_images?.[0]?.image_path ? `${STORAGE_URL}/${listing.business_images[0].image_path}` : null;
  const price = listingPrice(listing);
  const loc = listingLocation(listing);
  const editHref = `/dashboard/listings/${isRealEstate ? 'real-estate' : 'business'}/${listing.id}/edit`;

  return (
    <div className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 bg-white">
      <div className="relative h-40 overflow-hidden bg-gray-100">
        {img
          ? <img src={img} alt={listing.listing_heading} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/95 shadow-sm" style={{ color: TEAL_DARK }}>
          {isRealEstate ? 'Real Estate' : 'Business'}
        </span>
        <span
          className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm"
          style={listing.is_publish ? { color: '#1e8449', background: 'rgba(30,132,73,0.12)' } : { color: '#b8860b', background: 'rgba(184,134,11,0.12)' }}
        >
          {listing.is_publish ? 'Published' : 'Draft'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold truncate" style={{ color: DARK }}>{listing.listing_heading || 'Untitled listing'}</h3>
        {loc && <p className="text-xs text-gray-500 truncate mt-0.5">{loc}</p>}
        {price && <p className="text-[15px] font-bold mt-1" style={{ color: TEAL_DARK }}>{price}</p>}
        <div className="flex items-center gap-2 mt-3">
          <Link href={editHref} className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg text-white hover:opacity-90 transition-opacity" style={{ background: DARK }}>
            Edit
          </Link>
          {listing.is_publish === 1 && (
            <Link href={`/buy-business/${listing.id}`} className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" style={{ color: DARK }}>
              View
            </Link>
          )}
          <button
            onClick={() => onDelete(listing)}
            disabled={deleting}
            aria-label="Delete listing"
            title="Delete listing"
            className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex justify-center items-center gap-1.5 pt-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100"
      >
        Previous
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className="min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
          style={p === page ? { background: DARK, color: 'white' } : { background: '#f3f4f6', color: '#374151' }}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  );
}

export default function DashboardListings() {
  const [eligible, setEligible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setEligible(canManageListings(getStoredUser()));
    setChecked(true);
  }, []);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/my-listings`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.result) setListings(data.result);
    } catch {
      toast.error('Failed to load your listings.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (eligible) load();
    else setLoading(false);
  }, [eligible, load]);

  const handleDelete = async (listing) => {
    const token = getToken();
    setDeletingId(listing.id);
    try {
      const res = await fetch(`${API_URL}/api/my-listings/${listing.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== listing.id));
        toast.success('Listing deleted.', { position: 'top-right' });
      } else {
        toast.error(data.message || 'Failed to delete listing.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to delete listing.', { position: 'top-right' });
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filteredListings = listings.filter(l => {
    if (typeFilter !== 'all' && l.business_type !== typeFilter) return false;
    if (statusFilter !== 'all') {
      const isPublished = Number(l.is_publish) === 1;
      if (statusFilter === 'published' && !isPublished) return false;
      if (statusFilter === 'draft' && isPublished) return false;
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filteredListings.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedListings = filteredListings.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  if (!checked) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: DARK }}>My Listings</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage your business and real estate listings.</p>
        </div>
        {eligible && (
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/dashboard/listings/business/new" className="text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity" style={{ background: DARK }}>
              + Add Business
            </Link>
            <Link href="/dashboard/listings/real-estate/new" className="text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-white hover:opacity-90 transition-opacity" style={{ background: TEAL_DARK }}>
              + Add Real Estate
            </Link>
          </div>
        )}
      </div>

      {!eligible ? (
        <GateBanner />
      ) : loading ? (
        <LoadingSpinner />
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center text-center">
          <span className="w-14 h-14 rounded-2xl bg-[#2EC4B6]/10 flex items-center justify-center mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={TEAL_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          </span>
          <h2 className="text-xl font-bold mb-1" style={{ color: DARK }}>No listings yet</h2>
          <p className="text-sm text-gray-500 max-w-sm">Create your first business or real estate listing using the buttons above.</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <select value={typeFilter} onChange={handleFilterChange(setTypeFilter)} className={selectCls}>
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="real-estate">Real Estate</option>
            </select>
            <select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} className={selectCls}>
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <span className="text-xs text-gray-400">
              {filteredListings.length} listing{filteredListings.length === 1 ? '' : 's'}
            </span>
          </div>

          {filteredListings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center text-center">
              <h2 className="text-lg font-bold mb-1" style={{ color: DARK }}>No listings match these filters</h2>
              <p className="text-sm text-gray-500 max-w-sm">Try a different type or status, or clear the filters above.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {pagedListings.map(l => (
                  <ListingCard key={l.id} listing={l} deleting={deletingId === l.id} onDelete={(item) => setConfirmId(item.id)} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          )}
        </>
      )}

      {confirmId != null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setConfirmId(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2" style={{ color: DARK }}>Delete this listing?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove the listing and its photos/documents. This can&apos;t be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(listings.find(l => l.id === confirmId))}
                disabled={deletingId === confirmId}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deletingId === confirmId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
