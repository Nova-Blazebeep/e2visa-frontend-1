'use client';

import { useEffect, useRef } from 'react';
import { formatRealEstatePrice, getSqftLabel } from '@/app/utils/priceRange';

// Short label for marker bubble (e.g. "$450K", "$1.2M", "$1.5K/mo")
function markerPriceLabel(price, isRent) {
  const n = parseFloat(price);
  if (isNaN(n)) return null;
  let label;
  if (n >= 1000000)    label = '$' + (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  else if (n >= 1000)  label = '$' + Math.round(n / 1000) + 'K';
  else                 label = '$' + Math.round(n);
  return isRent ? label + '/mo' : label;
}

export default function RealEstateMap({ listings, hoveredId, onMarkerHover }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef([]);
  const initialViewRef = useRef(null); // stores { bounds } or { center, zoom }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('leaflet').then((Leaflet) => {
      const L = Leaflet.default;

      if (!mapInstanceRef.current && mapRef.current) {
        const map = L.map(mapRef.current, {
          center: [39.5, -98.35],
          zoom: 4,
          scrollWheelZoom: true,
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];

      const valid  = listings.filter(l => l.latitude && l.longitude);
      const bounds = [];

      valid.forEach((listing) => {
        const lat = parseFloat(listing.latitude);
        const lng = parseFloat(listing.longitude);
        if (isNaN(lat) || isNaN(lng)) return;

        const isRent = (listing.property_type || '').toLowerCase().includes('[for rent/lease]');
        const markerLabel = markerPriceLabel(isRent ? listing.monthly_rent : listing.sale_price, isRent);

        /* ── marker bubble ── */
        const markerHtml = markerLabel
          ? `<div id="re-marker-${listing.id}" class="re-marker-inner" style="background:#c0392b;color:#fff;font-size:11px;font-weight:700;
                font-family:Arial,sans-serif;padding:4px 9px;border-radius:14px;
                white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.35);
                border:2px solid #fff;position:relative;display:inline-block;">
              ${markerLabel}
              <span style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
                width:0;height:0;border-left:5px solid transparent;
                border-right:5px solid transparent;border-top:7px solid #c0392b;"></span>
            </div>`
          : `<div id="re-marker-${listing.id}" class="re-marker-inner" style="width:28px;height:28px;border-radius:50%;background:#c0392b;
                border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);
                display:flex;align-items:center;justify-content:center;position:relative;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span style="position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);
                width:0;height:0;border-left:5px solid transparent;
                border-right:5px solid transparent;border-top:7px solid #c0392b;"></span>
            </div>`;

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconAnchor: markerLabel ? [30, 28] : [14, 35],
          popupAnchor: [0, markerLabel ? -32 : -38],
        });

        const marker = L.marker([lat, lng], { icon }).addTo(map);
        marker.on('mouseover', () => onMarkerHover && onMarkerHover(listing.id));
        marker.on('mouseout', () => onMarkerHover && onMarkerHover(null));

        /* ── popup data ── */
        const displayPrice = formatRealEstatePrice(listing);
        const sqftLabel = getSqftLabel(listing.building_size);

        // Meta line: 4 Beds | 3 Baths | Under 1,000 sq ft | House for sale
        const metaParts = [];
        if (listing.rooms)          metaParts.push(`${listing.rooms} Beds`);
        if (listing.baths)          metaParts.push(`${listing.baths} Baths`);
        if (sqftLabel)               metaParts.push(sqftLabel);
        if (listing.property_type)  metaParts.push(listing.property_type);
        const metaLine = metaParts.join(' | ');

        // Full address line
        const addrParts = [
          listing.street_address,
          listing.zip_code,          // city stored in zip_code field
          listing.state?.name,
        ].filter(Boolean);
        const addressLine = addrParts.join(', ');


        // Image
        const imgHtml = listing.business_images?.[0]?.image_path
          ? `<img src="${process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL}/${listing.business_images[0].image_path}"
               style="width:100%;height:140px;object-fit:cover;display:block;" />`
          : `<div style="width:100%;height:100px;background:linear-gradient(135deg,#e8edf5,#c8d4e8);
               display:flex;align-items:center;justify-content:center;">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="#8fa8c4">
                 <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
               </svg>
             </div>`;

        const popup = `
          <div style="width:260px;font-family:Arial,sans-serif;border-radius:10px;
                      overflow:hidden;background:#fff;">
            <div style="position:relative;">
              ${imgHtml}
            </div>
            <div style="padding:12px 14px 14px;">
              <div style="font-size:19px;font-weight:800;
                          color:${displayPrice === 'Contact for Price' ? '#888' : '#1a1a1a'};
                          margin-bottom:5px;letter-spacing:-0.3px;">
                ${displayPrice}
              </div>
              ${metaLine
                ? `<div style="font-size:12px;color:#444;font-weight:500;
                              margin-bottom:6px;line-height:1.5;">
                    ${metaLine}
                  </div>` : ''}
              ${addressLine
                ? `<div style="font-size:12px;color:#555;margin-bottom:10px;line-height:1.4;">
                    ${addressLine}
                  </div>` : ''}
              <a href="/buy-business/${listing.id}"
                 style="display:block;text-align:center;background:#0A3161;color:#fff;
                        padding:9px 0;border-radius:7px;font-size:12px;font-weight:700;
                        text-decoration:none;letter-spacing:0.4px;">
                View Full Listing →
              </a>
            </div>
          </div>`;

        marker.bindPopup(popup, {
          maxWidth: 280,
          minWidth: 260,
          offset: [0, -4],
          className: 're-popup',
        });

        markersRef.current.push({ id: listing.id, marker });
        bounds.push([lat, lng]);
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 14);
        initialViewRef.current = { type: 'center', center: bounds[0], zoom: 14 };
      } else if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
        initialViewRef.current = { type: 'bounds', bounds, options: { padding: [60, 60], maxZoom: 13 } };
      } else {
        initialViewRef.current = { type: 'center', center: [39.5, -98.35], zoom: 4 };
      }
    });
  }, [listings]);

  // Sync highlight state — from either a hovered listing card (hoveredId prop)
  // or a hovered marker itself (mouseover above, which calls onMarkerHover to
  // bubble the id back up to the listing grid).
  useEffect(() => {
    markersRef.current.forEach(({ id, marker }) => {
      const el = document.getElementById(`re-marker-${id}`);
      const isHovered = hoveredId != null && String(id) === String(hoveredId);
      if (el) el.classList.toggle('re-marker-hovered', isHovered);
      marker.setZIndexOffset(isHovered ? 1000 : 0);
    });
  }, [hoveredId, listings]);

  function handleReset() {
    const map = mapInstanceRef.current;
    const view = initialViewRef.current;
    if (!map || !view) return;
    if (view.type === 'bounds') {
      map.fitBounds(view.bounds, view.options);
    } else {
      map.setView(view.center, view.zoom, { animate: true });
    }
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />
      <style>{`
        .re-marker-inner {
          transition: filter 0.15s ease, outline 0.15s ease;
          outline: 0 solid transparent;
        }
        .re-marker-hovered {
          filter: brightness(1.15) drop-shadow(0 0 8px rgba(192,57,43,0.85));
          outline: 3px solid #fff;
          outline-offset: 1px;
        }
        .re-popup .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 10px !important;
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(0,0,0,0.18) !important;
          border: none !important;
        }
        .re-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 260px !important;
        }
        .re-popup .leaflet-popup-tip-container { display: none; }
        .re-popup .leaflet-popup-close-button {
          color: #fff !important;
          background: rgba(0,0,0,0.4) !important;
          border-radius: 50% !important;
          width: 22px !important;
          height: 22px !important;
          font-size: 15px !important;
          line-height: 22px !important;
          text-align: center !important;
          top: 6px !important;
          right: 6px !important;
          z-index: 10;
        }
      `}</style>
      <div style={{ position: 'relative' }}>
        <div ref={mapRef} style={{ height: '520px', width: '100%', borderRadius: '12px', zIndex: 0 }} />
        <button
          onClick={handleReset}
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '12px',
            zIndex: 1000,
            background: '#fff',
            color: '#0A3161',
            border: '2px solid #0A3161',
            borderRadius: '8px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: '700',
            fontFamily: 'Arial, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '0.3px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A3161">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
          Reset Map
        </button>
      </div>
    </>
  );
}
