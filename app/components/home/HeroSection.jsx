"use client";

import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import { useState } from "react";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('business');

  return (
    <section className="relative bgImg flex justify-center items-center min-h-screen py-20 px-4">
      {/* Background with overlay */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div className="relative z-10 text-center mx-auto">
        <h1 className="text-white text-[25px] sm:text-[32px] xl:text-[56px] font-semibold">E2VISA: A COMMUNITY OF RESOURCES</h1>
        <p className="text-xs sm:text-sm xl:text-lg text-white/90 xl:mb-[64px] mb-10 italic lowercase">
          buy a business, find an immigration attorney, buy a home, and more while getting real time advice - all in one place
        </p>

        <div className="flex items-center flex-col justify-center">
          <div className="flex items-center xl:text-xl sm:text-base text-xs xl:mb-20 mb-10 rounded-lg bg-white/20 backdrop-blur-md justify-center w-fit gap-4">
            <button
              onClick={() => setActiveTab('business')}
              className={`xl:px-6 px-3 py-3 rounded-lg text-white font-medium transition-all ${activeTab === 'business'
                ? 'bg-white/10 backdrop-blur-md hover:bg-white/15'
                : ''
                }`}
            >
              Find A Business
            </button>
            <button
              onClick={() => setActiveTab('estate')}
              className={`xl:px-6 px-3 py-3 rounded-lg text-white font-medium transition-all ${activeTab === 'estate'
                ? 'bg-white/10 backdrop-blur-md hover:bg-white/15'
                : ''
                }`}
            >
              Find Real Estate
            </button>
            {/* <button
              onClick={() => setActiveTab('professional')}
              className={`xl:px-6 px-3 py-3 rounded-lg text-white font-medium transition-all ${activeTab === 'professional'
                ? 'bg-white/10 backdrop-blur-md hover:bg-white/15'
                : ''
                }`}
            >
              Find A Professional
            </button> */}
          </div>
          <SearchBar activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
