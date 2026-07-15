"use client";

import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";

// Custom Arrow Components
function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + " custom-slick-arrow custom-slick-next"}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2EC4B6",
        borderRadius: "50%",
        width: 44,
        height: 44,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        border: "none",
        zIndex: 20,
        right: -30,
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      onClick={onClick}
      aria-label="Next"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + " custom-slick-arrow custom-slick-prev"}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2EC4B6",
        borderRadius: "50%",
        width: 44,
        height: 44,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        border: "none",
        zIndex: 20,
        left: -30,
        transition: "background 0.2s, box-shadow 0.2s",
      }}
      onClick={onClick}
      aria-label="Previous"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
  );
}

export const newListings = [
  {
    id: 5,
    title: "Test Shop Main Street",
    image: "/images/listing/img1.png",
    status: "New Listing",
    verified: true,
    rating: 5,
    location: 'Silicon Valley',
    askingPrice: 750000,
    grossRevenue: 1500000,
    description: `Michael Finley stands out as a business broker for his comprehensive understanding of the entrepreneurial landscape, enhanced by his academic achievements and practical experience. His professionalism, coupled with a genuine commitment to client success, makes him an invaluable partner for those looking to buy or sell a business.

    Michael Finley is a proud Marine Corps and Operation Iraqi Freedom (OIF) veteran with a robust foundation in leadership and strategic planning. Although originally from Chicago, Michael has found his paradise in Southwest Florida, where he enjoys life with his wife and two young children. Michael's professional path is underpinned by an impressive array of entrepreneurial ventures, signaling not just a career but a calling to innovate, develop, and lead successful businesses.
    
    Michael's entrepreneurial journey is characterized by the successful founding and development of several businesses. This hands-on experience, combined with an MBA, equips him with a profound understanding of business strategy, financial acumen, and operational excellence. His deep-rooted passion for entrepreneurship is matched by his commitment to lifelong learning and professional development.`,
       
    EBITDA: 300000,
    cashFlow: 350000,
    inventory: {
      included: true,
      value: 5000
    },
    rent: 5200,
    established: 2020,
    employees: {
      fullTime: 8,
      partTime: 2,
      contractors: '3',
      ownerHours: 45
    },
    details: {
      homeBased: false,
      franchise: false,
      relocatable: true,
      lenderPrequalified: true,
      sbaPrequalified: true
    },
    reasonForSale: 'Strategic exit to pursue larger venture opportunities.',
    adjustedEBITDA: 300000,
  },
  {
    id: 6,
    title: "Test Shop Main Street",
    image: "/images/listing/img2.png",
    status: "New Listing",
    verified: true,
    rating: 5,
    location: 'Miami',
    askingPrice: 385000,
    grossRevenue: 720000,
    description: `Michael Finley stands out as a business broker for his comprehensive understanding of the entrepreneurial landscape, enhanced by his academic achievements and practical experience. His professionalism, coupled with a genuine commitment to client success, makes him an invaluable partner for those looking to buy or sell a business.

    Michael Finley is a proud Marine Corps and Operation Iraqi Freedom (OIF) veteran with a robust foundation in leadership and strategic planning. Although originally from Chicago, Michael has found his paradise in Southwest Florida, where he enjoys life with his wife and two young children. Michael's professional path is underpinned by an impressive array of entrepreneurial ventures, signaling not just a career but a calling to innovate, develop, and lead successful businesses.
    
    Michael's entrepreneurial journey is characterized by the successful founding and development of several businesses. This hands-on experience, combined with an MBA, equips him with a profound understanding of business strategy, financial acumen, and operational excellence. His deep-rooted passion for entrepreneurship is matched by his commitment to lifelong learning and professional development.`,
       
    EBITDA: 180000,
    cashFlow: 200000,
    inventory: {
      included: true,
      value: 150000
    },
    rent: 4800,
    established: 2019,
    employees: {
      fullTime: 3,
      partTime: 6,
      contractors: '2',
      ownerHours: 35
    },
    details: {
      homeBased: false,
      franchise: false,
      relocatable: false,
      lenderPrequalified: true,
      sbaPrequalified: false
    },
    reasonForSale: 'Owner expanding to new market and needs capital.',
    adjustedEBITDA: 180000,
  },
  {
    id: 7,
    title: "Test Shop Main Street",
    image: "/images/listing/img3.png",
    status: "New Listing",
    verified: true,
    rating: 5,
    location: 'Los Angeles',
    askingPrice: 290000,
    grossRevenue: 850000,
    description: `Michael Finley stands out as a business broker for his comprehensive understanding of the entrepreneurial landscape, enhanced by his academic achievements and practical experience. His professionalism, coupled with a genuine commitment to client success, makes him an invaluable partner for those looking to buy or sell a business.

    Michael Finley is a proud Marine Corps and Operation Iraqi Freedom (OIF) veteran with a robust foundation in leadership and strategic planning. Although originally from Chicago, Michael has found his paradise in Southwest Florida, where he enjoys life with his wife and two young children. Michael's professional path is underpinned by an impressive array of entrepreneurial ventures, signaling not just a career but a calling to innovate, develop, and lead successful businesses.
    
    Michael's entrepreneurial journey is characterized by the successful founding and development of several businesses. This hands-on experience, combined with an MBA, equips him with a profound understanding of business strategy, financial acumen, and operational excellence. His deep-rooted passion for entrepreneurship is matched by his commitment to lifelong learning and professional development.`,
       
    EBITDA: 160000,
    cashFlow: 180000,
    inventory: {
      included: true,
      value: 75000
    },
    rent: 2200,
    established: 2021,
    employees: {
      fullTime: 2,
      partTime: 3,
      contractors: '5',
      ownerHours: 40
    },
    details: {
      homeBased: true,
      franchise: false,
      relocatable: true,
      lenderPrequalified: false,
      sbaPrequalified: false
    },
    reasonForSale: 'Owner pursuing new business opportunities in different industry.',
    adjustedEBITDA: 160000,
  },
  {
    id: 8,
    title: "Test Shop Main Street",
    image: "/images/listing/img4.png",
    status: "New Listing",
    verified: false,
    rating: 5,
    location: 'Austin',
    askingPrice: 175000,
    grossRevenue: 380000,
    description: `Michael Finley stands out as a business broker for his comprehensive understanding of the entrepreneurial landscape, enhanced by his academic achievements and practical experience. His professionalism, coupled with a genuine commitment to client success, makes him an invaluable partner for those looking to buy or sell a business.

    Michael Finley is a proud Marine Corps and Operation Iraqi Freedom (OIF) veteran with a robust foundation in leadership and strategic planning. Although originally from Chicago, Michael has found his paradise in Southwest Florida, where he enjoys life with his wife and two young children. Michael's professional path is underpinned by an impressive array of entrepreneurial ventures, signaling not just a career but a calling to innovate, develop, and lead successful businesses.
    
    Michael's entrepreneurial journey is characterized by the successful founding and development of several businesses. This hands-on experience, combined with an MBA, equips him with a profound understanding of business strategy, financial acumen, and operational excellence. His deep-rooted passion for entrepreneurship is matched by his commitment to lifelong learning and professional development.`,
       
    EBITDA: 95000,
    cashFlow: 110000,
    inventory: {
      included: true,
      value: 15000
    },
    rent: 800,
    established: 2022,
    employees: {
      fullTime: 2,
      partTime: 2,
      contractors: 'N/A',
      ownerHours: 50
    },
    details: {
      homeBased: false,
      franchise: false,
      relocatable: true,
      lenderPrequalified: false,
      sbaPrequalified: false
    },
    reasonForSale: 'Owner moving to restaurant-based business model.',
    adjustedEBITDA: 95000,
  },
];

export default function NewListingsTabs() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />, // Custom next arrow
    prevArrow: <PrevArrow />, // Custom prev arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        }
      }
    ]
  };

  return (
    <div className="bg-white py-[92px]">
      <div className="container mx-auto px-4">
        <h1 className="text-center xl:text-3xl text-2xl text-[#40433F] font-bold mb-20">New Listings</h1>

        <div className="listing-slider relative">
          <style jsx>{`
            :global(.slick-prev),
            :global(.slick-next) {
              z-index: 10;
              width: 40px;
              height: 40px;
            }
            :global(.slick-prev) {
              left: -20px;
            }
            :global(.slick-next) {
              right: -20px;
            }
            :global(.slick-prev:before),
            :global(.slick-next:before) {
              display: none !important;
            }
            :global(.custom-slick-arrow) {
              opacity: 1 !important;
              background: #2EC4B6 !important;
              color: #fff !important;
              border: none !important;
              box-shadow: 0 2px 8px rgba(0,0,0,0.12);
              transition: background 0.2s, box-shadow 0.2s;
            }
            :global(.custom-slick-arrow:hover) {
              background: #0A3161 !important;
              box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            }
            :global(.custom-slick-next) {
              right: -30px !important;
            }
            :global(.custom-slick-prev) {
              left: -30px !important;
            }
            @media (max-width: 640px) {
              :global(.slick-prev) {
                left: 0;
              }
              :global(.slick-next) {
                right: 0;
              }
              :global(.custom-slick-next) {
                right: 0 !important;
              }
              :global(.custom-slick-prev) {
                left: 0 !important;
              }
            }
          `}</style>
          <Slider {...settings}>
            {newListings.map((listing) => (
              <div key={listing.id} className="bg-[#1B263B1A] border border-[#1B263B] !rounded-xl">
                <Link href={`/buy-business/${listing.id}`}>
                  <div className="relative w-full pt-[14px] pb-[19px] px-[18px] cursor-pointer transition-transform hover:scale-[1.02]">
                    {listing.verified && (
                      <div className="absolute top-7 right-8 bg-[#2EC4B6] z-30 text-white text-xs lg:text-sm px-2 py-1 rounded-full">
                        Verified
                      </div>
                    )}
                    <div className="relative w-full h-[197px]">
                      <Image
                        fill
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-[15px]">
                      <h2 className="text-xs lg:text-sm leading-6 font-semibold mb-1">
                        {listing.title}
                      </h2>
                      <div className="flex items-center justify-between">
                          {/* <p className="text-xs lg:text-base mb-2">{listing.status}</p> */}
                        <p className="text-xs lg:text-sm text-[#40433F]">Leased</p>
                          {/* <p className="text-xs lg:text-base">{listing.location}</p> */}
                        <div className="flex gap-1">
                          {[...Array(listing.rating)].map((_, index) => (
                            <div className="w-[12.84px] h-[12.27px] relative" key={index}>
                              <Image
                                src="/images/listing/star.png"
                                fill
                                alt="rating star"
                                className="object-contain"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}
