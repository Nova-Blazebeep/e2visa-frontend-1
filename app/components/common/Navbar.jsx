'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center">
            {true ? (
              <ProfileDropdown user={user} />
            ) : (
              <Link
                href="/signin"
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#2EC4B6] hover:bg-[#25a093] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2EC4B6]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 