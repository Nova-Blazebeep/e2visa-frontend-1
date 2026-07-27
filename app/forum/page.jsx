'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ForumAvatar from '../components/forum/ForumAvatar';
import RolePill from '../components/forum/RolePill';
import { timeAgo } from '../utils/timeAgo';
import { toast } from 'react-toastify';
import UnderDevelopment from '../components/common/UnderDevelopment';
import { FORUM_UNDER_DEVELOPMENT } from '../config/featureFlags';

// Helper to get token (adjust as needed for your auth setup)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
      <div className="w-14 h-14 rounded-full bg-[#0A3161]/8 flex items-center justify-center mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-[#0A3161] mb-1">{title}</h2>
      <p className="text-gray-500 text-sm max-w-sm">{subtitle}</p>
    </div>
  );
}

function ForumListItem({ forum, backendUrl }) {
  const avatarSrc = forum.created_by?.image ? `${backendUrl}/${forum.created_by.image}` : null;
  const badgeSrc = forum.creator_badge_icon ? `${backendUrl}/${forum.creator_badge_icon}` : null;

  return (
    <Link href={`/forum/${forum.id}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#2EC4B6]/50 transition-all p-6 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <ForumAvatar src={avatarSrc} alt={forum.created_by?.name} badgeSrc={badgeSrc} role={forum.created_by?.role} size={44} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#0A3161] text-sm">{forum.created_by?.name}</span>
              <RolePill role={forum.created_by?.role} />
            </div>
            <span className="text-xs text-gray-400">{timeAgo(forum.created_at)}</span>
          </div>
        </div>

        <h3 className="text-[#1a1a1a] text-base lg:text-lg font-bold mb-1.5 group-hover:text-[#0A3161] transition-colors">
          {forum.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{forum.content}</p>

        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          <span>{forum.comment_count} {forum.comment_count === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>
    </Link>
  );
}

function ForumContent() {
  const [forumData, setForumData] = useState(null); // Store entire API response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);
  const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;
  const searchTimeout = useRef(null);

  useEffect(() => {
    setToken(getToken());
  }, []);

  useEffect(() => {
    fetchForums(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setErrorSearch(null);
      setLoadingSearch(false);
      return;
    }
    setLoadingSearch(true);
    setErrorSearch(null);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/search-forums?query=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (res.ok && data.result) {
          setSearchResults(data.result);
        } else {
          setSearchResults([]);
          setErrorSearch("No results found.");
        }
      } catch (err) {
        setErrorSearch("Something went wrong.");
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  const fetchForums = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
      const url = `${baseUrl}/api/forum/list?page=${page}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setForumData(data.result);
      } else {
        setError(data.message || 'Failed to fetch forums.');
      }
    } catch (err) {
      setError('Failed to fetch forums.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoadingSearch(true);
    setErrorSearch(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/search-forums?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (res.ok && data.result) {
        setSearchResults(data.result);
      } else {
        setSearchResults([]);
        setErrorSearch("No results found.");
      }
    } catch (err) {
      setErrorSearch("Something went wrong.");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handlePost = async () => {
    let hasError = false;
    if (!title.trim()) {
      setTitleError('Title is required');
      hasError = true;
    }
    if (!content.trim()) {
      setContentError('Content is required');
      hasError = true;
    }
    if (hasError) return;
    setPosting(true);
    setPostError(null);
    try {
      const token = getToken();
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/forum/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setTitle('');
        setContent('');
        fetchForums(currentPage);
        toast.success('Forum created successfully!', { position: 'top-right' });
      } else {
        setPostError(data.message || 'Failed to create forum.');
        toast.error(data.message || 'Failed to create forum.', { position: 'top-right' });
      }
    } catch (err) {
      setPostError('Failed to create forum.');
      toast.error('Failed to create forum.', { position: 'top-right' });
    } finally {
      setPosting(false);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= (forumData?.last_page || 1)) {
      setCurrentPage(page);
      window.scrollTo({ top: 500 });
    }
  };

  const renderPaginationButton = (page, label, isActive = false, disabled = false) => (
    <button
      key={label}
      onClick={() => !disabled && handlePageChange(page)}
      disabled={disabled}
      className={`min-w-[36px] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
          : isActive
            ? 'bg-[#0A3161] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  const renderPagination = () => {
    if (!forumData || forumData.last_page <= 1) return null;

    const { current_page, last_page } = forumData;
    const pages = [];

    pages.push(renderPaginationButton(current_page - 1, 'Previous', false, current_page === 1));
    pages.push(renderPaginationButton(1, '1', current_page === 1));

    if (current_page > 3) {
      pages.push(<span key="ellipsis1" className="text-sm px-1 text-gray-400">...</span>);
    }
    if (current_page !== 1 && current_page !== last_page) {
      pages.push(renderPaginationButton(current_page, current_page.toString(), true));
    }
    if (current_page < last_page - 2) {
      pages.push(<span key="ellipsis2" className="text-sm px-1 text-gray-400">...</span>);
    }
    if (last_page !== 1) {
      pages.push(renderPaginationButton(last_page, last_page.toString(), current_page === last_page));
    }
    pages.push(renderPaginationButton(current_page + 1, 'Next', false, current_page === last_page));

    return <div className="flex justify-center items-center gap-1.5 mt-8">{pages}</div>;
  };

  const hasAnyForums = (forumData?.data?.length || 0) > 0;

  return (
    <>
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px]">
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/images/forum-qa-bg.jpg"
            alt="Forum & Articles"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="relative z-[10] container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Forum</h1>
          <div className="flex items-center text-white text-lg">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <span>Forum</span>
          </div>
        </div>
      </div>

      {/* Forum Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Search Bar */}
        {hasAnyForums && (
          <div className="flex items-center justify-center flex-wrap gap-3 mt-2 mb-8">
            <div className="relative w-full sm:w-auto sm:min-w-[420px] flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none transition-colors"
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <div className="absolute inset-y-0 left-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              className="bg-[#40433F] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#363936] transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        )}

        {/* Composer / Sign-in CTA */}
        {token ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0A3161]/8 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    <line x1="12" y1="7" x2="12" y2="13" />
                    <line x1="9" y1="10" x2="15" y2="10" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[#0A3161]">Start a Discussion</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1.5 flex items-center justify-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="flex-shrink-0">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                Ask a question or share your experience — the community and our experts are here to help.
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="title-input" className="block text-sm font-semibold text-[#40433F] mb-1.5">Title</label>
              <input
                id="title-input"
                type="text"
                placeholder="What's your topic?"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none transition-colors"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                }}
                maxLength={100}
              />
              {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
            </div>

            <div className="mb-1">
              <label htmlFor="question-input" className="block text-sm font-semibold text-[#40433F] mb-1.5">What's your question?</label>
              <textarea
                id="question-input"
                placeholder="Share the details of your question..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none resize-none transition-colors"
                value={content}
                onChange={e => {
                  if (e.target.value.length <= 500) setContent(e.target.value);
                  if (contentError) setContentError('');
                }}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-red-500 text-xs">{contentError}</span>
                <span className="text-xs" style={{ color: content.length >= 500 ? '#e53e3e' : '#9CA3AF' }}>
                  {content.length}/500
                </span>
              </div>
            </div>

            {postError && <p className="text-red-500 text-sm mt-2">{postError}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
                onClick={() => { setTitle(''); setContent(''); setPostError(null); setTitleError(''); setContentError(''); }}
                disabled={posting}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 rounded-lg bg-[#40433F] text-white text-sm font-semibold hover:bg-[#363936] transition-colors disabled:opacity-50"
                onClick={handlePost}
                disabled={posting}
              >
                {posting ? 'Posting…' : 'Post Question'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#40433F] rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-white">Join the conversation</p>
                <p className="text-sm text-white/80">Sign in to ask a question, comment, or reply to others.</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link href="/signin" className="px-5 py-2 rounded-lg bg-white text-[#40433F] text-sm font-semibold hover:bg-gray-100 transition-colors">
                Sign In
              </Link>
              <Link href="/signup-options" className="px-5 py-2 rounded-lg border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {loading && <LoadingSpinner />}
        {error && <div className="text-center text-red-500 py-8">{error}</div>}

        {searchQuery.trim() ? (
          <>
            {loadingSearch && <LoadingSpinner />}
            {errorSearch && !loadingSearch && (
              <EmptyState title="No results" subtitle="We couldn't find any discussions matching your search." />
            )}
            {!loadingSearch && !errorSearch && searchResults.length === 0 && (
              <EmptyState title="No results" subtitle="We couldn't find any discussions matching your search." />
            )}
            {!loadingSearch && !errorSearch && searchResults.map((forum) => (
              <ForumListItem key={forum.id} forum={forum} backendUrl={BACKEND_STORAGE_URL} />
            ))}
          </>
        ) : (
          <>
            {!loading && !error && !hasAnyForums && (
              <EmptyState
                title="No discussions yet"
                subtitle={token ? "Be the first to start a conversation above." : "Sign in to be the first to start a conversation."}
              />
            )}
            {!loading && !error && forumData?.data?.map((forum) => (
              <ForumListItem key={forum.id} forum={forum} backendUrl={BACKEND_STORAGE_URL} />
            ))}
          </>
        )}

        {!searchQuery.trim() && renderPagination()}
      </div>
    </>
  );
}

export default function Forum() {
  if (FORUM_UNDER_DEVELOPMENT) {
    return <UnderDevelopment pageName="The Forum" message="Our community forum is being finalized. Please check back soon." />;
  }
  return <ForumContent />;
}
