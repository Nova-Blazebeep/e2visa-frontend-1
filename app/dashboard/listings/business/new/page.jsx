'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { canManageListings } from '@/app/utils/listingGate';
import BusinessListingForm from '@/app/components/listings/BusinessListingForm';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';

export default function NewBusinessListingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/signin'); return; }
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem('userDetail')); } catch {}
    if (!canManageListings(stored)) router.replace('/dashboard?section=listings');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="bg-[#F4F5F4] min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-[#F4F5F4] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <BusinessListingForm />
      </div>
    </div>
  );
}
