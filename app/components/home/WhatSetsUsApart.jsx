"use client";

import Image from "next/image";
import React from "react";

const WhatSetsUsApart = () => {
  const features = [
    {
      id: "01",
      title: "Agents + Brokers: Take Back Control of Your Leads.",
      description:
        "Ethical marketing, lower fees, and full transparency. When someone reaches out about your listing, the lead is yours—pure and simple.",
    },
    {
      id: "02",
      title: "Empowering Every Buyer.",
      description:
        "Our platform is completely free for buyers. We are the first to bridge the gap, allowing you to connect and transact directly with the agents of your choice—no middlemen, no hidden hurdles.",
    },
    {
      id: "03",
      title: "Your All-In-One Immigration Hub.",
      description:
        "Seamlessly navigate your move. Connect directly with trusted immigration attorneys and consultants, secure your new home, and even purchase a business—all while getting the expert advice you need in one centralized location.",
    },
    {
      id: "04",
      title: "Agent Or Attorney? Boost Your Visibility.",
      description:
        "The more you engage with potential clients in our active forums, the more you stand out. Verified professionals can unlock exclusive badges and unrestricted interaction tools to build trust and attract more business.",
    },
    {
      id: "05",
      title: "Share Your Expertise.",
      description:
        "Become a thought leader on our platform. Submit your articles for a chance to be featured in our newsletter and showcased across our social media channels, putting your insights in front of a global audience.",
    },
    {
      id: "06",
      title: "Authentic, Direct Connections.",
      description:
        "We never sell your data as a lead. The professional you contact is the one you'll work with directly. Unlike other sites that prioritize the highest bidder, we prioritize genuine relationships.",
    },
    {
      id: "07",
      title: "Access a Network of Experts.",
      description:
        "Whether you need a seasoned business broker, a specialized immigration attorney, or a local real estate expert, we put the industry's top professionals right at your fingertips.",
    },
    {
      id: "08",
      title: "Expert Answers, Fast.",
      description:
        "Need clarity? Get live advice from our pros or dive into our community forums to find answers to all your immigration and real estate questions.",
    },
    {
      id: "09",
      title: "Expand Your Legal Practice.",
      description:
        "Reach a dedicated audience of international clients actively seeking residency and citizenship services. Our platform allows you to showcase your legal expertise directly to motivated individuals, helping you secure high-quality leads and grow your firm with ease.",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-center xl:text-4xl text-2xl text-[#40433F] font-bold my-10">What Sets Us Apart</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group border border-gray-200 rounded-lg p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#2EC4B6]/60"
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/setsUsApart/tick.png"
                  alt="Search"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </div>
              <h3 className="text-[#40433F] font-semibold text-sm xl:text-base mb-2 transition-colors duration-300 group-hover:text-[#0A3161]">
                {feature.title}
              </h3>
              <p className="font-normal text-[#40433F] text-sm xl:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatSetsUsApart;
