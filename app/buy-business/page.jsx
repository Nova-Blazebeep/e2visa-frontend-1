'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSearchParams } from 'next/navigation';

// Builds a windowed page-number list with ellipses, e.g. [1, '...', 4, 5, 6, '...', 12]
function getPageNumbers(currentPage, totalPages, windowSize = 1) {
  const pages = [];
  const start = Math.max(2, currentPage - windowSize);
  const end = Math.min(totalPages - 1, currentPage + windowSize);

  pages.push(1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

function BuyBusiness() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category_id') || '';
  const initialCountryParam = searchParams.get('country') || '';

  const [allBusinesses, setAllBusinesses] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [filterCountry, setFilterCountry] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCounty, setFilterCounty] = useState('');

  // Category data (subcategories come nested on each category)
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterSubCategory, setFilterSubCategory] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const paginatedBusinesses = businesses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Cascade: country → states
  useEffect(() => {
    if (!filterCountry) { setStates([]); setFilterState(''); setCounties([]); setFilterCounty(''); return; }
    const selected = countries.find(c => String(c.id) === String(filterCountry));
    setStates(selected?.states || []);
    setFilterState('');
    setCounties([]);
    setFilterCounty('');
  }, [filterCountry, countries]);

  // Cascade: state → counties
  useEffect(() => {
    if (!filterState) { setCounties([]); setFilterCounty(''); return; }
    const selectedState = states.find(s => String(s.id) === String(filterState));
    setCounties(selectedState?.counties || []);
    setFilterCounty('');
  }, [filterState, states]);

  // Cascade: category → subcategories
  useEffect(() => {
    if (!filterCategory) { setSubCategories([]); setFilterSubCategory(''); return; }
    const selected = categories.find(c => String(c.id) === String(filterCategory));
    setSubCategories(selected?.subcategories || []);
    setFilterSubCategory('');
  }, [filterCategory, categories]);

  // Fetch categories (with nested subcategories) once
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.result || []))
      .catch(() => setCategories([]));
  }, []);

  // Fetch countries (with nested states/counties) once
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + '/api/countries/list')
      .then(r => r.json())
      .then(d => setCountries(d.result || []))
      .catch(() => setCountries([]));
  }, []);

  // Legacy deep-link support: resolve a ?country=<name> param to an id once countries load
  useEffect(() => {
    if (!initialCountryParam || filterCountry || !countries.length) return;
    const match = countries.find(c => c.name.toLowerCase() === initialCountryParam.toLowerCase());
    if (match) setFilterCountry(String(match.id));
  }, [initialCountryParam, countries, filterCountry]);

  // Fetch all business listings once on mount
  useEffect(() => {
    const fetchAllBusinesses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search_type: 'business' });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/find-business?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.result) {
          setAllBusinesses(data.result);
          setBusinesses(data.result);
        } else {
          setAllBusinesses([]);
          setBusinesses([]);
        }
      } catch {
        setAllBusinesses([]);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBusinesses();
  }, []);

  const columnCount = Math.min(businesses.length, 4);
  const gridColsClass = {
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "xl:grid-cols-4",
  }[columnCount];

  const handleSearch = () => {
    let filtered = [...allBusinesses];
    if (filterCountry)      filtered = filtered.filter(b => String(b.country_id) === String(filterCountry));
    if (filterState)        filtered = filtered.filter(b => String(b.state_id) === String(filterState));
    if (filterCounty)       filtered = filtered.filter(b => String(b.county_id) === String(filterCounty));
    if (filterCategory)     filtered = filtered.filter(b => String(b.category_id) === String(filterCategory));
    if (filterSubCategory)  filtered = filtered.filter(b => String(b.sub_category_id) === String(filterSubCategory));
    setBusinesses(filtered);
    setCurrentPage(1);
  };

  // Auto-apply filters carried in via URL (?category_id=, ?country=) once data is ready
  useEffect(() => {
    if (!allBusinesses.length) return;
    if (filterCategory || filterCountry) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBusinesses, filterCountry]);

  const handleReset = () => {
    setFilterCountry(''); setFilterState(''); setFilterCounty('');
    setFilterCategory(''); setFilterSubCategory('');
    setStates([]); setCounties([]); setSubCategories([]);
    setBusinesses(allBusinesses);
    setCurrentPage(1);
  };

  // Shared select style
  const selectCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A3161] focus:border-[#0A3161] outline-none bg-white text-[#40433F] disabled:bg-gray-50 disabled:text-gray-400 transition-colors";

  return (
    <div className="">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] ">
        <div className="absolute inset-0 z-[1]">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1920&q=80"
            alt="Find a Business"
            fill
            className="object-cover"
          />
        </div>
        {/* Black transparent overlay */}
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find a Business</h1>
          <div className="flex items-center text-white text-lg">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <span>Listings</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 mt-8 relative z-20">
        <div className="max-w-5xl mx-auto">
          <div className="p-8">
            {/* Row 1 — Country, State, County */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

              {/* Country */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Country</label>
                <select className={selectCls} value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
                  <option value="">All Countries</option>
                  {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* State */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">State</label>
                <select className={selectCls} value={filterState} onChange={e => setFilterState(e.target.value)} disabled={!filterCountry}>
                  <option value="">All States</option>
                  {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              {/* County */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">County</label>
                <select className={selectCls} value={filterCounty} onChange={e => setFilterCounty(e.target.value)} disabled={!filterState}>
                  <option value="">All Counties</option>
                  {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Row 2 — Category, Sub Category (centered) */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <div className="flex flex-col gap-1 w-full sm:w-64">
                <label className="text-sm text-gray-700">Category</label>
                <select className={selectCls} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1 w-full sm:w-64">
                <label className="text-sm text-gray-700">Sub Category</label>
                <select className={selectCls} value={filterSubCategory} onChange={e => setFilterSubCategory(e.target.value)} disabled={!filterCategory}>
                  <option value="">All Sub Categories</option>
                  {subCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSearch}
                className="bg-[#40433F] hover:bg-[#363936] active:scale-95 text-white px-10 py-3 rounded-lg transition-all text-sm font-bold"
              >
                Search Now
              </button>
              <button
                onClick={handleReset}
                className="border-2 border-gray-300 text-gray-500 hover:border-[#40433F] hover:text-[#40433F] active:scale-95 px-7 py-3 rounded-lg transition-all text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Business Listings */}
        {loading ? (
          <LoadingSpinner />
        ) : businesses.length > 0 ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-[#40433F] text-center my-8">Business Listings</h1>
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {paginatedBusinesses.map((business) => (
                <Link key={business.id} href={`/buy-business/${business.id}`} className="w-[280px] flex-shrink-0">
                  <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    {business.verified && (
                      <div className="absolute top-3 right-3 bg-[#2EC4B6] z-30 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Verified
                      </div>
                    )}
                    <div className="relative w-full h-[180px] flex-shrink-0">
                      <Image
                        fill
                        src={
                          business.business_images && business.business_images.length > 0
                            ? `${BACKEND_STORAGE_URL}/${business.business_images[0].image_path}`
                            : '/images/listing/img1.png'
                        }
                        alt={business.listing_heading || 'Business Listing'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <h2 className="text-sm font-bold text-[#1a1a1a] leading-5 line-clamp-2 mb-3 min-h-[40px]">
                        {business.listing_heading}
                      </h2>
                      <div className="space-y-1.5 mt-auto">
                        {business.listing_type && (
                          <div className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            <p className="text-xs text-[#0A3161] font-semibold truncate">{business.listing_type}</p>
                          </div>
                        )}
                        {business.county?.name && (
                          <div className="flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <p className="text-xs text-gray-500 truncate">{business.county.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination Controls */}
            {/* {totalPages > 1 && (
              <div className="flex  justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )} */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                {/* Prev Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Prev
                </button>

                {/* Page numbers */}
                {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1 text-gray-500">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${currentPage === page ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}


          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg text-gray-700">No Listings That Match Your Query, Please Try Again</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default function BuyBusinessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyBusiness />
    </Suspense>
  )
} 