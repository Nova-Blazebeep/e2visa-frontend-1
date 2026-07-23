'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import {
  getNotifications,
  markRead,
  markAllRead,
  NOTIFICATIONS_EVENT,
} from '@/app/utils/notifications';
import { runNotificationChecks } from '@/app/utils/notificationChecks';
import { timeAgo } from '@/app/utils/searchHistory';

const TEAL = '#2EC4B6';
const TEAL_DARK = '#22A99C';
const DARK = '#40433F';

const STYLE = {
  business: { tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK, path: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></> },
  real_estate: { tint: 'bg-emerald-500/10', color: '#059669', path: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
  price: { tint: 'bg-orange-500/10', color: '#ea580c', path: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> },
  forum: { tint: 'bg-violet-500/10', color: '#7c3aed', path: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
  general: { tint: 'bg-[#2EC4B6]/10', color: TEAL_DARK, path: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> },
};

const NotificationBell = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const ref = useRef(null);

  // Load + keep in sync
  useEffect(() => {
    const sync = () => setNotifications(getNotifications());
    sync();
    window.addEventListener(NOTIFICATIONS_EVENT, sync);
    return () => window.removeEventListener(NOTIFICATIONS_EVENT, sync);
  }, [user]);

  // Check for new activity once the user is known (site-wide, not just dashboard)
  useEffect(() => {
    if (user) runNotificationChecks();
  }, [user]);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;

  const unread = notifications.filter(n => !n.read).length;
  const recent = notifications.slice(0, 6);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10 transition-colors focus:outline-none"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#40433F]"
            style={{ background: TEAL }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-xl border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-bold" style={{ color: DARK }}>Notifications</p>
            {unread > 0 && (
              <button
                onClick={() => markAllRead()}
                className="text-[12px] font-semibold hover:underline"
                style={{ color: TEAL_DARK }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {recent.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#2EC4B6]/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEAL_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: DARK }}>You&apos;re all caught up</p>
                <p className="text-xs text-gray-500 mt-1">New listings and matches will show up here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recent.map(n => {
                  const s = STYLE[n.kind] || STYLE.general;
                  return (
                    <Link
                      key={n.id}
                      href={n.url || '#'}
                      onClick={() => { markRead(n.id); setOpen(false); }}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-[#2EC4B6]/5' : ''}`}
                    >
                      <span className={`w-8 h-8 rounded-full ${s.tint} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.path}</svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: DARK }}>{n.title}</p>
                        {n.meta && <p className="text-xs text-gray-500 mt-0.5 truncate">{n.meta}</p>}
                        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: TEAL }}></span>}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link
            href="/dashboard?section=notifications"
            onClick={() => setOpen(false)}
            className="block text-center py-3 text-[13px] font-semibold border-t border-gray-100 hover:bg-gray-50 transition-colors"
            style={{ color: TEAL_DARK }}
          >
            View all in dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
