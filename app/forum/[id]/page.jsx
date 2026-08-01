'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import ForumAvatar from '@/app/components/forum/ForumAvatar';
import RolePill from '@/app/components/forum/RolePill';
import { timeAgo } from '@/app/utils/timeAgo';
import UnderDevelopment from '@/app/components/common/UnderDevelopment';
import { FORUM_UNDER_DEVELOPMENT } from '@/app/config/featureFlags';

// Buyers always allowed; everyone else needs an active badge. badge_status
// is null for Buyer/Admin/Moderator (see LoginController), so this also
// covers those roles correctly.
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('userDetail'));
  } catch {
    return null;
  }
};

const canPostInForum = (storedUser) => {
  if (!storedUser) return false;
  return storedUser.role === 'Buyer' || storedUser.badge_status === 'active';
};

function BadgeRequiredPrompt() {
  return (
    <div className="bg-[#40433F] rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-white/90 font-medium">Get your badge to participate in the forum.</p>
      <Link href="/dashboard?section=settings" className="px-4 py-2 rounded-lg bg-white text-[#40433F] text-sm font-semibold hover:bg-gray-100 transition-colors flex-shrink-0">
        Go to Settings
      </Link>
    </div>
  );
}

function SignInPrompt({ message }) {
  return (
    <div className="bg-[#40433F] rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-white/90 font-medium">{message}</p>
      <div className="flex gap-2 flex-shrink-0">
        <Link href="/signin" className="px-4 py-2 rounded-lg bg-white text-[#40433F] text-sm font-semibold hover:bg-gray-100 transition-colors">
          Sign In
        </Link>
        <Link href="/signup-options" className="px-4 py-2 rounded-lg border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

function ReplyItem({ reply, backendUrl }) {
  const avatarSrc = reply.user?.image ? `${backendUrl}/${reply.user.image}` : null;
  const badgeSrc = reply.replier_badge_icon ? `${backendUrl}/${reply.replier_badge_icon}` : null;

  return (
    <div className="flex items-start gap-3">
      {reply.user?.role ? (
        <Link href={`/professional/${reply.user.id}`} title={`View ${reply.user.name}'s profile`} className="flex-shrink-0 group">
          <ForumAvatar src={avatarSrc} alt={reply.user?.name} badgeSrc={badgeSrc} role={reply.user?.role} size={32} linkable />
        </Link>
      ) : (
        <ForumAvatar src={avatarSrc} alt={reply.user?.name} badgeSrc={badgeSrc} role={reply.user?.role} size={32} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#0A3161] text-sm">{reply.user?.name}</span>
          <RolePill role={reply.user?.role} />
          <span className="text-xs text-gray-400">{timeAgo(reply.created_at)}</span>
        </div>
        <div className="text-[#40433F] text-sm mt-0.5" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {reply.content}
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, backendUrl, token, hasBadgeAccess, replyingTo, setReplyingTo, replyText, setReplyText, replyError, setReplyError, onSubmitReply }) {
  const avatarSrc = comment.user?.image ? `${backendUrl}/${comment.user.image}` : null;
  const badgeSrc = comment.commentor_badge_icon ? `${backendUrl}/${comment.commentor_badge_icon}` : null;
  const isReplying = replyingTo === comment.id;

  return (
    <div className="flex items-start gap-3">
      {comment.user?.role ? (
        <Link href={`/professional/${comment.user.id}`} title={`View ${comment.user.name}'s profile`} className="flex-shrink-0 group">
          <ForumAvatar src={avatarSrc} alt={comment.user?.name} badgeSrc={badgeSrc} role={comment.user?.role} size={40} linkable />
        </Link>
      ) : (
        <ForumAvatar src={avatarSrc} alt={comment.user?.name} badgeSrc={badgeSrc} role={comment.user?.role} size={40} />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#0A3161] text-sm">{comment.user?.name}</span>
          <RolePill role={comment.user?.role} />
          <span className="text-xs text-gray-400">{timeAgo(comment.created_at)}</span>
        </div>
        <div className="text-[#40433F] text-sm mt-0.5 mb-1.5" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {comment.content}
        </div>

        {token && hasBadgeAccess && (
          <button
            className="text-[#2EC4B6] text-xs font-semibold hover:text-[#0A3161] transition-colors"
            onClick={() => { setReplyingTo(isReplying ? null : comment.id); setReplyText(''); setReplyError(''); }}
          >
            {isReplying ? 'Cancel' : 'Reply'}
          </button>
        )}

        {isReplying && (
          <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-[#40433F] focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none resize-none transition-colors"
              rows={2}
              placeholder="Write your reply..."
              value={replyText}
              onChange={e => { if (e.target.value.length <= 500) setReplyText(e.target.value); if (replyError) setReplyError(""); }}
              maxLength={500}
              autoFocus
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-red-500 text-xs">{replyError}</span>
              <span className="text-xs" style={{ color: replyText.length >= 500 ? '#e53e3e' : '#9CA3AF' }}>
                {replyText.length}/500
              </span>
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button
                className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-300 transition-colors"
                onClick={() => { setReplyingTo(null); setReplyText(""); setReplyError(""); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1.5 rounded-lg bg-[#40433F] text-white text-xs font-semibold hover:bg-[#363936] transition-colors"
                onClick={() => onSubmitReply(comment.id)}
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-4 border-l-2 border-gray-100 space-y-4">
            {comment.replies.map(r => <ReplyItem key={r.id} reply={r} backendUrl={backendUrl} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function ForumPostPageContent({ params }) {
  const id = params?.id;
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [replyError, setReplyError] = useState("");
  const [token, setToken] = useState(null);
  const [hasBadgeAccess, setHasBadgeAccess] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setHasBadgeAccess(canPostInForum(getStoredUser()));
  }, []);
  const BACKEND_STORAGE_URL = process.env.NEXT_PUBLIC_BACKEND_STORAGE_URL;

  useEffect(() => {
    if (!id) return;
    const fetchForum = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/forum-detail/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.ok && data.result) {
          setForum(data.result);
        } else {
          setError(data.message || 'Failed to fetch forum.');
        }
      } catch (err) {
        setError('Failed to fetch forum.');
      } finally {
        setLoading(false);
      }
    };
    fetchForum();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!forum) return <div className="p-8">Forum not found.</div>;

  const refreshForum = async () => {
    const forumRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/forum-detail/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const forumData = await forumRes.json();
    if (forumRes.ok && forumData.result) {
      setForum(forumData.result);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      setCommentError("Please enter a comment before submitting.");
      return;
    }
    setCommentError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/comment/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ forum_id: id, content: commentText }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        toast.success('Comment added!', { position: 'top-right' });
        setCommentText("");
        setCommentError("");
        await refreshForum();
      } else {
        setCommentError(data.message || 'Failed to add comment.');
        toast.error(data.message || 'Failed to add comment.', { position: 'top-right' });
      }
    } catch (err) {
      setCommentError('Failed to add comment.');
      toast.error('Failed to add comment.', { position: 'top-right' });
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) {
      setReplyError("Please enter a reply before submitting.");
      return;
    }
    setReplyError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/reply/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ forum_id: id, comment_id: commentId, content: replyText }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        toast.success('Reply added!', { position: 'top-right' });
        setReplyText("");
        setReplyError("");
        setReplyingTo(null);
        await refreshForum();
      } else {
        setReplyError(data.message || 'Failed to add reply.');
        toast.error(data.message || 'Failed to add reply.', { position: 'top-right' });
      }
    } catch (err) {
      setReplyError('Failed to add reply.');
      toast.error('Failed to add reply.', { position: 'top-right' });
    }
  };

  const avatarSrc = forum.created_by?.image ? `${BACKEND_STORAGE_URL}/${forum.created_by.image}` : null;
  const badgeSrc = forum.creator_badge_icon ? `${BACKEND_STORAGE_URL}/${forum.creator_badge_icon}` : null;
  const commentCount = forum.comment?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb / back link */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/forum" className="flex items-center gap-1.5 hover:text-[#0A3161] font-medium transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Forum
        </Link>
      </div>

      {/* Main post */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <ForumAvatar src={avatarSrc} alt={forum.created_by?.name} badgeSrc={badgeSrc} role={forum.created_by?.role} size={48} />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#0A3161] text-sm">{forum.created_by?.name}</span>
              <RolePill role={forum.created_by?.role} />
            </div>
            <span className="text-xs text-gray-400">{timeAgo(forum.created_at)}</span>
          </div>
        </div>
        <h1 className="text-[#1a1a1a] text-xl lg:text-2xl font-bold mb-3">{forum.title}</h1>
        <p className="text-[#40433F] text-sm lg:text-base leading-relaxed" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {forum.content}
        </p>
      </div>

      {/* Comment composer / badge-required CTA / sign-in CTA */}
      {token && !hasBadgeAccess ? (
        <BadgeRequiredPrompt />
      ) : token ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <label className="block text-sm font-semibold text-[#40433F] mb-2">Add a Comment</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-[#40433F] focus:ring-2 focus:ring-[#2EC4B6] focus:border-[#2EC4B6] outline-none resize-none transition-colors"
            rows={3}
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={e => { if (e.target.value.length <= 500) setCommentText(e.target.value); if (commentError) setCommentError(""); }}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-red-500 text-xs">{commentError}</span>
            <span className="text-xs" style={{ color: commentText.length >= 500 ? '#e53e3e' : '#9CA3AF' }}>
              {commentText.length}/500
            </span>
          </div>
          <div className="flex gap-2 justify-end mt-3">
            <button
              className="px-5 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-colors"
              onClick={() => { setCommentText(""); setCommentError(""); }}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-[#40433F] text-white text-sm font-semibold hover:bg-[#363936] transition-colors"
              onClick={handleAddComment}
            >
              Comment
            </button>
          </div>
        </div>
      ) : (
        <SignInPrompt message="Sign in to join the discussion — comment or reply to others." />
      )}

      {/* Comments */}
      <div className="mt-2">
        <h2 className="font-bold text-[#0A3161] text-lg mb-4">
          {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
        </h2>

        {commentCount > 0 ? (
          <div className="space-y-6">
            {forum.comment.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                backendUrl={BACKEND_STORAGE_URL}
                token={token}
                hasBadgeAccess={hasBadgeAccess}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                replyError={replyError}
                setReplyError={setReplyError}
                onSubmitReply={handleAddReply}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="w-12 h-12 rounded-full bg-[#0A3161]/8 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A3161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              {token ? 'No comments yet — be the first to reply!' : 'No comments yet. Sign in to start the conversation.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForumPostPage(props) {
  if (FORUM_UNDER_DEVELOPMENT) {
    return <UnderDevelopment pageName="This discussion" message="Our community forum is being finalized. Please check back soon." />;
  }
  return <ForumPostPageContent {...props} />;
}
