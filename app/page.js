import HeroSection from "./components/home/HeroSection";
import FeaturedSection from "./components/home/FeaturedSection";
import WhatSetsUsApart from "./components/home/WhatSetsUsApart";
import ListingsTabs from "./components/home/Listing";
import FeaturedProfessionals from "./components/home/FeaturedProfessionals";
import NewListing from "./components/home/NewListing";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <WhatSetsUsApart />
      <ListingsTabs />
      {/* <NewListing /> */}
      <FeaturedProfessionals /> 
    </div>
  );
}
