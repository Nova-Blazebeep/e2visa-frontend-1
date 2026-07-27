'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'react-toastify';
import ContactForm from '../components/contact/ContactForm';

export default function Contact() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleBlur = (e) => {
      const { name } = e.target;
      const fieldError = validateContact({ ...formData, [name]: formData[name] });
      setErrors(prev => ({ ...prev, [name]: fieldError[name] }));
    };

    const validateContact = (data) => {
      const errors = {};
      if (!data.fullName.trim()) errors.fullName = "Name is required.";
      if (!data.email.trim()) errors.email = "Email is required.";
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) errors.email = "Enter a valid email address.";
      if (!data.subject.trim()) errors.subject = "Subject is required.";
      if (!data.message.trim()) errors.message = "Message is required.";
      return errors;
    };

    const CONTACT_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/contact';

    const handleSubmit = async (e) => {
      e.preventDefault();
      const validationErrors = validateContact(formData);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      setIsSubmitting(true);
      // Map frontend keys to backend keys
      const payload = {
        name: formData.fullName,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        userType: formData.userType
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
    <div className="">
      

      {/* Contact Section */}
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 ">
          {/* Left Side - Contact Information */}
          <div className="p-8 flex flex-col items-center justify-center !text-white bg-[url('/images/contact-banner.jpg')] bg-cover bg-center relative ">
            <div className="absolute inset-0 bg-[#1B263B99] z-0" />
            <div className="relative w-[430px]  z-10 p-8">

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <p className="">941.518.7138</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center  rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <p className="">info@e2visa.com</p>
              </div>

            </div>

            <div className="mt-8 flex gap-4">
              <Link href="https://www.facebook.com/e2visa" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center  rounded-full text-white hover:bg-opacity-90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </Link>
              <Link href="https://x.com/e2_visa" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center  rounded-full text-white hover:bg-opacity-90 transition-colors">
                
              <Image
                      src="/images/Contact/Vector.png"
                      alt="E2Visa Logo"
                      width={24}
                      height={24}
                      className="h-5 w-5" 
                    />
              </Link>
            </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-[540px]">
                
            <h2 className="text-3xl font-semibold mb-8 ml-[26px]">Get in touch!</h2>
            <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 