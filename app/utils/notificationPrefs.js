// Per-user notification preferences (which alert types are enabled).
export const NOTIFICATION_PREFS_EVENT = 'notification-prefs-updated';

export const DEFAULT_PREFS = {
  newListings: true,
  savedSearchMatches: true,
  priceChanges: true,
  forumActivity: true,
};

function prefsKey() {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user?.id ?? user?.email;
    return id ? `notificationPrefs:${id}` : null;
  } catch {
    return null;
  }
}

export function getNotificationPrefs() {
  const key = prefsKey();
  if (!key) return { ...DEFAULT_PREFS };
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    return { ...DEFAULT_PREFS, ...(stored || {}) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function setNotificationPref(name, value) {
  const key = prefsKey();
  if (!key) return;
  const next = { ...getNotificationPrefs(), [name]: value };
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(NOTIFICATION_PREFS_EVENT));
}
