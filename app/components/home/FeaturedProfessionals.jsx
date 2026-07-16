"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import CardSlider from "@/app/components/common/CardSlider";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ProCard = ({ pro, onClick, backendUrl }) => {
  const rawPath = pro.user_information?.image ?? pro.image ?? null;
  const hasImage = rawPath && !rawPath.startsWith('/images/');
  const imageUrl = hasImage
    ? `${backendUrl}/${rawPath.replace(/^\/+/, '')}`
    : null;

  const [imgFailed, setImgFailed] = useState(false);
  const showPlaceholder = !imageUrl || imgFailed;

  const licensedStates = Array.isArray(pro.user_information?.licensed_states)
    ? [...new Set(pro.user_information.licensed_states)]
    : [];
  const licensedLabel = licensedStates.length >= 50
    ? 'All 50 states'
    : licensedStates.length > 3
      ? licensedStates.slice(0, 3).join(', ') + '…'
      : licensedStates.length > 0
        ? licensedStates.join(', ')
        : null;

  return (
    <div
      data-slider-card
      className="w-[280px] flex-shrink-0 snap-start bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
      onClick={onClick}
    >
      {/* Photo / avatar — 4:5 portrait ratio scales with card width; object-top keeps heads in frame */}
      <div className="relative w-full aspect-[4/5] flex-shrink-0 bg-gradient-to-b from-[#e8edf5] to-[#c8d4e8] flex items-center justify-center">
        {showPlaceholder ? (
          <svg width="90" height="90" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#b8c8dc" />
            <circle cx="50" cy="38" r="18" fill="#8fa8c4" />
            <ellipse cx="50" cy="82" rx="28" ry="18" fill="#8fa8c4" />
          </svg>
        ) : (
          <img
            src={imageUrl}
            alt={pro.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            onError={() => setImgFailed(true)}
          />
        )}
        {pro.badge_icon && backendUrl && (
          <div className="absolute top-2 right-2 w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow">
            <Image
              src={`${backendUrl}/${pro.badge_icon}`}
              alt="badge"
              width={28}
              height={28}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 text-left">
        <h2 className="text-sm font-bold text-[#1a1a1a] leading-5 line-clamp-1 mb-2" title={pro.name}>
          {pro.name}
        </h2>
        <div className="space-y-1.5">
          {pro.role && (
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <p className="text-xs text-[#0A3161] font-semibold truncate">{pro.role}</p>
            </div>
          )}
          {licensedLabel && (
            <div className="flex items-start gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p className="text-xs text-gray-500 line-clamp-2">Licensed In: {licensedLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeaturedProfessionals = () => {
  const router = useRouter();
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/professionals/featured-professionals");
        const data = await res.json();
        if (data && data.result) {
          setProfessionals(shuffle(data.result));
        }
      } catch (error) {
        setProfessionals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  return (
    <div className="xl:py-[92px] py-10 mt-8 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-center xl:text-3xl text-[#40433F] text-2xl font-bold mb-3">
          Professionals
        </h1>
        <p className="text-center text-gray-500 text-sm md:text-base mb-16 max-w-2xl mx-auto">
          Trusted brokers, attorneys, and advisors — the right expert for every step of your journey.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : professionals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-3xl font-bold text-[#0A3161] mb-2">Oops!</h2>
            <p className="text-lg text-gray-700">No Professionals Found</p>
          </div>
        ) : (
          <CardSlider autoplay speed={75}>
            {professionals.map((pro) => (
              <ProCard
                key={pro.id}
                pro={pro}
                backendUrl={BACKEND_STORAGE_URL}
                onClick={() => router.push(`/professional/${pro.id}`)}
              />
            ))}
          </CardSlider>
        )}
      </div>
    </div>
  );
};

export default FeaturedProfessionals;
