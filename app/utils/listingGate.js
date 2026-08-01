// Gate for Phase 2 self-service listing management. Deliberately NOT the same
// shape as forum's canPostInForum (app/forum/page.jsx) — Buyers are exempt
// from the forum gate but must NOT be allowed to create/manage listings, so
// only a non-Buyer with an active paid badge passes here.
export function canManageListings(storedUser) {
  if (!storedUser) return false;
  return storedUser.role !== 'Buyer' && storedUser.badge_status === 'active';
}
