'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { topListings } from '../../components/home/Listing';
import { newListings } from '../../components/home/NewListing';
import { toast } from 'react-toastify';
import BusinessContactForm from './BusinessContactForm';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import { formatRealEstatePrice, getSqftLabel } from '@/app/utils/priceRange';

const BusinessDetail = ({ params }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
    newsletter: false
  });

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getOwnedListingHref = () => {
    if (!business) return null;
    try {
      const stored = JSON.parse(localStorage.getItem('userDetail'));
      if (!stored || stored.id !== business.user_id) return null;
    } catch {
      return null;
    }
    return `/dashboard/listings/${business.business_type === 'real-estate' ? 'real-estate' : 'business'}/${business.id}/edit`;
  };

  const shareLink = async (title) => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // user cancelled share dialog
    }
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business-detail/${params.id}`);
        const data = await res.json();
        if (res.ok && data.result) {
          setBusiness(data.result);
          console.log('Business detail:', data.result);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [params.id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone Number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const params = new URLSearchParams({
      professional_id: business.user_id,
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      message: formData.message,
    });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/send-email-to-professional?${params.toString()}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setFormData({ fullName: '', phoneNumber: '', email: '', message: '', newsletter: false });
        setErrors({});
        toast.success(data.message, { position: 'top-right' });
      } else {
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'object') {
            Object.values(data.errors).flat().forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'string') {
            toast.error(data.errors, { position: 'top-right' });
          }
        } else if (data.message) {
          toast.error(data.message, { position: 'top-right' });
        } else {
          toast.error('Failed to send message.', { position: 'top-right' });
        }
      }
    } catch {
      toast.error('Failed to send message.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-2xl text-gray-600"><LoadingSpinner /></div>
  </div>;
  if (!business) return <div>No business found.</div>;

  // Returns false for null, undefined, empty string, "NA", "N/A" etc.
  const hasValue = (val) => {
    if (val === null || val === undefined) return false;
    const str = String(val).trim().toLowerCase();
    return str !== '' && str !== 'na' && str !== 'n/a' && str !== 'null' && str !== 'undefined';
  };

  // For numeric fields: must be a real number (not null/NA/empty)
  const hasNumeric = (val) => {
    if (!hasValue(val)) return false;
    return !isNaN(parseFloat(val));
  };

  const isRealEstate = business.business_type === 'real-estate';

  // ─── Financial / key info block ───────────────────────────────────────────
  const FinancialInfo = () => (
    <div className="space-y-1 mb-8">
      {isRealEstate ? (
        <>
          {/* Real Estate sequence with icons */}
          <div className="flex text-[#40433F] justify-between text-lg xl:text-2xl items-center">
            <span className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#40433F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {(business.property_type || '').toLowerCase().includes('[for rent/lease]') ? 'Monthly Rent' : 'Price'}
            </span>
            <span className="font-semibold">{formatRealEstatePrice(business)}</span>
          </div>

          {hasValue(business.country?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Country
              </span>
              <span>{business.country.name}</span>
            </div>
          )}
          {hasValue(business.state?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                State
              </span>
              <span>{business.state.name}</span>
            </div>
          )}
          {hasValue(business.county?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                County
              </span>
              <span>{business.county.name}</span>
            </div>
          )}
          {hasValue(business.zip_code) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                City
              </span>
              <span>{business.zip_code}</span>
            </div>
          )}
          {hasValue(business.street_address) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Street Address
              </span>
              <div className="flex items-center gap-2 text-right max-w-[60%]">
                <span>{business.street_address}</span>
                <a
                  href={business.latitude && business.longitude
                    ? `https://www.google.com/maps?q=${business.latitude},${business.longitude}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.street_address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View on map"
                  className="flex-shrink-0"
                >
                  <svg width="16" height="20" viewBox="0 0 24 30" fill="none">
                    <path d="M12 0C7.589 0 4 3.589 4 8c0 5.25 7 14 8 15 1-1 8-9.75 8-15 0-4.411-3.589-8-8-8z" fill="#c0392b"/>
                    <circle cx="12" cy="8" r="3" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>
          )}
          {hasValue(business.property_type) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Property Type
              </span>
              <span>{business.property_type}</span>
            </div>
          )}
          {hasNumeric(business.building_size) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                Square Footage
              </span>
              <span>{getSqftLabel(business.building_size) || `${parseInt(business.building_size, 10).toLocaleString()} sqft`}</span>
            </div>
          )}
          {hasValue(business.rooms) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9V4a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v5"/><path d="M2 11v6h20v-6"/><path d="M2 17v3"/><path d="M22 17v3"/><path d="M6 11V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/></svg>
                Rooms (Beds)
              </span>
              <span>{business.rooms}+</span>
            </div>
          )}
          {hasValue(business.baths) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
                Bathrooms
              </span>
              <span>{business.baths}+</span>
            </div>
          )}
          {hasValue(business.real_estate_status) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Status
              </span>
              <span>{business.real_estate_status}</span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Business sequence: Asking Price → Country → State → County → Primary Business Type → Listing Type → Secondary Business Types → Year Established */}
          {hasNumeric(business.asking_price) && (
            <div className="flex text-[#40433F] justify-between text-lg xl:text-2xl items-center">
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#40433F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                Asking Price
              </span>
              <span className="font-semibold">${parseInt(business.asking_price, 10).toLocaleString()}</span>
            </div>
          )}
          {hasValue(business.country?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Country
              </span>
              <span>{business.country.name}</span>
            </div>
          )}
          {hasValue(business.state?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
                State
              </span>
              <span>{business.state.name}</span>
            </div>
          )}
          {hasValue(business.county?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                County
              </span>
              <span>{business.county.name}</span>
            </div>
          )}
          {hasValue(business.category?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                Primary Business Type
              </span>
              <span>{business.category.name}</span>
            </div>
          )}
          {hasValue(business.listing_type) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                Listing Type
              </span>
              <span>{business.listing_type}</span>
            </div>
          )}
          {hasValue(business.subcategory?.name) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                Secondary Business Types
              </span>
              <span>{business.subcategory.name}</span>
            </div>
          )}
          {hasValue(business.year_established) && (
            <div className="flex text-[#64748B] justify-between items-center">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Year Established
              </span>
              <span>{business.year_established}</span>
            </div>
          )}
        </>
      )}
      {business.is_seller_financing_available == 1 && (
        <div className="flex text-[#64748B] justify-between items-center">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
            Seller Financing
          </span>
          <span>Available</span>
        </div>
      )}
    </div>
  );

  // ─── NDA download block ───────────────────────────────────────────────────
  const NdaDownload = () => {
    if (!business.nda_document_url) return null;
    return (
      <div className="flex items-center gap-3 bg-[#40433F]/5 border border-[#40433F]/20 rounded-lg px-4 py-3 mb-8">
        <svg className="w-5 h-5 text-[#40433F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#40433F]">Non-Disclosure Agreement Required</p>
          <p className="text-xs text-[#64748B] mt-0.5">Download and review the NDA before contacting the seller.</p>
        </div>
        <a
          href={business.nda_document_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 self-center inline-flex items-center gap-1.5 bg-[#40433F] hover:bg-[#363936] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download NDA
        </a>
      </div>
    );
  };

  // ─── Description & details block ──────────────────────────────────────────
  const DetailedInfo = () => (
    <>
      {!isRealEstate && hasValue(business.user?.userInformation?.about) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#40433F] mb-4">About</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.user.userInformation.about}</p>
        </div>
      )}
      {hasValue(business.listing_summary) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#40433F] mb-4">Description</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.listing_summary}</p>
        </div>
      )}

      {hasValue(business.facilities) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Facilities</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.facilities}</p>
        </div>
      )}

      {hasValue(business.support_and_training) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Support / Training</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.support_and_training}</p>
        </div>
      )}

      {hasValue(business.reason_for_selling) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Reason for Selling</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.reason_for_selling}</p>
        </div>
      )}

      {hasValue(business.competition_market_pros_and_cons) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Competition / Market Pros & Cons</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.competition_market_pros_and_cons}</p>
        </div>
      )}

      {hasValue(business.growth_and_expansion_pros_and_cons) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Growth & Expansion</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.growth_and_expansion_pros_and_cons}</p>
        </div>
      )}

      {hasValue(business.seller_note) && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#40433F] mb-2">Seller Note</h2>
          <p className="text-gray-600 whitespace-pre-line">{business.seller_note}</p>
        </div>
      )}
    </>
  );


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Layout: stacked order (image, info, form) */}
        <div className="block lg:hidden space-y-8">
          {/* Image */}
          <div className="relative h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                <LoadingSpinner />
              </div>
            )}
            <Image
              fill
              src={
                business.business_images && business.business_images.length > 0
                  ? business.business_images[0].image_path
                  : '/images/listing/img1.png'
              }
              alt={business.listing_heading}
              className="w-full h-full object-cover"
              sizes="100vw"
              quality={90}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              style={imageLoading ? { visibility: 'hidden' } : {}}
            />
            {business.verified && (
              <div className="absolute top-4 right-4 bg-[#2EC4B6] z-30 text-white text-sm px-3 py-1 rounded-full">
                Verified
              </div>
            )}
          </div>
          {/* Business Info */}
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm">
            <div className="mb-8">
              {/* Title is listing_heading only — business name is confidential */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl xl:text-3xl font-semibold text-[#40433F]">{business.listing_heading}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getOwnedListingHref() && (
                    <Link
                      href={getOwnedListingHref()}
                      className="flex-shrink-0 flex items-center gap-1.5 text-sm text-white bg-[#40433F] hover:bg-[#363936] transition-colors rounded-lg px-3 py-1.5"
                      title="Edit this listing"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Listing
                    </Link>
                  )}
                  <button
                    onClick={() => shareLink(business.listing_heading)}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[#0A3161] hover:text-[#2EC4B6] transition-colors border border-[#0A3161] hover:border-[#2EC4B6] rounded-lg px-3 py-1.5"
                    title="Share this listing"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
            <FinancialInfo />
            <NdaDownload />
            <DetailedInfo />
          </div>
          {/* Contact Form */}
          <BusinessContactForm business={business} />
        </div>
        {/* Desktop Layout: two columns */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Business Image and Contact Form */}
          <div className="space-y-8">
            <div className="relative h-[500px] rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                  <LoadingSpinner />
                </div>
              )}
              <Image
                fill
                src={
                  business.business_images && business.business_images.length > 0
                    ? business.business_images[0].image_path
                    : '/images/listing/img1.png'
                }
                alt={business.listing_heading}
                className="w-full h-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
                style={imageLoading ? { visibility: 'hidden' } : {}}
              />
              {business.verified && (
                <div className="absolute top-4 right-4 bg-[#2EC4B6] z-30 text-white text-sm px-3 py-1 rounded-full">
                  Verified
                </div>
              )}
            </div>
            {/* Contact Form */}
            <BusinessContactForm business={business} />
          </div>
          {/* Right Column - Business Information */}
          <div className="bg-white p-4 sm:p-8 rounded-lg shadow-sm">
            <div className="mb-8">
              {/* Title is listing_heading only — business name is confidential */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl xl:text-3xl font-semibold text-[#40433F]">{business.listing_heading}</h1>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getOwnedListingHref() && (
                    <Link
                      href={getOwnedListingHref()}
                      className="flex-shrink-0 flex items-center gap-1.5 text-sm text-white bg-[#40433F] hover:bg-[#363936] transition-colors rounded-lg px-3 py-1.5"
                      title="Edit this listing"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Listing
                    </Link>
                  )}
                  <button
                    onClick={() => shareLink(business.listing_heading)}
                    className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[#0A3161] hover:text-[#2EC4B6] transition-colors border border-[#0A3161] hover:border-[#2EC4B6] rounded-lg px-3 py-1.5"
                    title="Share this listing"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            </div>
            <FinancialInfo />
            <NdaDownload />
            <DetailedInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
