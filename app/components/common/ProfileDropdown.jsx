'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { USER_DETAIL_UPDATED_EVENT } from '../../utils/userDetail';
import ConfirmModal from './ConfirmModal';

const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const loadUserInfo = () => {
      const storedUser = localStorage.getItem('userDetail');
      setUserInfo(storedUser ? JSON.parse(storedUser) : null);
    };
    loadUserInfo();
    // Keep in sync when the profile is updated elsewhere (e.g. Profile Setting form)
    window.addEventListener(USER_DETAIL_UPDATED_EVENT, loadUserInfo);
    return () => window.removeEventListener(USER_DETAIL_UPDATED_EVENT, loadUserInfo);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
   
  }, []);


  const handleLogout = () => {
    setIsOpen(false);
    setShowLogoutConfirm(false);
    logout();
    localStorage.clear();
    router.push('/signin');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 focus:outline-none"
      >
        <div className="w-7 h-w-7 rounded-full overflow-hidden ">
          <Image
            src={user?.image || "/images/auth/signin/user2.png"}
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover brightness-0 invert"
          />
        </div>
        {/* <span className="text-[#1E1E1E] font-medium">
          {user?.name || 'User Name'}
        </span> */}
        <Image
          src="/images/header/dropdown.png"
          alt="Dropdown"
          width={12}
          height={12}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm flex-shrink-0">
              <Image
                src={
                  userInfo?.image
                    ? `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${userInfo.image}`
                    : "/images/auth/signin/user2.png"
                }
                alt={userInfo?.name || 'User'}
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1E1E1E] truncate">{userInfo?.name || 'User Name'}</p>
              <p className="text-xs text-gray-500 truncate">{userInfo?.email || 'user@example.com'}</p>
              {userInfo?.role && (
                <span className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wide text-[#0A3161] bg-[#0A3161]/8 px-2 py-0.5 rounded-full">
                  {userInfo.role}
                </span>
              )}
            </div>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={handleProfileClick}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#1E1E1E] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#40433F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              My Profile
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1">
            <button
              onClick={() => { setIsOpen(false); setShowLogoutConfirm(true); }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#40433F] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showLogoutConfirm}
        title="Sign Out?"
        message="Are you sure you want to sign out of your account? You'll need to sign in again to access your profile."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        confirmVariant="charcoal"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default ProfileDropdown; 