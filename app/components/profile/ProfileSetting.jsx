'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { updateStoredUserDetail, USER_DETAIL_UPDATED_EVENT } from '../../utils/userDetail';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','Washington D.C.'
];

const ProfileSetting = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    about: '',
    licensed_states: [],
  });
  const [errors, setErrors] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    const loadFromStorage = () => {
      let localUser = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('userDetail');
        if (stored) {
          try { localUser = JSON.parse(stored); } catch {}
        }
      }
      const src = localUser || user;
      if (src) {
        setFormData({
          fullName: src.name || '',
          email: src.email || '',
          phone: src.phone || src.user_information?.phone_number || '',
          about: src.about || '',
          licensed_states: src.user_information?.licensed_states || [],
        });
      }
    };

    loadFromStorage();
    // Keep in sync if the profile is updated elsewhere (e.g. the image upload in the sidebar)
    window.addEventListener(USER_DETAIL_UPDATED_EVENT, loadFromStorage);
    return () => window.removeEventListener(USER_DETAIL_UPDATED_EVENT, loadFromStorage);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleState = (stateName) => {
    setFormData(prev => {
      const current = prev.licensed_states;
      if (current.includes(stateName)) {
        return { ...prev, licensed_states: current.filter(s => s !== stateName) };
      }
      return { ...prev, licensed_states: [...current, stateName] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.about.trim()) newErrors.about = 'About is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const form = new FormData();
    form.append('name', formData.fullName);
    form.append('phone_number', formData.phone);
    form.append('about', formData.about);
    formData.licensed_states.forEach(s => form.append('licensed_states[]', s));

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/user/profile', {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.result && data.result.user) {
        toast.success(data.message, { position: 'top-right' });
        updateStoredUserDetail(data.result.user);
        setFormData({
          fullName: data.result.user.name || '',
          email: data.result.user.email || '',
          phone: data.result.user.user_information?.phone_number || '',
          about: data.result.user.about || '',
          licensed_states: data.result.user.user_information?.licensed_states || [],
        });
      } else {
        toast.error(data.message || 'Failed to update profile.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to update profile.', { position: 'top-right' });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-6 px-4 lg:px-8">
      <h2 className="text-2xl lg:text-3xl text-[#40433F] font-semibold mb-6">Profile Setting</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Full Name */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image src="/images/profile/userblack.png" alt="User icon" width={23} height={20} />
          </div>
          <input
            type="text" id="fullName" name="fullName" value={formData.fullName}
            onChange={handleChange} placeholder=" "
            className="pl-12 w-full max-w-[540px] pr-4 py-4 rounded-xl border text-[#9E9E9E] font-medium text-lg border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <label htmlFor="fullName" className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10">
            Full Name <span className="text-red-500">*</span>
          </label>
          {errors.fullName && <div className="text-red-500 text-xs mt-1">{errors.fullName}</div>}
        </div>

        {/* Email */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image src="/images/auth/signin/mail.png" alt="Email icon" width={23} height={20} />
          </div>
          <input
            type="email" id="email" name="email" value={formData.email}
            onChange={handleChange} placeholder=" " readOnly
            className="pl-12 w-full max-w-[540px] pr-4 py-4 rounded-xl border text-[#9E9E9E] font-medium text-lg border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <label htmlFor="email" className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10">
            Email
          </label>
        </div>

        {/* Phone */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image src="/images/profile/mobile.png" alt="Phone icon" width={23} height={20} />
          </div>
          <input
            type="tel" id="phone" name="phone" value={formData.phone}
            onChange={handleChange} placeholder=" "
            className="pl-12 w-full max-w-[540px] pr-4 py-4 rounded-xl border text-[#9E9E9E] font-medium text-lg border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none peer bg-white"
          />
          <label htmlFor="phone" className="absolute text-sm text-[#1E1E1E] left-12 bg-white px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all z-10">
            Phone no <span className="text-red-500">*</span>
          </label>
          {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
        </div>

        {/* About */}
        <div className="relative">
          <textarea
            id="about" name="about" value={formData.about} onChange={handleChange}
            placeholder="About you..."
            className="w-full max-w-[540px] pr-4 pl-4 py-4 rounded-xl border text-[#9E9E9E] font-medium text-lg border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none bg-white min-h-[100px]"
          />
          <label htmlFor="about" className="absolute text-sm text-[#1E1E1E] left-4 bg-white px-1 -top-2 z-10">
            About <span className="text-red-500">*</span>
          </label>
          {errors.about && <div className="text-red-500 text-xs mt-1">{errors.about}</div>}
        </div>

        {/* Licensed States */}
        <div className="w-full max-w-[540px]">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm text-[#1E1E1E] font-medium">
              Licensed States
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.licensed_states.length === US_STATES.length}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  licensed_states: e.target.checked ? [...US_STATES] : []
                }))}
                className="accent-[#2EC4B6]"
              />
              Select all states
            </label>
          </div>
          {formData.licensed_states.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.licensed_states.map(s => (
                <span key={s} className="flex items-center gap-1 bg-[#2EC4B6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {s}
                  <button type="button" onClick={() => toggleState(s)} className="ml-1 text-white hover:text-gray-200 leading-none">&times;</button>
                </span>
              ))}
            </div>
          )}
          <div className="border border-[#1B263B] rounded-xl p-3 max-h-48 overflow-y-auto grid grid-cols-2 gap-1">
            {US_STATES.map(s => {
              const selected = formData.licensed_states.includes(s);
              return (
                <label key={s} className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm hover:bg-gray-50">
                  <input
                    type="checkbox" checked={selected}
                    onChange={() => toggleState(s)}
                    className="accent-[#2EC4B6]"
                  />
                  {s}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-1">{formData.licensed_states.length} selected</p>
        </div>

        <button
          type="submit"
          className="w-full bg-[#40433F] max-w-[540px] text-white py-4 rounded-xl hover:bg-[#363936] transition-colors text-lg font-medium"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfileSetting;
