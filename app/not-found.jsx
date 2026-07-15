'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#40433F] px-4">
      <div className="absolute inset-0 bg-[url('/images/HeroSection/bgImg.png')] bg-cover bg-center opacity-20"></div>
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <div className="mb-8">
          <Image
            src="/images/logo.png"
            alt="E2Visa Logo"
            width={120}
            height={110}
            className="mx-auto"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Coming Soon!</h1>
        <p className="text-lg md:text-xl text-white/90 mb-12">
          We're currently developing this page to bring you an amazing experience. Stay tuned for updates!
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-block bg-[#2EC4B6] text-white px-8 py-4 rounded-lg hover:bg-[#25a093] transition-colors font-medium text-lg"
          >
            Return Home
          </Link>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-[#40433F] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
} 