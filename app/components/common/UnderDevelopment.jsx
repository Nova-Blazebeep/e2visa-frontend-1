import Link from 'next/link';

// Placeholder shown for sections that are feature-complete but not yet
// public-facing — see app/config/featureFlags.js.
export default function UnderDevelopment({ pageName = 'This page', message }) {
  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4 py-20 bg-white">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-[#40433F]/8 flex items-center justify-center mx-auto mb-6">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#40433F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v5l3.5 2" />
          </svg>
        </div>
        <span className="inline-block text-xs font-semibold uppercase tracking-wide text-[#2EC4B6] bg-[#2EC4B6]/10 px-3 py-1 rounded-full mb-4">
          Work in Progress
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#40433F] mb-3">Coming Soon</h1>
        <p className="text-gray-500 text-base mb-8">
          {message || `${pageName} is currently being finalized. Please check back soon.`}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-lg bg-[#40433F] text-white font-semibold text-sm hover:bg-[#363936] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
