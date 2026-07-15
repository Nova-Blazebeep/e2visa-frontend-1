import Image from 'next/image';

// Generic user silhouette shown when no profile image is available.
function FallbackIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="10" cy="10" r="10" fill="#CBD5E1" />
      <path d="M10 10.8333C11.3807 10.8333 12.5 9.71408 12.5 8.33333C12.5 6.95258 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95258 7.5 8.33333C7.5 9.71408 8.61929 10.8333 10 10.8333Z" fill="#64748B" />
      <path d="M5.83325 15.0001C5.83325 13.1591 7.49221 11.6667 9.99992 11.6667C12.5076 11.6667 14.1666 13.1591 14.1666 15.0001V15.8334H5.83325V15.0001Z" fill="#64748B" />
    </svg>
  );
}

// Avatar with an optional small role-badge icon overlaid on the corner —
// used across the forum list, thread, comments and replies.
export default function ForumAvatar({ src, alt, size = 44, badgeSrc, role, linkable = false }) {
  const badgeSize = Math.max(16, Math.round(size * 0.46));

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div
        className={`w-full h-full rounded-full overflow-hidden bg-gray-100 ring-2 ring-white shadow-sm ${
          linkable ? 'transition-all group-hover:ring-[#2EC4B6]' : ''
        }`}
      >
        {src ? (
          <Image src={src} alt={alt || 'User'} width={size} height={size} className="w-full h-full object-cover" />
        ) : (
          <FallbackIcon />
        )}
      </div>
      {badgeSrc && (
        <div
          className="absolute -bottom-1 -right-1 rounded-full ring-2 ring-white overflow-hidden bg-white"
          style={{ width: badgeSize, height: badgeSize }}
          title={role || ''}
        >
          <Image src={badgeSrc} alt={role || 'Badge'} width={badgeSize} height={badgeSize} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}
