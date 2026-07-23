'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The standalone profile page has moved into the dashboard.
// This route now redirects there to keep old links working.
const ProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?section=profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F4F5F4] flex items-center justify-center">
      <p className="text-sm text-gray-500">Opening your profile…</p>
    </div>
  );
};

export default ProfilePage;
