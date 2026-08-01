"use client";

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import BusinessContactForm from '../../buy-business/[id]/BusinessContactForm';

const STATES_PREVIEW_COUNT = 5;

const ProfessionalDetail = ({ professional }) => {
  const [showAllStates, setShowAllStates] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
    newsletter: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const formatAboutText = (text) => {
    return text?.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 text-[#1E1E1E] leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  const shareLink = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: professional.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // user cancelled share dialog
    }
  };

  if (!professional) {
    return <div>Professional not found</div>;
  }

  return (
    <div className="container mx-auto  px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Professional Details */}
        <div className="lg:w-1/2">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile Image */}
            <div className="w-full sm:w-48 sm:h-48 h-72 flex-shrink-0 rounded-lg overflow-hidden">
              {professional.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${professional.image}`}
                  alt={professional.name}
                  className="w-full h-full object-cover object-top rounded-lg"
                  onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-full h-full flex-col items-center justify-center bg-gradient-to-b from-[#e8edf5] to-[#c8d4e8] rounded-lg"
                style={{ display: professional.image ? 'none' : 'flex' }}
              >
                <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="50" fill="#b8c8dc" />
                  <circle cx="50" cy="38" r="18" fill="#8fa8c4" />
                  <ellipse cx="50" cy="82" rx="28" ry="18" fill="#8fa8c4" />
                </svg>
              </div>
            </div>
            {/* Title and Contact Info */}
            <div className="flex-grow">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h1 className="text-[32px] font-bold">{professional.name}</h1>
                <button
                  onClick={shareLink}
                  className="flex-shrink-0 flex items-center gap-1.5 text-sm text-[#0A3161] hover:text-[#2EC4B6] transition-colors border border-[#0A3161] hover:border-[#2EC4B6] rounded-lg px-3 py-1.5"
                  title="Share this profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
              <div className="space-y-2">
                {/* <p className="text-sm text-gray-500">
                  {professional.title}
                </p> */}
                <p className="flex items-center gap-1.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {professional.role}
                  {/* Backend only sends badge_icon once this professional's paid badge is active */}
                  {professional.badge_icon && process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${professional.badge_icon}`}
                      alt="Active badge"
                      title={`Active ${professional.role} Badge`}
                      className="w-5 h-5 rounded-full object-cover ml-1"
                    />
                  )}
                </p>

                <p className="flex items-center ">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {professional.user_information.phone_number}
                </p>
                <a
                  href={`mailto:${professional.email}`}
                  className="flex items-center text-[#0A3161] hover:text-[#2EC4B6] transition-colors"
                  title={professional.email}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>

                {professional.user_information?.licensed_states?.length > 0 && (() => {
                  const states = [...new Set(professional.user_information.licensed_states)];
                  const allStates = states.length >= 50;
                  const visibleStates = showAllStates ? states : states.slice(0, STATES_PREVIEW_COUNT);
                  const hiddenCount = states.length - STATES_PREVIEW_COUNT;
                  return (
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">Licensed in:</span>
                      {allStates ? (
                        <span className="bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/40 text-xs font-medium px-3 py-1 rounded-full">
                          All 50 states
                        </span>
                      ) : (
                        <>
                          {visibleStates.map((state) => (
                            <span
                              key={state}
                              className="bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/40 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {state}
                            </span>
                          ))}
                          {hiddenCount > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAllStates(!showAllStates)}
                              className="bg-[#0A3161]/5 text-[#0A3161] border border-[#0A3161]/20 hover:bg-[#0A3161]/10 text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                            >
                              {showAllStates ? 'Show less' : `+${hiddenCount} more`}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <h2 className="text-base font-medium  mb-4 border-b  border-black pb-1 w-fit ">About</h2>
            <div className="space-y-4 ">
              {formatAboutText(professional.user_information?.about)}
            </div>
          </div>

        </div>

        {/* Right Column - Contact Form */}
        <div className="lg:w-1/2">
          <BusinessContactForm business={professional} />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetail; 