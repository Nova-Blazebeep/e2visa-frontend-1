"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import LoadingSpinner from "@/app/components/common/LoadingSpinner";
import CardSlider from "@/app/components/common/CardSlider";

function ListingCard({ listing }) {
  const typeLabel = listing.property_type || listing.listing_type;
  const imgSrc = listing.business_images?.[0]?.image_path
    ? `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${listing.business_images[0].image_path}`
    : '/images/listing/img1.png';

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative w-full h-[180px] flex-shrink-0">
        <Image fill src={imgSrc} alt={listing.listing_heading || 'Listing'} className="object-cover" />
        {listing.verified && (
          <span className="absolute top-2 right-2 bg-[#2EC4B6] text-white text-xs px-2 py-0.5 rounded-full font-semibold z-10">
            Verified
          </span>
        )}
      </div>
      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <h2 className="text-sm font-bold text-[#1a1a1a] leading-5 line-clamp-2 mb-3 min-h-[40px]">
          {listing.listing_heading}
        </h2>
        <div className="space-y-1.5 mt-auto">
          {typeLabel && (
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <p className="text-xs text-[#0A3161] font-semibold truncate">{typeLabel}</p>
            </div>
          )}
          {listing.county?.name && (
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <p className="text-xs text-gray-500 truncate">{listing.county.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsTabs() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/new-business-listings');
        const data = await res.json();
        if (res.ok && data.result) {
          setListings(data.result);
        } else {
          setListings([]);
        }
      } catch {
        setListings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <div className="bg-[#40433F] py-[52px] text-white">
      <div className="container mx-auto px-4">
        <h1 className="text-center xl:text-3xl text-2xl text-white font-bold mb-3">New Listings</h1>
        <p className="text-center text-gray-300 text-sm md:text-base mb-16 max-w-2xl mx-auto">
          Fresh on the market — explore businesses and properties ready for their next owner.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <h2 className="text-3xl font-bold mb-2">Oops!</h2>
            <p className="text-lg">No Listings Found</p>
          </div>
        ) : (
          <CardSlider>
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/buy-business/${listing.id}`}
                data-slider-card
                className="w-[280px] flex-shrink-0 snap-start"
              >
                <ListingCard listing={listing} />
              </Link>
            ))}
          </CardSlider>
        )}
      </div>
    </div>
  );
}
