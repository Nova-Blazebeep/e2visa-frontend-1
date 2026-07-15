import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '../common/LoadingSpinner';

const ITEMS_PER_PAGE = 4;

const FeaturedListings = ({ listings, loading, title = 'Featured Listing' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (listings) {
      setTotalPages(Math.ceil(listings.length / ITEMS_PER_PAGE));
      // Reset to first page when listings change
      setCurrentPage(1);
    }
  }, [listings]);

  const paginatedListings = useMemo(() => {
    if (!listings) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return listings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [listings, currentPage]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full">
      
      <div className="listing-slider flex flex-wrap justify-center gap-4 mb-16">
        {paginatedListings.length > 0 ? (
          paginatedListings.map((listing) => (
            <Link key={listing.id} href={`/buy-business/${listing.id}`}>
              <div className="bg-[#1B263B1A] w-[280px] flex-shrink-0">
                <div className="relative border rounded-lg border-[#40433F] w-full pt-[14px] pb-[19px] px-[18px]">
                  <div className="relative w-full h-[197px]">
                    <Image
                      fill
                      src={
                        listing.business_images && listing.business_images.length > 0
                          ? `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${listing.business_images[0].image_path}`
                          : '/images/listing/img1.png'
                      }
                      alt={listing.listing_heading || "Business Listing"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-[15px]">
                    <h2 className="text-xs lg:text-sm leading-6 font-semibold mb-1">
                      {listing.listing_heading?.length > 50
                        ? listing.listing_heading.slice(0, 50) + '...'
                        : listing.listing_heading}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-xs lg:text-sm mb-2">
                        {listing.listing_type?.length > 20
                          ? listing.listing_type.slice(0, 20) + '...'
                          : listing.listing_type}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 w-full">
            <h2 className="text-3xl font-bold text-[#0A3161] mb-2">Oops!</h2>
            <p className="text-lg text-gray-700">No Featured Listings Found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-8">
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
      )}
    </div>
  );
};

export default FeaturedListings;
