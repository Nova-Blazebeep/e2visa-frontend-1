// Temporary switches for hiding feature-complete sections during client demos.
// The underlying page/functionality is untouched — set the flag to false (or
// delete it and its usage) to go live with no other changes needed.

// Forum is fully built and functional, but hidden behind a "Coming Soon"
// placeholder until the client is ready to show it publicly.
export const FORUM_UNDER_DEVELOPMENT = false;

// Dashboard overview (Dashboard, My Saved Listings, My Searches, Notifications
// sidebar items + the stat cards / Recommended Listings / Recent Searches
// panels), the global nav's notification bell, and the Settings ›
// Notifications tab are all fully built, but the client doesn't want them
// live yet. Only Settings stays reachable in the sidebar until this is
// flipped back on.
export const DASHBOARD_OVERVIEW_ENABLED = false;

// Dashboard top-bar search (businesses/real estate/professionals/articles)
// is fully built, but hidden for now alongside the overview. The trailing
// profile-icon button next to it is also tied to this flag, since it's
// redundant once the sidebar only shows Settings.
export const DASHBOARD_SEARCH_ENABLED = false;

// The heart "save listing" icon (business listings, real estate listings,
// and the dashboard's Recommended cards) is fully built, but hidden for
// now. Gated centrally in SaveListingButton.jsx, so every listing card
// across the site picks this up automatically.
export const SAVE_LISTING_ENABLED = false;
