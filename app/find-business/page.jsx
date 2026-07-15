'use client';

import { useState } from 'react';
import Image from 'next/image';

const FindBusiness = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Sub Category');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedListingType, setSelectedListingType] = useState('All Listings');

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching with:', {
      searchQuery,
      selectedCategory,
      selectedSubCategory,
      selectedLocation,
      selectedListingType
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/listings/header-bg.jpg"
            alt="Listings Header"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find a Business</h1>
          <div className="flex items-center justify-center text-white">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>Listings</span>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>All Categories</option>
                <option>Business</option>
                <option>Real Estate</option>
                <option>Services</option>
              </select>
            </div>

            {/* Sub Category Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>Sub Category</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            {/* Location Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>All</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
            </div>

            {/* Listing Type Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedListingType}
                onChange={(e) => setSelectedListingType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option>All Listings</option>
                <option>Featured</option>
                <option>New</option>
                <option>Popular</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-12 lg:col-span-2">
              <button
                onClick={handleSearch}
                className="w-full bg-[#0A3161] text-white py-3 px-6 rounded-lg hover:bg-[#102742] transition-colors"
              >
                Search Now
              </button>
            </div>
          </div>
        </div>

        {/* Results Section - To be implemented */}
        <div className="mt-8">
          {/* Add your listings results here */}
        </div>
      </div>
    </div>
  );
};

export default FindBusiness; 