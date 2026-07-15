import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    if (!e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, [e.target.name]: 'This field is required' }));
    } else {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const CONTACT_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/contact';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Map frontend keys to backend keys
    const payload = {
      name: formData.fullName,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.message && data.message.toLowerCase().includes('success')) {
        setFormData({ fullName: '', email: '', subject: '', message: '' });
        setErrors({});
        toast.success(data.message, { position: 'top-right' });
      } else {
        // Show backend error(s)
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'object') {
            Object.values(data.errors).flat().forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'string') {
            toast.error(data.errors, { position: 'top-right' });
          }
        } else if (data.message) {
          toast.error(data.message, { position: 'top-right' });
        } else {
          toast.error('Failed to send message.', { position: 'top-right' });
        }
      }
    } catch {
      toast.error('Failed to send message.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6 max-w-[480px] mx-auto" onSubmit={handleSubmit}>
      {/* Full Name Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Image
            src="/images/auth/signin/user.png"
            alt="User icon"
            width={23}
            height={20}
          />
        </div>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your name"
          className="pl-12 w-full  pr-4 py-4 rounded-lg border text-[#40433F] font-medium text-xs lg:text-sm border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
        />
        <label
          htmlFor="fullName"
          className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F3F7F9] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
        >
          Name
        </label>
        {errors.fullName && (
          <p className="text-red-500 text-xs absolute -bottom-5 mt-1 ml-2">{errors.fullName}</p>
        )}
      </div>
      {/* Email Input */}
      <div className={`relative ${errors.fullName && '!mt-10'}`}>
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Image
            src="/images/auth/signin/mail.png"
            alt="Email icon"
            width={23}
            height={20}
          />
        </div>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          className="pl-12 w-full  pr-4 py-4 rounded-lg border text-[#40433F] font-medium text-xs lg:text-sm border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
        />
        <label
          htmlFor="email"
          className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F3F7F9] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
        >
          Email <span className="text-red-500">*</span>
        </label>
        {errors.email && (
          <p className="text-red-500 text-xs absolute -bottom-5 mt-1 ml-2">{errors.email}</p>
        )}
      </div>
      {/* Subject Input */}
      <div className={`relative ${errors.email && '!mt-10'}`}>
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Image
            src="/images/auth/signin/mail.png"
            alt="Email icon"
            width={23}
            height={20}
          />
        </div>
        {/* max-w-[540px] */}
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your subject"
          className="pl-12 w-full  pr-4 py-4 rounded-lg border text-[#40433F] font-medium text-xs lg:text-sm border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
        />
        <label
          htmlFor="subject"
          className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F3F7F9] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
        >
          Subject
        </label>
        {errors.subject && (
          <p className="text-red-500 text-xs absolute -bottom-5 mt-1 ml-2">{errors.subject}</p>
        )}
      </div>
      {/* Message Input */}
      <div className={`relative ${errors.subject && '!mt-10'}`}>
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Image
            src="/images/auth/signin/mail.png"
            alt="Email icon"
            width={23}
            height={20}
          />
        </div>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your message"
          className="pl-12 w-full pr-4 py-4 rounded-lg border text-[#40433F] font-medium text-xs lg:text-sm border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
        />
        <label
          htmlFor="message"
          className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F3F7F9] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
        >
          Message
        </label>
        {errors.message && (
          <p className="text-red-500 text-xs absolute -bottom-4 ml-2">{errors.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-[#40433F] text-white !mt-10 4 py-4 2xl:py-5 rounded-lg hover:bg-[#363936] transition-colors font-semibold text-sm md:text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
} 