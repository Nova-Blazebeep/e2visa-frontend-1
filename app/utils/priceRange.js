// Real estate listings store an exact sale_price or monthly_rent (never both) —
// which field is populated depends on whether property_type is a "[for sale]"
// or "[for rent/lease]" entry. Formats whichever applies as a currency string.
export function formatRealEstatePrice(business) {
  const isRent = (business.property_type || '').toLowerCase().includes('[for rent/lease]');
  const raw = isRent ? business.monthly_rent : business.sale_price;
  const n = parseFloat(raw);
  if (isNaN(n)) return 'Contact for Price';

  const formatted = '$' + Math.round(n).toLocaleString();
  return isRent ? `${formatted} / month` : formatted;
}

// Map stored building_size integer to a human-readable sq ft range label.
export function getSqftLabel(value) {
  const v = parseInt(value, 10);
  if (isNaN(v)) return null;
  if (v === 0)    return 'Under 1,000 sq ft';
  if (v === 1000) return '1,000 – 2,000 sq ft';
  if (v === 2000) return '2,000 – 3,500 sq ft';
  if (v === 3500) return '3,500 – 5,000 sq ft';
  return '5,001+ sq ft';
}
