'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '../components/common/LoadingSpinner';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getArticle(name) {
  if (!name) return 'a';
  const noArticle = ['affiliate services'];
  if (noArticle.includes(name.toLowerCase())) return 'for';
  return /^[aeiou]/i.test(name.trim()) ? 'an' : 'a';
}

// Make profession name plural for section heading
function pluralize(name) {
  if (!name) return '';
  // Handle "Attorney - Immigration/Real Estate/Business" → "Attorneys - Immigration/Real Estate/Business"
  if (name.toLowerCase().startsWith('attorney')) return name.replace(/^Attorney/i, 'Attorneys');
  // Handle names ending in specific patterns
  if (name.endsWith('s')) return name; // already plural
  if (name.endsWith('or')) return name + 's'; // Inspector → Inspectors
  return name + 's'; // Business Broker → Business Brokers
}

function Professionals() {
  const searchParams = useSearchParams();
  const roleId = searchParams.get('role');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [professionals, setProfessionals] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const professionalsPerPage = 6;

  // Location data for cascading filters
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);

  const [filterCountry, setFilterCountry] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterCounty, setFilterCounty] = useState('');

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

  // Fetch countries with states & counties on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/countries/list`)
      .then(r => r.json())
      .then(d => setCountries(d.result || []))
      .catch(() => setCountries([]));
  }, []);

  // Fetch professionals when roleId changes
  useEffect(() => {
    if (!roleId) { setProfessionals([]); return; }
    setLoading(true);
    setError(null);
    setCurrentPage(1);
    setFilterCountry('');
    setFilterState('');
    setFilterCounty('');
    // Fetch role name for dynamic tagline
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/list`)
      .then(r => r.json())
      .then(d => {
        const role = (d.result || []).find(r => String(r.id) === String(roleId));
        if (role) setRoleName(role.name);
      }).catch(() => {});

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/profession?profession_id=${roleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) setProfessionals(shuffle(data.result));
        else { setProfessionals([]); setError(data.message || 'No professionals found.'); }
      })
      .catch(() => setError('Failed to fetch professionals.'))
      .finally(() => setLoading(false));
  }, [roleId]);

  const totalPages = Math.ceil(professionals.length / professionalsPerPage);
  const paginatedProfessionals = professionals.slice(
    (currentPage - 1) * professionalsPerPage,
    currentPage * professionalsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 z-[1]">
          <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80" alt="Find a Professional" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl text-white mb-4 max-w-3xl mx-auto leading-tight">
            {roleName ? `Search for ${getArticle(roleName)} ${roleName}` : 'Search for a Professional to Help You Find a Business'}
          </h1>
          <div className="flex items-center justify-center text-white">
            <span>Home</span><span className="mx-2">/</span><span>Professionals</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Profession heading — shown when a role is selected */}
        {roleId && roleName && (
          <h2 className="text-3xl font-bold text-center text-[#40433F] mb-10">
            {pluralize(roleName)}
          </h2>
        )}

        {!roleId && (
          <p className="text-center text-gray-500 mt-4 mb-8">
            Select a profession from the <span className="font-semibold text-[#40433F]">FIND A PROFESSIONAL</span> menu above to view professionals.
          </p>
        )}

        {/* ── Results ── */}
        {loading && <LoadingSpinner />}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}

        {!loading && roleId && (
          <>
            {paginatedProfessionals.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-4 pb-10">
                <p className="text-lg text-gray-700">No Professional That Match Your Query, Please Try Again</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:mx-28 items-stretch">
                {paginatedProfessionals.map((pro) => (
                  <Link href={`/professional/${pro.id}`} key={pro.id} className="block relative h-full">
                    <div className="h-full bg-white rounded-lg border border-[#40433F] p-6 hover:shadow-lg transition-shadow flex flex-col justify-between">
                      <span className="absolute top-2 right-2 bg-[#0A3161] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm select-none cursor-pointer">
                        Contact
                      </span>
                      <div className="flex items-start space-x-4">
                        <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden">
                          {pro.image && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${pro.image}`}
                              alt={`${pro.name}'s profile`}
                              className="object-cover w-full h-full rounded-full"
                              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                          )}
                          <div
                            className="w-full h-full items-center justify-center rounded-full"
                            style={{
                              display: pro.image ? 'none' : 'flex',
                              background: 'linear-gradient(to bottom, #e8edf5, #c8d4e8)'
                            }}
                          >
                            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="50" cy="50" r="50" fill="#b8c8dc" />
                              <circle cx="50" cy="38" r="18" fill="#8fa8c4" />
                              <ellipse cx="50" cy="82" rx="28" ry="18" fill="#8fa8c4" />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold lg:text-lg text-sm text-gray-800">{pro.name}</h3>
                          <p className="lg:text-sm text-xs text-gray-600">
                            {[pro.user_information?.state_name, pro.user_information?.country_name].filter(Boolean).join(', ') || ''}
                          </p>
                          <p className="lg:text-sm text-xs text-gray-600">{pro.role}</p>
                          {pro.user_information?.licensed_states?.length > 0 && (() => {
                            const states = [...new Set(pro.user_information.licensed_states)];
                            const allStates = states.length >= 50;
                            return (
                              <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs text-gray-500 mr-1 self-center">Licensed in:</span>
                                {allStates ? (
                                  <span className="bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/30 text-xs font-medium px-2 py-0.5 rounded-full">
                                    All 50 states
                                  </span>
                                ) : (
                                  <>
                                    {states.slice(0, 3).map((state) => (
                                      <span key={state} className="bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/30 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {state}
                                      </span>
                                    ))}
                                    {states.length > 3 && (
                                      <span className="text-xs text-gray-500 self-center">…</span>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })()}
                          {(pro.user_information?.about || pro.about) && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                              {(pro.user_information?.about || pro.about).length > 150
                                ? (pro.user_information?.about || pro.about).slice(0, 150).trimEnd() + '…'
                                : (pro.user_information?.about || pro.about)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm disabled:opacity-50" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
                <button onClick={() => setCurrentPage(1)} className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'}`}>1</button>
                {currentPage > 3 && <span className="text-sm">...</span>}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <button onClick={() => setCurrentPage(currentPage)} className="px-3 py-1 rounded text-sm bg-[#40433F] text-white">{currentPage}</button>
                )}
                {currentPage < totalPages - 2 && <span className="text-sm">...</span>}
                {totalPages !== 1 && (
                  <button onClick={() => setCurrentPage(totalPages)} className={`px-3 py-1 rounded text-sm ${currentPage === totalPages ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'}`}>{totalPages}</button>
                )}
                <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm disabled:opacity-50" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ProfessionalsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Professionals />
    </Suspense>
  );
}
