'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { updateStoredUserDetail, USER_DETAIL_UPDATED_EVENT } from '../../utils/userDetail';
import {
  getNotificationPrefs,
  setNotificationPref,
  NOTIFICATION_PREFS_EVENT,
} from '../../utils/notificationPrefs';

const DARK = '#40433F';
const TEAL = '#2EC4B6';
const TEAL_DARK = '#22A99C';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming','Washington D.C.',
];

const inputCls =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all';
const labelCls = 'block text-[13px] font-semibold mb-1.5';

// ─── Toggle switch ───────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors"
    style={{ background: checked ? TEAL : '#d1d5db' }}
  >
    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
  </button>
);

// ─── Tabs ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'profile', label: 'Profile', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  { key: 'password', label: 'Password', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></> },
  { key: 'notifications', label: 'Notifications', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> },
];

// ─── Profile panel ───────────────────────────────────────────────────────────
function ProfilePanel() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', about: '', licensed_states: [] });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (typeof window === 'undefined') return;
    setToken(localStorage.getItem('token'));
    let src = null;
    try { src = JSON.parse(localStorage.getItem('userDetail')); } catch {}
    src = src || user;
    setUserInfo(src);
    if (src) {
      setForm({
        fullName: src.name || '',
        email: src.email || '',
        phone: src.phone || src.user_information?.phone_number || '',
        about: src.about || '',
        licensed_states: src.user_information?.licensed_states || [],
      });
    }
  }, [user]);

  useEffect(() => {
    load();
    window.addEventListener(USER_DETAIL_UPDATED_EVENT, load);
    return () => window.removeEventListener(USER_DETAIL_UPDATED_EVENT, load);
  }, [load]);

  const change = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const toggleState = (s) =>
    setForm(p => ({
      ...p,
      licensed_states: p.licensed_states.includes(s)
        ? p.licensed_states.filter(x => x !== s)
        : [...p.licensed_states, s],
    }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
    if (!token) { toast.error('Please sign in again to update your photo.'); return; }
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${API_URL}/api/update-profile-image-update`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      const data = await res.json();
      if (res.ok && data.result?.image_url) {
        updateStoredUserDetail({ image: data.result.image_url });
        toast.success('Photo updated successfully!', { position: 'top-right' });
      } else {
        toast.error(data.message || 'Failed to update photo.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to update photo.', { position: 'top-right' });
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.fullName.trim()) err.fullName = 'Full name is required.';
    if (!form.phone.trim()) err.phone = 'Phone number is required.';
    if (!form.about.trim()) err.about = 'About is required.';
    setErrors(err);
    if (Object.keys(err).length) return;

    setSaving(true);
    const fd = new FormData();
    fd.append('name', form.fullName);
    fd.append('phone_number', form.phone);
    fd.append('about', form.about);
    form.licensed_states.forEach(s => fd.append('licensed_states[]', s));
    try {
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: 'POST', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: fd,
      });
      const data = await res.json();
      if (res.ok && data.result?.user) {
        toast.success(data.message || 'Profile updated.', { position: 'top-right' });
        updateStoredUserDetail(data.result.user);
      } else {
        toast.error(data.message || 'Failed to update profile.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to update profile.', { position: 'top-right' });
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = preview
    ? preview
    : userInfo?.image ? `${STORAGE_URL}/${userInfo.image}` : '/images/auth/signin/user2.png';

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Avatar row */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow">
            <Image src={avatarSrc} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />
          </div>
          <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors" style={{ background: TEAL }} title="Change photo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold truncate" style={{ color: DARK }}>{userInfo?.name || 'User'}</p>
          <p className="text-sm text-gray-500 truncate">{userInfo?.email || ''}</p>
          {userInfo?.role && (
            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full" style={{ color: TEAL_DARK, background: 'rgba(46,196,182,0.1)' }}>
              {userInfo.role}
            </span>
          )}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} style={{ color: DARK }}>Full Name <span className="text-red-500">*</span></label>
          <input name="fullName" value={form.fullName} onChange={change} className={inputCls} placeholder="Your name" />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className={labelCls} style={{ color: DARK }}>Email</label>
          <input name="email" value={form.email} readOnly className={`${inputCls} text-gray-400 cursor-not-allowed`} />
        </div>
      </div>

      {/* Phone */}
      <div className="sm:max-w-[calc(50%-8px)]">
        <label className={labelCls} style={{ color: DARK }}>Phone Number <span className="text-red-500">*</span></label>
        <input name="phone" value={form.phone} onChange={change} className={inputCls} placeholder="Phone number" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      {/* About */}
      <div>
        <label className={labelCls} style={{ color: DARK }}>About <span className="text-red-500">*</span></label>
        <textarea name="about" value={form.about} onChange={change} rows={4} className={inputCls} placeholder="Tell others about yourself…" />
        {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about}</p>}
      </div>

      {/* Licensed States */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelCls} style={{ color: DARK, marginBottom: 0 }}>Licensed States</label>
          <label className="flex items-center gap-2 text-[13px] text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.licensed_states.length === US_STATES.length}
              onChange={(e) => setForm(p => ({ ...p, licensed_states: e.target.checked ? [...US_STATES] : [] }))}
              className="accent-[#2EC4B6]"
            />
            Select all
          </label>
        </div>
        {form.licensed_states.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {form.licensed_states.map(s => (
              <span key={s} className="flex items-center gap-1 text-white text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: TEAL }}>
                {s}
                <button type="button" onClick={() => toggleState(s)} className="ml-0.5 hover:text-gray-200 leading-none">&times;</button>
              </span>
            ))}
          </div>
        )}
        <div className="border border-gray-200 rounded-xl p-3 max-h-52 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1 bg-gray-50">
          {US_STATES.map(s => (
            <label key={s} className="flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer text-[13px] hover:bg-white transition-colors">
              <input type="checkbox" checked={form.licensed_states.includes(s)} onChange={() => toggleState(s)} className="accent-[#2EC4B6]" />
              {s}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1">{form.licensed_states.length} selected</p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ background: DARK }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}

// ─── Password panel ──────────────────────────────────────────────────────────
function EyeButton({ visible, onClick }) {
  return (
    <button type="button" onClick={onClick} className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {visible
          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          : <><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}
      </svg>
    </button>
  );
}

function PasswordPanel() {
  const { logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const change = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.current.trim()) err.current = 'Current password is required.';
    if (!form.next.trim()) err.next = 'New password is required.';
    if (!form.confirm.trim()) err.confirm = 'Please confirm your new password.';
    if (form.next && form.confirm && form.next !== form.confirm) err.confirm = 'Passwords do not match.';
    setErrors(err);
    if (Object.keys(err).length) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ current_password: form.current, new_password: form.next, new_password_confirmation: form.confirm }),
      });
      const data = await res.json();
      if (res.ok && data.message?.toLowerCase().includes('success')) {
        toast.success(data.message, { position: 'top-right' });
        setForm({ current: '', next: '', confirm: '' });
        setTimeout(() => { logout(); router.push('/signin'); }, 1500);
      } else {
        if (data.errors && typeof data.errors === 'object') {
          const fe = {};
          Object.entries(data.errors).forEach(([k, v]) => { fe[k === 'current_password' ? 'current' : k === 'new_password' ? 'next' : k] = Array.isArray(v) ? v[0] : v; });
          setErrors(fe);
        }
        toast.error(data.message || 'Failed to change password.', { position: 'top-right' });
      }
    } catch {
      toast.error('Failed to change password.', { position: 'top-right' });
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'current', label: 'Current Password' },
    { name: 'next', label: 'New Password' },
    { name: 'confirm', label: 'Confirm New Password' },
  ];

  return (
    <form onSubmit={submit} className="space-y-5 max-w-md">
      {fields.map(f => (
        <div key={f.name}>
          <label className={labelCls} style={{ color: DARK }}>{f.label} <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type={show[f.name] ? 'text' : 'password'}
              name={f.name}
              value={form[f.name]}
              onChange={change}
              className={`${inputCls} pr-11`}
              placeholder="••••••••"
            />
            <EyeButton visible={show[f.name]} onClick={() => setShow(p => ({ ...p, [f.name]: !p[f.name] }))} />
          </div>
          {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
        </div>
      ))}
      <p className="text-xs text-gray-400">For your security, you&apos;ll be signed out after changing your password.</p>
      <button
        type="submit"
        disabled={saving}
        className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        style={{ background: DARK }}
      >
        {saving ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  );
}

// ─── Notifications panel ─────────────────────────────────────────────────────
const NOTIF_OPTIONS = [
  { key: 'newListings', title: 'New listings published', desc: 'Get notified when new businesses or properties are listed.' },
  { key: 'savedSearchMatches', title: 'Saved search matches', desc: 'Alert me when a new listing matches one of my saved searches.' },
  { key: 'priceChanges', title: 'Price changes', desc: 'Notify me when a listing I saved changes its price.' },
  { key: 'forumActivity', title: 'Forum replies', desc: 'Tell me when someone comments or replies on my forum posts.' },
];

function NotificationsPanel() {
  const [prefs, setPrefs] = useState(getNotificationPrefs());

  useEffect(() => {
    const sync = () => setPrefs(getNotificationPrefs());
    sync();
    window.addEventListener(NOTIFICATION_PREFS_EVENT, sync);
    return () => window.removeEventListener(NOTIFICATION_PREFS_EVENT, sync);
  }, []);

  const set = (key, value) => {
    setNotificationPref(key, value);
    setPrefs(p => ({ ...p, [key]: value }));
    toast.success(`${value ? 'Enabled' : 'Disabled'} notifications`, { position: 'top-right', autoClose: 1500 });
  };

  return (
    <div className="space-y-2 max-w-2xl">
      <p className="text-sm text-gray-500 mb-4">Choose which alerts you want to receive in your dashboard bell.</p>
      {NOTIF_OPTIONS.map(o => (
        <div key={o.key} className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold" style={{ color: DARK }}>{o.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{o.desc}</p>
          </div>
          <Toggle checked={prefs[o.key]} onChange={(v) => set(o.key, v)} />
        </div>
      ))}
    </div>
  );
}

// ─── Wrapper with tabs ───────────────────────────────────────────────────────
const DashboardSettings = ({ initialTab = 'profile' }) => {
  const [tab, setTab] = useState(TABS.some(t => t.key === initialTab) ? initialTab : 'profile');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: DARK }}>Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100 px-2 sm:px-4 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                tab === t.key ? 'border-[#2EC4B6]' : 'border-transparent text-gray-500 hover:text-[#40433F]'
              }`}
              style={tab === t.key ? { color: TEAL_DARK } : undefined}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="p-5 sm:p-6">
          {tab === 'profile' && <ProfilePanel />}
          {tab === 'password' && <PasswordPanel />}
          {tab === 'notifications' && <NotificationsPanel />}
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
