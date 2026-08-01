'use client';

import { useState, useEffect } from 'react';

// Cascading country → state → county select, generalized from the identical
// cascade already proven in SignUp.jsx and real-estate/page.jsx — but keyed
// on ids (country_id/state_id/county_id) since that's what the listings API
// requires, rather than SignUp's name-based fields.
const COUNTRIES_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/countries/list';
const STATES_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/states/list';
const COUNTIES_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/counties/list';

const selectCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed';
const labelCls = 'block text-[13px] font-semibold mb-1.5';
const DARK = '#40433F';

export default function LocationFields({ countryId, stateId, countyId, onChange, errors = {} }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [counties, setCounties] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCounties, setLoadingCounties] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(COUNTRIES_API_URL);
        const data = await res.json();
        setCountries(Array.isArray(data.result) ? data.result : []);
      } catch {
        setCountries([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!countryId) { setStates([]); return; }
    let active = true;
    (async () => {
      setLoadingStates(true);
      try {
        const fd = new FormData();
        fd.append('country_id', countryId);
        const res = await fetch(STATES_API_URL, { method: 'POST', body: fd });
        const data = await res.json();
        if (active) setStates(Array.isArray(data.result) ? data.result : []);
      } catch {
        if (active) setStates([]);
      } finally {
        if (active) setLoadingStates(false);
      }
    })();
    return () => { active = false; };
  }, [countryId]);

  useEffect(() => {
    if (!stateId) { setCounties([]); return; }
    let active = true;
    (async () => {
      setLoadingCounties(true);
      try {
        const res = await fetch(`${COUNTIES_API_URL}?state_id=${stateId}`, { method: 'POST' });
        const data = await res.json();
        if (active) setCounties(Array.isArray(data.result) ? data.result : []);
      } catch {
        if (active) setCounties([]);
      } finally {
        if (active) setLoadingCounties(false);
      }
    })();
    return () => { active = false; };
  }, [stateId]);

  const handleCountry = (e) => {
    const id = e.target.value;
    onChange('country_id', id);
    onChange('state_id', '');
    onChange('county_id', '');
  };

  const handleState = (e) => {
    const id = e.target.value;
    onChange('state_id', id);
    onChange('county_id', '');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className={labelCls} style={{ color: DARK }}>Country <span className="text-red-500">*</span></label>
        <select value={countryId || ''} onChange={handleCountry} className={selectCls}>
          <option value="">Select country</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.country_id && <p className="text-red-500 text-xs mt-1">{errors.country_id}</p>}
      </div>
      <div>
        <label className={labelCls} style={{ color: DARK }}>State <span className="text-red-500">*</span></label>
        <select value={stateId || ''} onChange={handleState} className={selectCls} disabled={!countryId}>
          <option value="">{loadingStates ? 'Loading…' : 'Select state'}</option>
          {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {errors.state_id && <p className="text-red-500 text-xs mt-1">{errors.state_id}</p>}
      </div>
      <div>
        <label className={labelCls} style={{ color: DARK }}>County <span className="text-red-500">*</span></label>
        <select value={countyId || ''} onChange={(e) => onChange('county_id', e.target.value)} className={selectCls} disabled={!stateId}>
          <option value="">{loadingCounties ? 'Loading…' : 'Select county'}</option>
          {counties.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.county_id && <p className="text-red-500 text-xs mt-1">{errors.county_id}</p>}
      </div>
    </div>
  );
}
