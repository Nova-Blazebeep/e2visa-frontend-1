'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';


const API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/roles/list';
const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

const SignUpOptions = () => {
  const router = useRouter();
  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch roles');
        const data = await res.json();
        if (data.result && Array.isArray(data.result)) {
          setUserTypes(data.result);
        } else {
          setUserTypes([]);
        }
      } catch (err) {
        if (err.message.includes('Failed to fetch')) {
          setError('CORS error: Unable to fetch roles from the server.');
        } else {
          setError('Failed to load user types.');
        }
        setUserTypes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleUserTypeSelect = (userTypeId, userTypeName) => {
    router.push(`/signup?type=${encodeURIComponent(userTypeName)}&typeId=${userTypeId}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-[url('/images/auth/signin/signinImg.png')] bg-cover bg-center">
      <div className="signin-bg rounded-2xl shadow-lg px-8 py-12 w-full max-w-[1200px]">
        <h1 className="text-2xl lg:text-3xl font-bold text-center mb-12 text-[#424242]">
          Select User Type
        </h1>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleUserTypeSelect(type.id, type.title)}
              className="flex flex-col items-center justify-center px-6 py-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 "
            >
              <div className="w-12 h-12 mb-4">
                <Image
                  src="/images/auth/signin/user2.png"
                  alt={type.title}
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-[#1E1E1E] text-center font-medium text-xs lg:text-sm">
                {type.title}
              </span>
            </button>
          ))}
        </div> */}


        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleUserTypeSelect(type.id, type.name)}
                className="flex flex-col items-center justify-center px-6 py-10 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 "
              >
                <div className="w-14 h-14 mb-4 rounded-full overflow-hidden flex p-2 items-center justify-center bg-gray-100">
                  <Image
                    className="rounded-full"
                    src={
                      type.badge && type.badge.icon && BACKEND_STORAGE_URL
                        ? `${BACKEND_STORAGE_URL}/${type.badge.icon}`
                        : "/images/auth/signin/user2.png"
                    }
                    alt={type.name}
                    width={48}
                    height={48}
                  />
                </div>
                <span className="text-[#1E1E1E] text-center font-medium text-xs lg:text-sm">
                  {type.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpOptions; 