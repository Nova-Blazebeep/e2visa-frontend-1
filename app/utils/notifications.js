// Per-user notification store in localStorage until a backend exists.
export const NOTIFICATIONS_EVENT = 'notifications-updated';
const MAX_ENTRIES = 30;

function userKey() {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id ?? user?.email ?? null;
  } catch {
    return null;
  }
}

function storageKey() {
  const u = userKey();
  return u ? `notifications:${u}` : null;
}

function metaKey() {
  const u = userKey();
  return u ? `notificationsMeta:${u}` : null;
}

export function getNotifications() {
  const key = storageKey();
  if (!key) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length;
}

function persist(list) {
  const key = storageKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(list.slice(0, MAX_ENTRIES)));
  window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
}

// `key` makes a notification idempotent — the same event never appears twice.
export function addNotification({ key: dedupeKey, title, meta, url, kind = 'general' }) {
  const storeKey = storageKey();
  if (!storeKey) return;
  const all = getNotifications();
  if (dedupeKey && all.some(n => n.key === dedupeKey)) return;
  persist([
    { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, key: dedupeKey, title, meta, url, kind, createdAt: Date.now(), read: false },
    ...all,
  ]);
}

export function markRead(id) {
  persist(getNotifications().map(n => (n.id === id ? { ...n, read: true } : n)));
}

export function markAllRead() {
  persist(getNotifications().map(n => ({ ...n, read: true })));
}

export function removeNotification(id) {
  persist(getNotifications().filter(n => n.id !== id));
}

// Bookkeeping for the change detector (which listing ids we've already seen).
export function getNotificationMeta() {
  const key = metaKey();
  if (!key) return {};
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

export function setNotificationMeta(meta) {
  const key = metaKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(meta));
}
