'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useSearchParams } from 'next/navigation';
import { formatRealEstatePrice, getSqftLabel } from '../utils/priceRange';

const RealEstateMap = dynamic(() => import('../components/real-estate/RealEstateMap'), { ssr: false });

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

function RealEstate() {
  const searchParams = useSearchParams();

  const [allRealEstates, setAllRealEstates] = useState([]);
  const [realEstates, setRealEstates] = useState([]);
  const [loadingRealEstate, setLoadingRealEstate] = useState(true);
  const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

  // Location data
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);

  // Row 1 filters
  const [filterCountry, setFilterCountry] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCounty, setFilterCounty] = useState('');
  const [filterPropertyType, setFilterPropertyType] = useState('');

  // Row 2 filters
  const [filterSqft, setFilterSqft] = useState('');
  const [filterRooms, setFilterRooms] = useState('');
  const [filterBaths, setFilterBaths] = useState('');
  const [filterPriceRange, setFilterPriceRange] = useState('');

  const roomOptions = ['1+', '2+', '3+', '4+', '5+', '6+'];
  const bathOptions = ['1+', '2+', '3+', '4+', '5+', '6+'];

  const sqftOptions = [
    { label: 'Any',                    min: 0,    max: Infinity },
    { label: 'Under 1,000 sq ft',      min: 0,    max: 999 },
    { label: '1,000 – 2,000 sq ft',    min: 1000, max: 2000 },
    { label: '2,000 – 3,500 sq ft',    min: 2000, max: 3500 },
    { label: '3,500 – 5,000 sq ft',    min: 3500, max: 5000 },
    { label: 'Above 5,000 sq ft',      min: 5001, max: Infinity },
  ];

  const salePriceOptions = [
    { label: 'Any',                     min: 0,       max: Infinity },
    { label: 'Under $250,000',          min: 0,       max: 250000 },
    { label: '$250,000 – $500,000',     min: 250000,  max: 500000 },
    { label: '$500,000 – $1 Million',   min: 500000,  max: 1000000 },
    { label: '$1 Million – $5 Million', min: 1000000, max: 5000000 },
    { label: 'More than $5 Million',    min: 5000000, max: Infinity },
  ];

  const rentPriceOptions = [
    { label: 'Any',                        min: 0,    max: Infinity },
    { label: 'Under $1,000/month',         min: 0,    max: 1000 },
    { label: '$1,000 – $2,500/month',      min: 1000, max: 2500 },
    { label: '$2,500 – $4,000/month',      min: 2500, max: 4000 },
    { label: '$4,000 – $6,500/month',      min: 4000, max: 6500 },
    { label: 'More than $6,500/month',     min: 6500, max: Infinity },
  ];

  const isRentLease = filterPropertyType.includes('[for rent/lease]');
  const priceRangeOptions = isRentLease ? rentPriceOptions : salePriceOptions;

  // Cascade: country → states
  useEffect(() => {
    if (!filterCountry) { setStates([]); setFilterState(''); setCounties([]); setFilterCounty(''); return; }
    const selected = countries.find(c => c.id == filterCountry);
    setStates(selected?.states || []);
    setFilterState('');
    setCounties([]);
    setFilterCounty('');
  }, [filterCountry, countries]);

  // Cascade: state → counties
  useEffect(() => {
    if (!filterState) { setCounties([]); setFilterCounty(''); return; }
    const selectedState = states.find(s => s.id == filterState);
    setCounties(selectedState?.counties || []);
    setFilterCounty('');
  }, [filterState, states]);

  const handleSearch = () => {
    let filtered = [...allRealEstates];

    if (filterCountry) filtered = filtered.filter(e => String(e.country_id) === String(filterCountry));
    if (filterState)   filtered = filtered.filter(e => String(e.state_id)   === String(filterState));
    if (filterCounty)  filtered = filtered.filter(e => String(e.county_id)  === String(filterCounty));
    if (filterPropertyType) filtered = filtered.filter(e => (e.property_type || '').toLowerCase() === filterPropertyType.toLowerCase());

    if (filterRooms) {
      const min = parseInt(filterRooms); // parseInt('2+') = 2, handles all x+ values
      filtered = filtered.filter(e => parseInt(e.rooms) >= min);
    }
    if (filterBaths) {
      const min = parseInt(filterBaths);
      filtered = filtered.filter(e => parseInt(e.baths) >= min);
    }

    if (filterSqft) {
      const opt = sqftOptions.find(o => o.label === filterSqft);
      if (opt) {
        filtered = filtered.filter(e => {
          const sqft = parseInt(e.building_size);
          return sqft >= opt.min && (opt.max === Infinity || sqft <= opt.max);
        });
      }
    }

    if (filterPriceRange) {
      const activeOpts = filterPropertyType.includes('[for rent/lease]') ? rentPriceOptions : salePriceOptions;
      const opt = activeOpts.find(o => o.label === filterPriceRange);
      if (opt) {
        filtered = filtered.filter(e => {
          const isRent = (e.property_type || '').toLowerCase().includes('[for rent/lease]');
          const price = parseFloat(isRent ? e.monthly_rent : e.sale_price);
          return price >= opt.min && (opt.max === Infinity || price <= opt.max);
        });
      }
    }

    setRealEstates(filtered);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterCountry(''); setFilterState(''); setFilterCounty('');
    setFilterPropertyType(''); setFilterRooms(''); setFilterBaths('');
    setFilterSqft(''); setFilterPriceRange('');
    setStates([]); setCounties([]);
    setRealEstates(allRealEstates);
    setCurrentPage(1);
  };

  // Fetch countries
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/countries/list`)
      .then(r => r.json())
      .then(d => setCountries(d.result || []))
      .catch(() => setCountries([]));
  }, []);

  // Fetch all real estate listings on mount
  useEffect(() => {
    const fetchAllRealEstates = async () => {
      setLoadingRealEstate(true);
      try {
        const params = new URLSearchParams({ search_type: 'real_estate' });
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/find-business?${params.toString()}`);
        const data = await res.json();
        if (res.ok && data.result) {
          setAllRealEstates(data.result);
          setRealEstates(data.result);
        } else {
          setAllRealEstates([]);
          setRealEstates([]);
        }
      } catch {
        setAllRealEstates([]);
        setRealEstates([]);
      } finally {
        setLoadingRealEstate(false);
      }
    };
    fetchAllRealEstates();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(realEstates.length / itemsPerPage);
  const paginatedEstates = realEstates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Shared select style
  const selectCls = "w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A3161] focus:border-[#0A3161] outline-none bg-white text-[#40433F] disabled:bg-gray-50 disabled:text-gray-400 transition-colors";

  return (
    <div className="">
      {/* Hero */}
      <div className="relative h-[300px]">
        <div className="absolute inset-0 z-[1]">
          <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80" alt="Find Real Estate" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="relative z-[10] container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Real Estate</h1>
          <div className="flex items-center text-white text-lg">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <span>Listings</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 mt-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="p-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

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

              {/* Property Type */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Property Type</label>
                <select
                  className={selectCls}
                  value={filterPropertyType}
                  onChange={e => {
                    const newType = e.target.value;
                    const wasRent = filterPropertyType.includes('[for rent/lease]');
                    const isNowRent = newType.includes('[for rent/lease]');
                    if (wasRent !== isNowRent) setFilterPriceRange('');
                    setFilterPropertyType(newType);
                  }}
                >
                  <option value="">Any Type</option>
                  <optgroup label="── For Sale ──">
                    <option value="House [for sale]">House [for sale]</option>
                    <option value="Condo/Co-op [for sale]">Condo/Co-op [for sale]</option>
                    <option value="Townhome [for sale]">Townhome [for sale]</option>
                    <option value="Multi-family [for sale]">Multi-family [for sale]</option>
                    <option value="Mobile/Manufactured [for sale]">Mobile/Manufactured [for sale]</option>
                    <option value="Land/Lots [for sale]">Land/Lots [for sale]</option>
                    <option value="Farm [for sale]">Farm [for sale]</option>
                  </optgroup>
                  <optgroup label="── For Rent/Lease ──">
                    <option value="House [for rent/lease]">House [for rent/lease]</option>
                    <option value="Townhouse [for rent/lease]">Townhouse [for rent/lease]</option>
                    <option value="Apartment/Condo [for rent/lease]">Apartment/Condo [for rent/lease]</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

              {/* Square Footage */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Square Footage</label>
                <select className={selectCls} value={filterSqft} onChange={e => setFilterSqft(e.target.value)}>
                  {sqftOptions.map(o => <option key={o.label} value={o.label === 'Any' ? '' : o.label}>{o.label}</option>)}
                </select>
              </div>

              {/* Rooms */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Rooms (Beds)</label>
                <select className={selectCls} value={filterRooms} onChange={e => setFilterRooms(e.target.value)}>
                  <option value="">Any</option>
                  {roomOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Bath */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Baths</label>
                <select className={selectCls} value={filterBaths} onChange={e => setFilterBaths(e.target.value)}>
                  <option value="">Any</option>
                  {bathOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Price Range</label>
                <select
                  className={selectCls}
                  value={filterPriceRange}
                  onChange={e => setFilterPriceRange(e.target.value)}
                  disabled={!filterPropertyType}
                >
                  {priceRangeOptions.map(o => <option key={o.label} value={o.label === 'Any' ? '' : o.label}>{o.label}</option>)}
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

        {/* ── Map — always visible after filters ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-[#40433F]">Listings on Map</h2>
            <span className="text-sm text-gray-500">
              {realEstates.filter(l => l.latitude && l.longitude).length} of {realEstates.length} listings pinned
            </span>
          </div>
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200">
            {loadingRealEstate ? (
              <div className="flex items-center justify-center bg-gray-100" style={{ height: '520px' }}>
                <LoadingSpinner />
              </div>
            ) : (
              <RealEstateMap listings={realEstates} />
            )}
          </div>
          {!loadingRealEstate && realEstates.filter(l => l.latitude && l.longitude).length === 0 && (
            <p className="text-center text-gray-400 text-sm mt-3">
              No listings have map coordinates yet. Add coordinates from the backend to show pins here.
            </p>
          )}
        </div>

        {/* ── Listings Grid ── */}
        {loadingRealEstate ? (
          <LoadingSpinner />
        ) : realEstates.length > 0 ? (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-[#40433F] text-center my-8">Real Estate Listings</h1>
            <div className="listing-slider flex flex-wrap justify-center gap-8 mb-16">
              {paginatedEstates.map((estate) => {
                const priceLabel = formatRealEstatePrice(estate);
                const sqftLabel  = getSqftLabel(estate.building_size);
                const metaParts  = [
                  estate.rooms ? `${estate.rooms} Beds` : null,
                  estate.baths ? `${estate.baths} Baths` : null,
                  sqftLabel,
                  estate.property_type,
                ].filter(Boolean);
                const addressParts = [estate.street_address, estate.zip_code, estate.state?.name].filter(Boolean);
                const addressLine  = addressParts.join(', ');

                return (
                  <Link key={estate.id} href={`/buy-business/${estate.id}`} className="w-[280px] h-full flex-shrink-0 block">
                    <div className="bg-white w-full h-full flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200">
                      <div className="relative w-full h-[180px] flex-shrink-0">
                        <Image
                          fill
                          src={estate.business_images && estate.business_images.length > 0
                            ? `${BACKEND_STORAGE_URL}/${estate.business_images[0].image_path}`
                            : '/images/listing/img1.png'}
                          alt={estate.listing_heading || "Real Estate"}
                          className="object-cover"
                        />
                        {estate?.verified && (
                          <div className="absolute top-3 left-3 bg-white/95 text-[#0A3161] text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                            Verified
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className={`text-xl font-extrabold mb-1 ${priceLabel === 'Contact for Price' ? 'text-gray-400' : 'text-[#1a1a1a]'}`}>
                          {priceLabel}
                        </div>
                        <p className="text-xs text-gray-600 font-medium mb-2 leading-relaxed min-h-[16px]">
                          {metaParts.length > 0 ? metaParts.join(' | ') : ' '}
                        </p>
                        <p className="text-xs text-gray-500 leading-snug mb-1 line-clamp-2 min-h-[32px]">
                          {addressLine || ' '}
                        </p>
                        <h2 className="text-xs font-semibold text-[#40433F] line-clamp-1 mt-auto pt-1">
                          {estate.listing_heading}
                        </h2>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-200 text-[#40433F] disabled:opacity-50">Prev</button>
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
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 rounded bg-gray-200 text-[#40433F] disabled:opacity-50">Next</button>
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
}

export default function RealEstatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RealEstate />
    </Suspense>
  );
}
