// The signed-in user's profile (name, role, image, etc.) is cached in
// localStorage under 'userDetail' and read independently by several
// components (ProfileSidebar, ProfileDropdown, ...). Whenever that data
// changes, use this instead of writing to localStorage directly — it merges
// the change in and fires an event so every mounted reader refreshes
// immediately, instead of only picking up the change on next page load.
export const USER_DETAIL_UPDATED_EVENT = 'userDetailUpdated';

export function updateStoredUserDetail(partial) {
  if (typeof window === 'undefined') return null;
  try {
    const stored = JSON.parse(localStorage.getItem('userDetail') || '{}');
    const merged = {
      ...stored,
      ...partial,
      user_information: {
        ...(stored.user_information || {}),
        ...(partial.user_information || {}),
      },
    };
    localStorage.setItem('userDetail', JSON.stringify(merged));
    window.dispatchEvent(new Event(USER_DETAIL_UPDATED_EVENT));
    return merged;
  } catch (e) {
    console.error('Error updating stored user detail:', e);
    return null;
  }
}
