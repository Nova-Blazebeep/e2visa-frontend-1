'use client';

import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/app/components/common/LoadingSpinner';
import ContactForm from '@/app/components/contact/ContactForm';
// import LoadingSpinner from '../components/common/LoadingSpinner';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}

export default function BlogDetail({ params }) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog/${params.id}`);
        const data = await res.json();
        if (res.ok && data.result) {
          setBlog(data.result);
        } else {
          setError(data.message || 'Blog not found');
        }
      } catch (err) {
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error || !blog) {
    notFound();
  }
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div className="relative h-[300px] ">
        <div className="absolute inset-0 z-[1]">
        <Image
            src="/images/blog/1.png"
            alt="Listings Header"
            fill
            className="object-cover"
          />
        </div>
        {/* Black transparent overlay */}
        <div className="absolute inset-0 bg-black/50 z-[5]"></div>
        <div className="relative z-[10] container mx-auto px-4 h-full flex flex-col items-center justify-center">
          <h1 className="text-xl sm:text-2xl md:text-5xl max-w-3xl text-center text-white mb-4">{blog.title}</h1>
          <div className="flex  items-center text-white text-lg">
            <Link href="/" className="hover:text-[#2EC4B6]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/articles" className="hover:text-[#2EC4B6]">Articles</Link>
            <span className="mx-2">/</span>
            <span className='text-center text-sm sm:text-base md:text-lg'>{blog.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">

        {blog.banner && (
          <div className="w-full h-96 mb-8">
            <img
              src={blog.banner}
              alt={blog.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        <div className="mb-4">
          <div className="text-2xl font-bold text-[#40433F] mb-2">{blog.title}</div>
          <div className="text-sm text-gray-500 mb-2">Published on {formatDate(blog.active_date)}{blog.custom_author ? ` by ${blog.custom_author}` : (blog.user ? ` by ${blog.user.name}` : '')}</div>
        </div>
        <div className="text-gray-700 text-lg leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: blog.content }} />

        {/* <p className="text-gray-700 leading-relaxed mb-4">
          If you are ready to get rid of your business and move on, but not yet ready to leave the United States, one option might be to find a new business to buy in a different industry and sell the one you currently own.
          <br /><br />
          You will need to speak with your immigration attorney about the timing of such a switch, but buying another business that qualifies for the E2 is one way of staying in the U.S., or even staying in your current local area. Since you've already been through the E2 Visa process once before, you know that not all businesses will qualify for the E2, but many do.
          <br /><br />
          You will need to speak with your business broker about why you feel burned out and if your goals for business ownership have changed, as this information will be pivotal in determining what businesses to look for. Ask yourself why you've reached a point where you are considering moving on from your business.
        </p> */}

        {/* <p className="text-gray-700 leading-relaxed mb-2 font-bold">Do you work too many hours?</p>
        <p className="text-gray-700 leading-relaxed mb-2 font-bold">Is the work itself too intense or too much physical labor?</p>
        <p className="text-gray-700 leading-relaxed mb-4 font-bold">Are there things about your business that continually frustrate you to the point of wanting out?</p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Depending on the issue at hand, you may be able to resolve your frustrations by hiring additional help, by rearranging the duties and responsibilities of yourself and your staff or by delegating parts of your business to outside vendors. Speak with your immigration attorney and business broker before you make any fundamental changes to the business that might affect your E2 status for the next time you need to renew.
          <br /><br />
          If none of the above solutions will solve your issue, then begin your new business search by talking with your business broker about your goals for business ownership, the amount of capital you would like to invest in a new business, about your passions, dream business opportunities and about your work experience. All of these pieces combined will give your broker a good idea of the type of business that would fit the bill.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4 font-bold">
          If you feel like you've had enough of your current E2 business, look at your options before you throw in the towel. Speak to your immigration attorney and business broker about your choices today.
        </p>

        <p className="text-gray-700 leading-relaxed mb-4">
          Do you have questions about the options available to business owners with E2 status? Are you curious about what kinds of businesses would be available? <Link href="#" className="text-[#2EC4B6] font-semibold">Ask us!</Link> Please feel free to leave any comments or questions here, and we would be happy to help.
        </p>

        <div className="text-gray-700 mb-5 leading-relaxed">
          <p className="font-bold">Michael Monnot</p>
          <p>941.518.7138</p>
          <p>Mike@InfinityBusinessBrokers.com</p>
        </div> */}

        {/* Comments Section */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({blog.comments ? blog.comments.length : 0})</h2>
          
          {/* Display Comments */}
          <div className="space-y-6 mb-8">
            {blog.comments && blog.comments.length > 0 ? (
              blog.comments.map((comment) => (
                <div key={comment.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800">{comment.name}</h3>
                    <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Leave a Comment Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-inner">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Leave a Reply</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                comment: formData.get('comment')
              };
              try {
                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/blog/${encodeURIComponent(blog.title)}/comment`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify(payload),
                  }
                );
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                  e.target.reset();
                  window.location.reload();
                } else {
                  alert(data.message || `Failed to post comment (${res.status})`);
                }
              } catch (err) {
                alert('Error posting comment');
              }
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comment_name" className="block text-gray-700 text-sm font-bold mb-2">Name *</label>
                  <input type="text" id="comment_name" name="name" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]" placeholder="Your Name" />
                </div>
                <div>
                  <label htmlFor="comment_email" className="block text-gray-700 text-sm font-bold mb-2">Email *</label>
                  <input type="email" id="comment_email" name="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]" placeholder="Your Email" />
                </div>
              </div>
              <div>
                <label htmlFor="comment_text" className="block text-gray-700 text-sm font-bold mb-2">Comment *</label>
                <textarea id="comment_text" name="comment" rows="4" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]" placeholder="Your Comment"></textarea>
              </div>
              <button type="submit" className="bg-[#40433F] hover:bg-[#363936] text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors">
                Post Comment
              </button>
            </form>
          </div>
        </div>

        {/* Contact Form */}
        <div className="my-12 p-8 bg-gray-100 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send Us Your Questions</h2>
        <ContactForm />
          
          {/* <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-[#2EC4B6]"
                placeholder="Your Message"
              ></textarea>
            </div>
            <div className="flex justify-center w-full">

            <button
              type="submit"
              className="bg-[#0A3161] hover:bg-[#102742] text-white font-bold py-2 px-4 rounded w-fit focus:outline-none focus:shadow-outline transition-colors "
            >
              Submit Question
            </button>
            </div>
          </form> */}
        </div>
        
      </div>
    </div>
  );
} 