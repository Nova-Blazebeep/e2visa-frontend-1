'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import debounce from 'lodash.debounce';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

const BlogCard = ({ blog }) => (
  <Link href={`/articles/${blog.title}`} className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative w-full h-48 bg-gray-100">
      <img
        src={blog.banner || "/images/blog/placeholder.png"}
        alt={blog.title}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      {blog.is_pinned == 1 && (
        <span className="absolute top-2 left-2 bg-[#40433F] text-white text-xs font-semibold px-2 py-1 rounded">
          Pinned
        </span>
      )}
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{blog.title.length > 45 ? blog.title.slice(0, 45) + '...' : blog.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 100) + (blog.content.length > 100 ? '...' : '') : ''}</p>
      <p className="text-xs text-gray-500">{formatDate(blog.active_date)}</p>
      {blog.user && (
        <p className="text-xs text-gray-400 mt-2">By {blog.user.name}</p>
      )}
    </div>
  </Link>
);

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/blogs-list');
        const data = await res.json();
        if (res.ok && data.result) {
          setBlogs(data.result);
        } else {
          setError(data.message || 'Failed to fetch blogs');
        }
      } catch (err) {
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearching(false);
      setSearchResults([]);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      setSearching(false);
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data.result) {
        setSearchResults(data.result);
        setSearching(true);
        setCurrentPage(1);
      } else {
        setError(data.message || 'Failed to fetch search results');
        setSearchResults([]);
        setSearching(true);
      }
    } catch (err) {
      setError('Failed to fetch search results');
      setSearchResults([]);
      setSearching(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(debounce((query) => {
    handleSearch(query);
  }, 400)).current;

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const dataToShow = searching ? searchResults : blogs;
  const totalPages = Math.ceil(dataToShow.length / blogsPerPage);
  const paginatedBlogs = dataToShow.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] ">
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/images/articles-banner.jpg"
            alt="Articles"
            fill
            className="object-cover"
          />
        </div>
        {/* Black transparent overlay */}
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="relative z-[10] container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Articles</h1>
          <div className="flex items-center text-white text-lg">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <span>Articles</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8">

        {/* Search Bar */}
        {blogs.length > 0 && (
        <div className="flex items-center gap-4 justify-center mt-10">
          <div className="flex items-center justify-center flex-wrap gap-4">
            <div className="relative min-w-[300px] lg:min-w-[556px]">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4  py-3 lg:py-4 bg-[#1B263B14] rounded-lg focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            {/* <div className="flex items-center border border-[#40433F] rounded-lg justify-center lg:w-16 w-12 lg:h-16 h-12">
              <Image src="/images/findABusiness/Vector.png" alt="filter" width={20} height={20} />
            </div> */}
            <button
              className="bg-[#40433F] text-white px-6 py-3 lg:py-4 rounded-lg hover:bg-[#363936]"
              onClick={handleSearch}
            >
              Search Now
            </button>
          </div>
        </div>
        )}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500 mb-8">{error}</div>
        ) : dataToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center pb-16">
            <h2 className="text-3xl font-bold text-[#0A3161] mb-2">Oops!</h2>
            <p className="text-lg text-gray-700">No Blog Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 mt-12">
         
            {paginatedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
        {/* {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 my-6">
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )} */}
        {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 my-6">
    {/* Previous Button */}
    <button
      className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm disabled:opacity-50"
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Pagination Logic */}
    {totalPages <= 3 ? (
      // Show all pages
      Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === i + 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {i + 1}
        </button>
      ))
    ) : (
      <>
        {/* Always show first page */}
        <button
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          1
        </button>

        {/* Show second page if current is 2 */}
        {currentPage === 2 && (
          <button
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === 2 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            2
          </button>
        )}

        {/* Ellipsis before middle if needed */}
        {currentPage > 3 && <span className="text-sm">...</span>}

        {/* Show current page if not first or last */}
        {currentPage > 2 && currentPage < totalPages - 1 && (
          <button
            onClick={() => setCurrentPage(currentPage)}
            className="px-3 py-1 rounded text-sm bg-[#40433F] text-white"
          >
            {currentPage}
          </button>
        )}

        {/* Ellipsis after middle if needed */}
        {currentPage < totalPages - 2 && <span className="text-sm">...</span>}

        {/* Show second last page if current is totalPages - 1 */}
        {currentPage === totalPages - 1 && (
          <button
            onClick={() => setCurrentPage(totalPages - 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === totalPages - 1 ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {totalPages - 1}
          </button>
        )}

        {/* Always show last page */}
        <button
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === totalPages ? 'bg-[#40433F] text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {totalPages}
        </button>
      </>
    )}

    {/* Next Button */}
    <button
      className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-sm disabled:opacity-50"
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)}

      </div>
    </div>
  );
} 