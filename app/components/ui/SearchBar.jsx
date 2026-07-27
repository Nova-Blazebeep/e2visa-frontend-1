'use client';

import { useEffect, useState } from 'react';
import Button from './Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const SearchBar = ({ activeTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // "light" skips the nested states/counties tree (~550KB across all
        // countries) — this widget only needs id+name for the Country dropdown
        // and fetches states separately once a country is picked.
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/countries/list?light=1');
        const data = await res.json();
        if (res.ok && data.result) {
          setCountries(data.result);
        }
      } catch (err) {
        setCountries([]);
      }
    };
    fetchCountries();
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/categories');
        const data = await res.json();
        if (res.ok && data.result) {
          setCategories(data.result);
        }
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch states when a country is selected (for real estate tab)
  useEffect(() => {
    if (activeTab !== 'estate' || !selectedCountry) {
      setStates([]);
      setSelectedState('');
      return;
    }
    const fetchStates = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/states/list', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country_id: selectedCountry }),
        });
        const data = await res.json();
        if (res.ok && data.result) {
          setStates(data.result);
        } else {
          setStates([]);
        }
      } catch (err) {
        setStates([]);
      }
    };
    fetchStates();
  }, [selectedCountry, activeTab]);

  // Reset selections when tab changes
  useEffect(() => {
    setSelectedIndustry('');
    setSelectedCountry('');
    setSelectedState('');
  }, [activeTab]);

  const handleSearch = (e) => {
    e.preventDefault();
    let path = '/';
    if (activeTab === 'business') path = '/buy-business';
    else if (activeTab === 'estate') path = '/real-estate';
    else if (activeTab === 'professional') path = '/professionals';

    // Build query params — both target pages key their deep-link cascade off
    // numeric country_id/state_id, not names.
    const params = new URLSearchParams();
    if (activeTab === 'business') {
      if (selectedIndustry) params.append('category_id', selectedIndustry);
      if (selectedCountry) params.append('country_id', selectedCountry);
    } else if (activeTab === 'estate') {
      if (selectedCountry) params.append('country_id', selectedCountry);
      if (selectedState) params.append('state_id', selectedState);
    }

    // Navigate with params
    router.push(`${path}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex md:flex-row flex-col w-full max-w-3xl gap-2">
      <div className="relative flex-grow">
        <div className="relative flex items-center gap-2">
          {activeTab === 'estate' ? (
            <>
              {/* Country dropdown for Real Estate */}
              <div className="w-1/2 relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md text-[#FFFFFF] pr-8 pl-3 py-2 xl:py-4 rounded-lg outline-none font-[300] cursor-pointer [&>option]:px-3"
                >
                  <option value="">Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id} className="text-black px-3">
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* State dropdown for Real Estate */}
              <div className="w-1/2 relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md text-[#FFFFFF] pr-8 pl-3 py-2 xl:py-4 rounded-lg outline-none font-[300] cursor-pointer [&>option]:px-3"
                >
                  <option value="">State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id} className="text-black px-3">
                      {state.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Category dropdown for Business */}
              <div className="w-1/2 relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md text-[#FFFFFF] pr-8 pl-3 py-2 xl:py-4 rounded-lg outline-none font-[300] cursor-pointer [&>option]:px-3"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="text-black px-3">
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {/* Country dropdown for Business */}
              <div className="w-1/2 relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="appearance-none w-full bg-white/10 backdrop-blur-md text-[#FFFFFF] pr-8 pl-3 py-2 xl:py-4 rounded-lg outline-none font-[300] cursor-pointer [&>option]:px-3"
                >
                  <option value="">Countries</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id} className="text-black px-3">
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <button className="px-[15px] mt-2 md:mt-0 xl:px-6 xl:text-base text-xs xl:py-4 py-2 rounded-lg text-[#1B263B] bg-white hover:bg-gray-100 "
      >
        Search Now
      </button>
    </form>
  );
};

export default SearchBar;