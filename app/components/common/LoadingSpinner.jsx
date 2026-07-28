'use client';

import Image from 'next/image';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Dual-ring spinner around a badge-mounted logo */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#2EC4B6]/15"></div>
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#2EC4B6] border-r-[#2EC4B6] animate-spin"></div>
          <div className="absolute inset-[6px] rounded-full border-2 border-transparent border-b-[#0A3161] border-l-[#0A3161] loader-spin-reverse"></div>
          <div className="absolute inset-[10px] rounded-full bg-[#40433F] shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <Image src="/images/logo.png" alt="E2Visa" width={30} height={27} className="opacity-95" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .loader-spin-reverse {
          animation: spin-reverse 1.3s linear infinite;
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
