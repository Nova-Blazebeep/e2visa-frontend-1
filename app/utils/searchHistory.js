// Search history lives in localStorage (per signed-in user) until a backend exists.
export const SEARCH_HISTORY_EVENT = 'search-history-updated';
const MAX_ENTRIES = 15;

function storageKey() {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userKey = user?.id ?? user?.email;
    return userKey ? `searchHistory:${userKey}` : null;
  } catch {
    return null;
  }
}

export function getSearchHistory() {
  const key = storageKey();
  if (!key) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(key));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

// entry: { type: 'business' | 'real_estate', label, meta, url, resultCount }
// Re-running an identical search just bumps it to the top with a fresh time.
export function recordSearch(entry) {
  const key = storageKey();
  if (!key) return; // not signed in — history is a dashboard feature
  const all = getSearchHistory().filter(e => e.url !== entry.url);
  const next = [{ ...entry, id: `${Date.now()}`, searchedAt: Date.now() }, ...all].slice(0, MAX_ENTRIES);
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(SEARCH_HISTORY_EVENT));
}

export function removeSearch(id) {
  const key = storageKey();
  if (!key) return;
  const next = getSearchHistory().filter(e => e.id !== id);
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new Event(SEARCH_HISTORY_EVENT));
}

export function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
}
