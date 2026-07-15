"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";

const FeaturedSection = () => {
  return (
    <section className="py-20 min-h-[255px] px-4 bg-white">
      <div className="container relative mx-auto">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Left Feature */}
            <div className="absolute left-0 top-[57%] -translate-y-1/2 -translate-x-1/2 z-20 text-white text-[22px] bg-[#2EC4B6] font-normal w-[314px] py-2 flex justify-center items-center rounded-full">
              Buy Your Own
              <br />
              US Business
            </div>

            {/* Right Feature */}
            <div className="absolute right-0 top-3/4 -translate-y-1/2 translate-x-1/2 z-20 text-white text-[22px] bg-[#2EC4B6] font-normal text-center w-[314px] py-2 flex justify-center items-center rounded-full">
              Find a
              <br />
              Professional
            </div>

            <Image
              src="/images/FeaturedSection/Featured.png"
              alt="E2Visa Logo"
              width={1036}
              height={698}
              className="cursor-pointer featured-border rounded"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
