"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const Footer = () => {
  const pathname = usePathname();
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');

  const isActive = (path) => {
    return pathname === path;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email address.";
    return null;
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const error = validateEmail(subscriberEmail);
    if (error) {
      setSubscribeError(error);
      toast.error(error, { position: 'top-right' });
      return;
    }
    setSubscribeError('');
    setSubscribing(true);
    setSubscribeSuccess(false);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/subscriber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscriberEmail }),
      });
      const data = await res.json();
      if (res.ok && data.message && data.message.toLowerCase().includes('success')) {
        toast.success("Thanks for subscribing!", { position: 'top-right' });
        setSubscriberEmail('');
        setSubscribeSuccess(true);
        setTimeout(() => setSubscribeSuccess(false), 4000);
        setSubscribeError('');
      } else {
        toast.error(data.message || 'Subscription failed.', { position: 'top-right' });
        setSubscribeError(data.message || 'Subscription failed.');
      }
    } catch {
      toast.error('Subscription failed.', { position: 'top-right' });
      setSubscribeError('Subscription failed.');
    }
    setSubscribing(false);
  };

  const usefulLinks = [
    { name: "Cookies Policy", href: "/cookies-policy" },
    { name: "Terms & Conditions", href: "/terms-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Disclaimer", href: "/disclaimer" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Find A Business", href: "/buy-business" },
    { name: "FIND REAL ESTATE", href: "/real-estate" },
    { name: "Find A Professional", href: "/professionals" },
    { name: "Forum", href: "/forum" },
    { name: "Articles", href: "/articles" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer>
      <div className="footer-bar text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between flex-col md:flex-row gap-4 items-center py-4">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="E2Visa Logo"
                width={62}
                height={57}
              />
              <p className="xl:text-2xl text-base font-medium">E2VISA</p>
            </div>

            <div className="space-y-4">
              <h3 className="xl:text-xl text-base font-bold ">Subscribe To Our Newsletter</h3>
              {subscribeSuccess && (
                    <div className="text-green-600 font-semibold mb-2z-10">Thanks for subscribing!</div>
                  )}
              <div className="flex flex-col sm:flex-row gap-3">
                  <form onSubmit={handleSubscribe}>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative">
                 
                  <Image
                    src="/images/footer/email.png"
                    alt="Search"
                    width={24}
                    height={24}
                    className="absolute top-1/2 -translate-y-1/2 left-3"
                  />
                    <input
                      type="email"
                      value={subscriberEmail}
                      onChange={e => setSubscriberEmail(e.target.value)}
                      onFocus={() => setSubscribeError('')}
                      placeholder="Enter your email to get started"
                      className={`rounded-lg  px-6 py-4 pl-12 bg-[#FFFFFF] font-medium text-[#64748B] outline-none text-sm w-[304px] ${subscribeError ? 'border-red-500' : ''}`}
                    />
                    {/* {subscribeError && (
                      <div className="text-red-500 text-xs absolute left-0 w-full mt-1 pl-2 text-left z-20">{subscribeError}</div>
                    )} */}
                    </div>

                    <button type="submit" className="bg-[#2EC4B6] text-left rounded-lg pl-5 cursor-pointer relative text-white py-4 w-full sm:w-[196px] font-bold text-base "
                      disabled={subscribing}
                    >
                      {subscribing ? 'Please wait...' : 'GET STARTED'}
                      <span className="w-[44px] h-[44px] flex items-center justify-center absolute top-1/2 p-4 -translate-y-1/2 right-2 bg-white rounded-lg">
                        <Image
                          src="/images/footer/upArrow.png"
                          alt="E2Visa Logo"
                          width={24}
                          height={24}
                          className=""
                        />
                      </span>
                    </button>
                  </div>
                  </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#40433F] text-white">
        <div className="container mx-auto py-20 px-4">
          <div className="flex flex-wrap  gap-8">
            <div className="space-y-4 flex-1 min-w-[250px] max-w-[300px]">
              <h3 className="text-base font-bold ">Useful Links</h3>
              <ul className="space-y-3">
                {usefulLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-sm font-bold hover:text-gray-300 uppercase transition-colors ${isActive(item.href) ? 'text-[#2EC4B6]' : ''
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 flex-1 min-w-[250px] max-w-[300px]">
              <h3 className="text-base font-bold ">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`text-sm uppercase font-bold hover:text-gray-300 transition-colors ${isActive(item.href) ? 'text-[#2EC4B6]' : ''
                        }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact Info */}
            <div className="space-y-6 flex-1 min-w-[250px] text-sm max-w-[300px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full">
                  <Image
                    src="/images/footer/phone.png"
                    alt="Phone"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="font-medium">941.518.7138</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full">
                  <Image
                    src="/images/footer/emailIcon.png"
                    alt="Email"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="font-medium">info@e2visa.com</p>
              </div>
              <div className="flex items-start gap-3">
                <Link href="https://www.facebook.com/e2visa" target="_blank" rel="noopener noreferrer">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full">
                    <Image
                      src="/images/footer/fb.png"
                      alt="Facebook"
                      width={10}
                      height={10}
                    />
                  </div>
                </Link>
                <Link href="https://x.com/e2_visa" target="_blank" rel="noopener noreferrer">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-white rounded-full">
                    <Image
                      src="/images/footer/X.png"
                      alt="X (Twitter)"
                      width={14}
                      height={14}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </footer>
  );
};

export default Footer;
