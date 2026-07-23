'use client';

import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { updateStoredUserDetail, USER_DETAIL_UPDATED_EVENT } from '../../utils/userDetail';
import ConfirmModal from '../common/ConfirmModal';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [newImage, setNewImage] = useState(null);
  const [token, setToken] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const loadFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }

      const storedUser = localStorage.getItem('userDetail');
      const parsed = storedUser ? JSON.parse(storedUser) : null;
      setUserInfo(parsed);
      if (parsed?.image) {
        setNewImage(parsed.image);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
    }
  }, []);

  useEffect(() => {
    // This effect only runs on the client side after the initial render
    setIsMounted(true);
    loadFromStorage();

    // Keep in sync when the profile is updated elsewhere (e.g. Profile Setting form)
    window.addEventListener(USER_DETAIL_UPDATED_EVENT, loadFromStorage);
    return () => window.removeEventListener(USER_DETAIL_UPDATED_EVENT, loadFromStorage);
  }, [loadFromStorage]);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout(); // removes 'user' and 'token'
    if (typeof window !== 'undefined') {
      // Clear session only — keep per-user saved listings, searches, notifications
      localStorage.removeItem('userDetail');
    }
    router.push('/signin');
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Preview locally
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImage(reader.result); // Just for preview if needed
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      if (typeof window === 'undefined' || !token) {
        console.error('Cannot upload image: Not in browser environment or missing token');
        toast.error('Failed to update image.', { position: 'top-right' });
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/update-profile-image-update`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.result?.image_url) {
        updateStoredUserDetail({ image: result.result.image_url });
        setNewImage(result.result.image_url); // Update the image in state
        toast.success('Image updated successfully!', { position: 'top-right' });
      } else {
        console.error('Upload failed:', result);
        toast.error(result.message || 'Failed to update image.', { position: 'top-right' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to update image.', { position: 'top-right' });
    }
  };



  const menuItems = [
    {
      id: 'profile',
      label: 'Profile Setting',
      icon: '/images/profile/user.png'
    },
    {
      id: 'password',
      label: 'Change Password',
      icon: '/images/profile/forgotPassword.png'
    }
  ];

  // newImage is either a data: URL (local preview right after picking a file),
  // a backend-relative path (e.g. "user_images/xyz.jpg"), or null.
  const avatarSrc = newImage
    ? (newImage.startsWith('data:')
        ? newImage
        : `${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${newImage.replace(/^\/+/, '')}`)
    : "/images/auth/signin/user2.png";

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-6 pb-6 gap-4 border-b border-gray-100">
        <label htmlFor="profile-image-upload" className="relative w-24 h-24 rounded-full overflow-hidden border border-[#2EC4B6] mb-4 flex-shrink-0 cursor-pointer group">

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt="Profile"
            width={96}
            height={96}
            className="w-full h-full object-cover rounded-full"
          />
          <input
            id="profile-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          {/* bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity  */}
          <div className="absolute inset-0 cursor-pointer flex items-end justify-end p-2">
            <div className='bg-[#2EC4B6] rounded-full p-1 border-2 border-white flex items-center justify-center'>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>

        </label>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate">{userInfo?.name || 'User Name'}</h3>
          <p className="text-gray-500 text-sm truncate">{user?.email || 'user@example.com'}</p>
          {userInfo?.role && (
            <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#0A3161] bg-[#0A3161]/8 px-2 py-0.5 rounded-full">
              {userInfo.role}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center text-[#40433F] space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                ? 'bg-[#1B263B1A] font-semibold'
                : 'hover:bg-gray-50'
              }`}
          >
            <div className='w-10 h-10 rounded-full bg-[#0A3161] flex items-center justify-center flex-shrink-0'>
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
                className={activeTab === item.id ? 'brightness-0 invert' : ''}
              />
            </div>
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#40433F] hover:bg-gray-50 transition-colors"
        >
          <div className='w-10 h-10 rounded-full bg-[#0A3161] flex items-center justify-center'>
            <Image
              src="/images/profile/logout.svg"
              alt="Logout"
              width={20}
              height={20}
            />
          </div>
          <span>Logout</span>
        </button>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        title="Log Out?"
        message="Are you sure you want to log out of your account? You'll need to sign in again to access your profile."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        confirmVariant="charcoal"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default ProfileSidebar;