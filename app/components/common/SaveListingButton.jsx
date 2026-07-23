'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/context/AuthContext';
import { isListingSaved, toggleSavedListing, SAVED_LISTINGS_EVENT } from '@/app/utils/savedListings';

// Heart button shown on listing cards. Safe to place inside a <Link> —
// clicks are stopped from navigating. Saving requires a signed-in user.
const SaveListingButton = ({ listing, className = '' }) => {
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const sync = () => setSaved(user ? isListingSaved(listing.id) : false);
    sync();
    window.addEventListener(SAVED_LISTINGS_EVENT, sync);
    return () => window.removeEventListener(SAVED_LISTINGS_EVENT, sync);
  }, [listing.id, user]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.warn('Please sign in to save listings', { position: 'top-right', autoClose: 2500 });
      router.push('/signin');
      return;
    }
    const nowSaved = toggleSavedListing(listing);
    setSaved(nowSaved);
    if (nowSaved) {
      toast.success('Saved to your dashboard ❤️', { position: 'top-right', autoClose: 2200 });
    } else {
      toast.info('Removed from your saved listings', { position: 'top-right', autoClose: 2000 });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? 'Remove from saved listings' : 'Save listing'}
      title={saved ? 'Remove from saved listings' : 'Save listing'}
      className={`w-8 h-8 rounded-full bg-white/95 shadow flex items-center justify-center hover:scale-110 transition-transform ${className}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={saved ? '#40433F' : 'none'}
        stroke="#40433F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default SaveListingButton;
