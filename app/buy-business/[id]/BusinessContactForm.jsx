import { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';

const BusinessContactForm = ({ business }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    message: '',
    newsletter: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const params = new URLSearchParams({
      professional_id: business.user_id || business.id,
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      message: formData.message,
    });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/send-email-to-professional?${params.toString()}`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.message && !data.message.toLowerCase().includes('fail')) {
        setFormData({ fullName: '', phoneNumber: '', email: '', message: '', newsletter: false });
        setErrors({});
        toast.success(data.message, { position: 'top-right' });
      } else {
        if (data.errors) {
          if (Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'object') {
            Object.values(data.errors).flat().forEach(err => toast.error(err, { position: 'top-right' }));
          } else if (typeof data.errors === 'string') {
            toast.error(data.errors, { position: 'top-right' });
          }
        }
        if (data.message) {
          toast.error(data.message, { position: 'top-right' });
        } else {
          toast.error('Failed to send message.', { position: 'top-right' });
        }
      }
    } catch(err) {
      toast.error('Failed to send message.', { position: 'top-right' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#A4B5D53D] p-4 sm:p-8 rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Contact Form</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
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
            onChange={handleInputChange}
            placeholder="Ener your name"
            className="pl-12 w-full pr-4 py-4 rounded-lg border text-[#9E9E9E] font-medium text-base border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
          />
          <label 
            htmlFor="fullName" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F8F9FA] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Full Name
          </label>
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.fullName}</p>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Image
              src="/images/auth/signin/phone.png"
              alt="Phone icon"
              width={23}
              height={20}
            />
          </div>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone no."
            className="pl-12 w-full pr-4 py-4 rounded-lg border text-[#9E9E9E] font-medium  text-base border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
          />
          <label 
            htmlFor="phoneNumber" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F8F9FA] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Phone Number
          </label>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="relative">
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
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="pl-12 w-full pr-4 py-4 rounded-lg border text-[#9E9E9E] font-medium text-base border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none"
          />
          <label 
            htmlFor="email" 
            className="absolute text-sm text-[#1E1E1E] left-12 bg-[#F8F9FA] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Email <span className="text-red-500">*</span>
          </label>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>
          )}
        </div>

        <div className="relative">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            placeholder="Write your message here"
            className="w-full px-4 py-4 rounded-lg border text-[#9E9E9E] font-medium text-base border-[#1B263B] focus:ring-2 focus:ring-[#2EC4B6] focus:border-transparent outline-none resize-none"
          />
          <label 
            htmlFor="message" 
            className="absolute text-sm text-[#1E1E1E] left-4 bg-[#F8F9FA] px-1 -top-2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
          >
            Message
          </label>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1 ml-2">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#40433F] text-white py-4 rounded-lg hover:bg-[#363936] transition-colors font-medium text-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

       <div>
       <p className="text-xs  text-center">
          By clicking the button, you agree to E2Visa's{' '} 
        </p>
        <div className="flex text-xs justify-center items-center gap-2 !pt-1">
        <a href="/terms-conditions" className=" underline">
            Terms of Use
          </a>{' '}
          and{' '}
          <a href="/privacy-policy" className=" underline">
            Privacy Notice
          </a>
        </div>
       </div>
      </form>
    </div>
  );
};

export default BusinessContactForm; 