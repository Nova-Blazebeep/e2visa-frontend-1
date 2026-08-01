'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LocationFields from './LocationFields';
import MultiImageDropzone from './MultiImageDropzone';
import FileDropzone from './FileDropzone';
import LoadingSpinner from '../common/LoadingSpinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;
const DARK = '#40433F';

// listing_types ids 3-6 are the real estate ones ("Commercial/Residential
// Real Estate for Sale/Lease") — mirrors listing_type_real_estate in
// app/Helpers/constants.php on the backend.
const REAL_ESTATE_LISTING_TYPE_IDS = [3, 4, 5, 6];

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all';
const labelCls = 'block text-[13px] font-semibold mb-1.5';
const sectionCls = 'bg-white rounded-2xl border border-gray-200 p-5 md:p-6 space-y-4';

const emptyForm = {
  listing_heading: '', listing_summary: '',
  listing_type: '', property_type: '', rooms: '', baths: '',
  country_id: '', state_id: '', county_id: '',
  zip_code: '', street_address: '',
  is_confidential_state: false, is_confidential_country: false, is_confidential_city: false, is_confidential_address: false,
  contact_name: '', contact_email: '', contact_phone: '',
  business_website: '', is_website_confidential: false,
  asking_price: '', sale_price: '', monthly_rent: '', cash_flow: '', ebitdas: '', gross_revenue: '',
  inventory: '', inventory_included_in_price: false, ffe: '',
  building_size: '', real_estate_status: '', is_seller_financing_available: false, seller_note: '', year_established: '',
  facilities: '', support_and_training: '', reason_for_selling: '', competition_market_pros_and_cons: '', growth_and_expansion_pros_and_cons: '',
  is_required_buyer_telephone_number: false, is_required_buyer_zip_code: false, is_required_buyer_available_funds: false, is_required_buyer_timeframe: false,
};

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className={labelCls} style={{ color: DARK }}>{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-[#2EC4B6] w-4 h-4" />
      {label}
    </label>
  );
}

export default function RealEstateListingForm({ listingId }) {
  const isEdit = !!listingId;
  const router = useRouter();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [listingTypes, setListingTypes] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFinancialDocs, setExistingFinancialDocs] = useState([]);
  const [images, setImages] = useState([]);
  const [financialDocs, setFinancialDocs] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const set = (field, value) => setForm(p => ({ ...p, [field]: value }));
  const change = (e) => set(e.target.name, e.target.value);

  useEffect(() => {
    (async () => {
      try {
        const [ltRes, ptRes] = await Promise.all([
          fetch(`${API_URL}/api/all-listing-types`).then(r => r.json()),
          fetch(`${API_URL}/api/property-types`).then(r => r.json()),
        ]);
        setListingTypes((ltRes.result || []).filter(lt => REAL_ESTATE_LISTING_TYPE_IDS.includes(lt.id)));
        setPropertyTypes(Array.isArray(ptRes) ? ptRes : (ptRes.result || []));
      } catch {
        toast.error('Failed to load form options.', { position: 'top-right' });
      }
    })();
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API_URL}/api/my-listings/${listingId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
        const data = await res.json();
        if (res.ok && data.result) {
          const l = data.result;
          setForm({
            listing_heading: l.listing_heading || '', listing_summary: l.listing_summary || '',
            listing_type: l.listing_type || '', property_type: l.property_type_id || '',
            rooms: l.rooms != null ? String(l.rooms) : '', baths: l.baths != null ? String(l.baths) : '',
            country_id: l.country_id || '', state_id: l.state_id || '', county_id: l.county_id || '',
            zip_code: l.zip_code || '', street_address: l.street_address || '',
            is_confidential_state: !!l.is_confidential_state, is_confidential_country: !!l.is_confidential_country,
            is_confidential_city: !!l.is_confidential_city, is_confidential_address: !!l.is_confidential_address,
            contact_name: l.contact_name || '', contact_email: l.contact_email || '', contact_phone: l.contact_phone || '',
            business_website: l.business_website || '', is_website_confidential: !!l.is_website_confidential,
            asking_price: l.asking_price || '', sale_price: l.sale_price || '', monthly_rent: l.monthly_rent || '',
            cash_flow: l.cash_flow || '', ebitdas: l.ebitdas || '', gross_revenue: l.gross_revenue || '',
            inventory: l.inventory || '', inventory_included_in_price: !!l.inventory_included_in_price, ffe: l.ffe || '',
            building_size: l.building_size || '', real_estate_status: l.real_estate_status || '',
            is_seller_financing_available: !!l.is_seller_financing_available, seller_note: l.seller_note || '', year_established: l.year_established || '',
            facilities: l.facilities || '', support_and_training: l.support_and_training || '', reason_for_selling: l.reason_for_selling || '',
            competition_market_pros_and_cons: l.competition_market_pros_and_cons || '', growth_and_expansion_pros_and_cons: l.growth_and_expansion_pros_and_cons || '',
            is_required_buyer_telephone_number: !!l.is_required_buyer_telephone_number, is_required_buyer_zip_code: !!l.is_required_buyer_zip_code,
            is_required_buyer_available_funds: !!l.is_required_buyer_available_funds, is_required_buyer_timeframe: !!l.is_required_buyer_timeframe,
          });
          setExistingImages(l.business_images || []);
          setExistingFinancialDocs(l.financial_documents || []);
        } else {
          toast.error('Listing not found.', { position: 'top-right' });
          router.push('/dashboard?section=listings');
        }
      } catch {
        toast.error('Failed to load listing.', { position: 'top-right' });
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, listingId, router]);

  const selectedPropertyType = propertyTypes.find(p => String(p.id) === String(form.property_type));
  const isRentType = (selectedPropertyType?.name || '').toLowerCase().includes('for rent/lease');

  const validate = (publishing) => {
    const err = {};
    if (!form.listing_heading.trim()) err.listing_heading = publishing ? 'Required.' : 'A title is required, even for a draft.';
    if (publishing) {
      if (!form.country_id) err.country_id = 'Required.';
      if (!form.state_id) err.state_id = 'Required.';
      if (!form.county_id) err.county_id = 'Required.';
      if (!form.listing_type) err.listing_type = 'Required.';
      if (!form.property_type) err.property_type = 'Required.';
      if (!form.rooms) err.rooms = 'Required.';
      if (!form.baths) err.baths = 'Required.';
      if (!form.contact_name.trim()) err.contact_name = 'Required.';
      if (!form.contact_email.trim()) err.contact_email = 'Required.';
      if (!form.contact_phone.trim()) err.contact_phone = 'Required.';
    }
    return err;
  };

  const submit = async (publishing) => {
    const err = validate(publishing);
    setErrors(err);
    if (Object.keys(err).length) {
      toast.error('Please fix the highlighted fields.', { position: 'top-right' });
      return;
    }
    setSaving(publishing ? 'publish' : 'draft');
    const token = localStorage.getItem('token');
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === 'boolean') { fd.append(key, value ? '1' : '0'); return; }
      if (value !== '' && value != null) fd.append(key, value);
    });
    fd.append('is_publish', publishing ? '1' : '0');
    images.forEach(f => fd.append('images[]', f));
    financialDocs.forEach(f => fd.append('seller_financial_documents[]', f));

    try {
      const url = isEdit ? `${API_URL}/api/my-listings/real-estate/${listingId}` : `${API_URL}/api/my-listings/real-estate`;
      const res = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, body: fd });
      const data = await res.json();
      if (res.ok && data.result) {
        toast.success(isEdit ? 'Listing updated.' : (publishing ? 'Listing published!' : 'Draft saved.'), { position: 'top-right' });
        router.push('/dashboard?section=listings');
      } else {
        if (data.errors) {
          setErrors(prev => ({ ...prev, ...Object.fromEntries(Object.entries(data.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])) }));
        }
        toast.error(data.message || 'Failed to save listing.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to save listing.', { position: 'top-right' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard?section=listings" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#40433F] transition-colors mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Back to My Listings
        </Link>
        <h1 className="text-2xl font-bold" style={{ color: DARK }}>{isEdit ? 'Edit Real Estate Listing' : 'Add Real Estate Listing'}</h1>
        <p className="text-sm text-gray-500 mt-1">Save as a draft any time, or publish when you&apos;re ready to go live.</p>
      </div>

      {/* Listing basics */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Listing Basics</h2>
        <Field label="Listing Title" required error={errors.listing_heading}>
          <input name="listing_heading" value={form.listing_heading} onChange={change} className={inputCls} placeholder="e.g. Downtown Commercial Building" />
        </Field>
        <Field label="Summary" error={errors.listing_summary}>
          <textarea name="listing_summary" value={form.listing_summary} onChange={change} rows={4} className={inputCls} placeholder="Describe the property…" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Listing Type" required error={errors.listing_type}>
            <select name="listing_type" value={form.listing_type} onChange={change} className={inputCls}>
              <option value="">Select listing type</option>
              {listingTypes.map(lt => <option key={lt.id} value={lt.listing_type}>{lt.listing_type}</option>)}
            </select>
          </Field>
          <Field label="Property Type" required error={errors.property_type}>
            <select name="property_type" value={form.property_type} onChange={change} className={inputCls}>
              <option value="">Select property type</option>
              {propertyTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Rooms (Beds)" required error={errors.rooms}>
            <input name="rooms" value={form.rooms} onChange={change} className={inputCls} placeholder="e.g. 3" />
          </Field>
          <Field label="Bathrooms" required error={errors.baths}>
            <input name="baths" value={form.baths} onChange={change} className={inputCls} placeholder="e.g. 2" />
          </Field>
        </div>
      </div>

      {/* Location */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Location</h2>
        <LocationFields
          countryId={form.country_id} stateId={form.state_id} countyId={form.county_id}
          onChange={set} errors={errors}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="City"><input name="zip_code" value={form.zip_code} onChange={change} className={inputCls} placeholder="City" /></Field>
          <Field label="Street Address"><input name="street_address" value={form.street_address} onChange={change} className={inputCls} placeholder="Street address" /></Field>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Checkbox checked={form.is_confidential_country} onChange={() => set('is_confidential_country', !form.is_confidential_country)} label="Keep country confidential" />
          <Checkbox checked={form.is_confidential_state} onChange={() => set('is_confidential_state', !form.is_confidential_state)} label="Keep state confidential" />
          <Checkbox checked={form.is_confidential_city} onChange={() => set('is_confidential_city', !form.is_confidential_city)} label="Keep city confidential" />
          <Checkbox checked={form.is_confidential_address} onChange={() => set('is_confidential_address', !form.is_confidential_address)} label="Keep address confidential" />
        </div>
      </div>

      {/* Pricing */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Pricing</h2>
        {isRentType ? (
          <Field label="Monthly Rent"><input name="monthly_rent" value={form.monthly_rent} onChange={change} className={inputCls} placeholder="$" /></Field>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Asking Price"><input name="asking_price" value={form.asking_price} onChange={change} className={inputCls} placeholder="$" /></Field>
            <Field label="Sale Price"><input name="sale_price" value={form.sale_price} onChange={change} className={inputCls} placeholder="$" /></Field>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Building Size"><input name="building_size" value={form.building_size} onChange={change} className={inputCls} placeholder="sqft" /></Field>
          <Field label="Year Established"><input name="year_established" value={form.year_established} onChange={change} className={inputCls} /></Field>
          <Field label="Status"><input name="real_estate_status" value={form.real_estate_status} onChange={change} className={inputCls} placeholder="e.g. Active, Under Contract" /></Field>
          <Field label="Cash Flow"><input name="cash_flow" value={form.cash_flow} onChange={change} className={inputCls} /></Field>
          <Field label="EBITDA"><input name="ebitdas" value={form.ebitdas} onChange={change} className={inputCls} /></Field>
          <Field label="Gross Revenue"><input name="gross_revenue" value={form.gross_revenue} onChange={change} className={inputCls} /></Field>
          <Field label="Inventory"><input name="inventory" value={form.inventory} onChange={change} className={inputCls} /></Field>
          <Field label="FF&E"><input name="ffe" value={form.ffe} onChange={change} className={inputCls} /></Field>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Checkbox checked={form.inventory_included_in_price} onChange={() => set('inventory_included_in_price', !form.inventory_included_in_price)} label="Inventory included in price" />
          <Checkbox checked={form.is_seller_financing_available} onChange={() => set('is_seller_financing_available', !form.is_seller_financing_available)} label="Seller financing available" />
        </div>
        {form.is_seller_financing_available && (
          <Field label="Seller Note"><textarea name="seller_note" value={form.seller_note} onChange={change} rows={2} className={inputCls} /></Field>
        )}
      </div>

      {/* Description */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>More Details <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
        <Field label="Facilities"><textarea name="facilities" value={form.facilities} onChange={change} rows={2} className={inputCls} /></Field>
        <Field label="Support &amp; Training"><textarea name="support_and_training" value={form.support_and_training} onChange={change} rows={2} className={inputCls} /></Field>
        <Field label="Reason for Selling"><textarea name="reason_for_selling" value={form.reason_for_selling} onChange={change} rows={2} className={inputCls} /></Field>
        <Field label="Competition / Market Pros &amp; Cons"><textarea name="competition_market_pros_and_cons" value={form.competition_market_pros_and_cons} onChange={change} rows={2} className={inputCls} /></Field>
        <Field label="Growth &amp; Expansion"><textarea name="growth_and_expansion_pros_and_cons" value={form.growth_and_expansion_pros_and_cons} onChange={change} rows={2} className={inputCls} /></Field>
      </div>

      {/* Contact */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Contact Name" required error={errors.contact_name}><input name="contact_name" value={form.contact_name} onChange={change} className={inputCls} /></Field>
          <Field label="Contact Email" required error={errors.contact_email}><input type="email" name="contact_email" value={form.contact_email} onChange={change} className={inputCls} /></Field>
          <Field label="Contact Phone" required error={errors.contact_phone}><input name="contact_phone" value={form.contact_phone} onChange={change} className={inputCls} /></Field>
        </div>
        <Field label="Website"><input name="business_website" value={form.business_website} onChange={change} className={inputCls} /></Field>
        <Checkbox checked={form.is_website_confidential} onChange={() => set('is_website_confidential', !form.is_website_confidential)} label="Keep website confidential" />
        <div>
          <label className={labelCls} style={{ color: DARK }}>Require buyers to provide</label>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Checkbox checked={form.is_required_buyer_telephone_number} onChange={() => set('is_required_buyer_telephone_number', !form.is_required_buyer_telephone_number)} label="Phone number" />
            <Checkbox checked={form.is_required_buyer_zip_code} onChange={() => set('is_required_buyer_zip_code', !form.is_required_buyer_zip_code)} label="Zip code" />
            <Checkbox checked={form.is_required_buyer_available_funds} onChange={() => set('is_required_buyer_available_funds', !form.is_required_buyer_available_funds)} label="Available funds" />
            <Checkbox checked={form.is_required_buyer_timeframe} onChange={() => set('is_required_buyer_timeframe', !form.is_required_buyer_timeframe)} label="Purchase timeframe" />
          </div>
        </div>
      </div>

      {/* Photos */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Photos</h2>
        <MultiImageDropzone files={images} onChange={setImages} existingImages={existingImages} storageUrl={STORAGE_URL} isEdit={isEdit} />
      </div>

      {/* Documents */}
      <div className={sectionCls}>
        <h2 className="text-lg font-bold" style={{ color: DARK }}>Financial Documents <span className="text-sm font-normal text-gray-400">(optional)</span></h2>
        <FileDropzone
          files={financialDocs} onChange={setFinancialDocs} multiple
          accept=".pdf,.doc,.docx,.xlsx" extensions={['pdf', 'doc', 'docx', 'xlsx']} maxSizeMB={10}
          label="PDF, Word, or Excel, up to 10MB each"
          existingLabel={existingFinancialDocs.length > 0 ? `${existingFinancialDocs.length} document(s) on file — uploading new ones replaces them.` : null}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.push('/dashboard?section=listings')}
          className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => submit(false)}
          disabled={!!saving}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          style={{ color: DARK }}
        >
          {saving === 'draft' ? 'Saving…' : 'Save as Draft'}
        </button>
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={!!saving}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ background: DARK }}
        >
          {saving === 'publish' ? 'Publishing…' : 'Publish Listing'}
        </button>
      </div>
    </div>
  );
}
