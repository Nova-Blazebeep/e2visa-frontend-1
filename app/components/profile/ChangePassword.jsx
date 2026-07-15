'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

// Toggles between an "eye" (hidden — click to reveal) and an "eye-off" (visible — click to hide) icon.
function EyeIcon({ visible }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      )}
    </svg>
  );
}

const ChangePassword = () => {

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { logout } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      setToken(token);
    }
  },[])

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return token;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = {
      current_password: formData.currentPassword,
      new_password: formData.newPassword,
      new_password_confirmation: formData.confirmPassword
    };
    try {
      const token = getToken();
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.message && data.message.toLowerCase().includes('success')) {
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        toast.success(data.message, { position: 'top-right' });
        setTimeout(() => {
          logout();
          router.push('/signin');
        }, 1500);
      } else {
        // Show backend error(s) under fields if possible
        if (data.errors && typeof data.errors === 'object') {
          const fieldErrors = {};
          Object.entries(data.errors).forEach(([key, val]) => {
            if (Array.isArray(val)) fieldErrors[key] = val[0];
            else fieldErrors[key] = val;
          });
          setErrors(fieldErrors);
        }
        if (data.message) {
          toast.error(data.message, { position: 'top-right' });
        } else {
          toast.error('Failed to change password.', { position: 'top-right' });
        }
      }
    } catch {
      toast.error('Failed to change password.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-6 px-4 lg:px-8">
      <h2 className="text-2xl lg:text-3xl text-[#40433F] font-semibold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="relative w-full max-w-[540px]">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image
              src="/images/auth/signin/lock.png"
              alt="Password icon"
              width={23}
              height={20}
            />
          </div>
          <input
            type={showPasswords.currentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder=""
            className="pl-12 w-full max-w-[540px] pr-12 py-4 rounded-xl border text-[#9E9E9E] font-medium text-[22px] border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('currentPassword')}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <EyeIcon visible={showPasswords.currentPassword} />
          </button>
          <label 
            htmlFor="currentPassword" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10"
          >
            Current Password <span className="text-red-500">*</span>
          </label>
          {errors.currentPassword && <div className="text-red-500 text-xs mt-1 ml-2">{errors.currentPassword}</div>}
        </div>

        <div className="relative w-full max-w-[540px]">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image
              src="/images/auth/signin/lock.png"
              alt="Password icon"
              width={23}
              height={20}
            />
          </div>
          <input
            type={showPasswords.newPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder=""
            className="pl-12 w-full pr-12 py-4 rounded-xl border text-[#9E9E9E] font-medium text-[22px] border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('newPassword')}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <EyeIcon visible={showPasswords.newPassword} />
          </button>
          <label 
            htmlFor="newPassword" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10"
          >
            New Password <span className="text-red-500">*</span>
          </label>
          {errors.newPassword && <div className="text-red-500 text-xs mt-1 ml-2">{errors.newPassword}</div>}
        </div>

        <div className="relative w-full max-w-[540px]">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image
              src="/images/auth/signin/lock.png"
              alt="Password icon"
              width={23}
              height={20}
            />
          </div>
          <input
            type={showPasswords.confirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder=""
            className="pl-12 w-full max-w-[540px] pr-12 py-4 rounded-xl border text-[#9E9E9E] font-medium text-[22px] border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirmPassword')}
            className="absolute inset-y-0 right-4 flex items-center"
          >
            <EyeIcon visible={showPasswords.confirmPassword} />
          </button>
          <label 
            htmlFor="confirmPassword" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10"
          >
            Confirm New Password <span className="text-red-500">*</span>
          </label>
          {errors.confirmPassword && <div className="text-red-500 text-xs mt-1 ml-2">{errors.confirmPassword}</div>}
        </div>

        <button
          type="submit"
          className="w-full bg-[#40433F] max-w-[540px] text-white py-4 rounded-xl hover:bg-[#363936] transition-colors text-lg font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword; 