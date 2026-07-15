'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

// Dynamically import components with SSR disabled
const ProfileSidebar = dynamic(
  () => import('../components/profile/ProfileSidebar.jsx'),
  { ssr: false }
);

const ProfileSetting = dynamic(
  () => import('../components/profile/ProfileSetting.jsx'),
  { ssr: false }
);

const ChangePassword = dynamic(
  () => import('../components/profile/ChangePassword.jsx'),
  { ssr: false }
);

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSetting />;
      case 'password':
        return <ChangePassword />;
      default:
        return <ProfileSetting />;
    }
  };

  return (
    <>
     <div className="relative h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
        <Image
            src="/images/profile/image.png"
            alt="Listings Header"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl text-white mb-4 max-w-3xl mx-auto leading-tight">
            {user?.name || 'Profile'}
          </h1>
          <div className="flex items-center justify-center text-white">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <span>Profile</span>
          </div>
        </div>
      </div>
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full lg:w-1/4 border border-gray-200 shadow-sm bg-white mb-6 rounded-xl lg:mb-0 h-fit">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="w-full lg:w-3/4">
          {renderContent()}
        </div>
      </div>
    </div>
    </>
  );
};

export default ProfilePage; 