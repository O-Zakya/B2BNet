
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-purple-400">Get in Touch</h3>
            <p className="text-gray-400 mb-8">
              Have questions or need help with our platform? Contact us anytime and we'll get back to you within 24 hours.
            </p>
            
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div>
                <input
                  type="text"
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={500}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  required
                ></textarea>
                <div className="text-sm text-gray-500 mt-1">
                  {formData.message.length}/500 characters
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-semibold cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right: Company Info & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="text-2xl font-bold text-purple-400">
                B2BNet
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering small businesses to communicate globally through innovative VoIP technology and AI-powered translation.
              </p>
              
              {/* Contact Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <i className="ri-map-pin-fill text-purple-400 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-400">Rabat, Morocco</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-phone-fill text-purple-400 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-400">+212 5 37 12 34 56</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-mail-fill text-purple-400 w-5 h-5 flex items-center justify-center"></i>
                  <span className="text-gray-400">support@b2bnet.com</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <i className="ri-facebook-fill w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <i className="ri-twitter-fill w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <i className="ri-linkedin-fill w-5 h-5 flex items-center justify-center"></i>
                </a>
                <a href="#" className="bg-gray-800 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <i className="ri-youtube-fill w-5 h-5 flex items-center justify-center"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-purple-400">Quick Links</h4>
              <div className="grid grid-cols-1 gap-3">
                <a href="#hero" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Home</a>
                <a href="#about" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">About</a>
                <a href="#services" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Services</a>
                <a href="#features" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Features</a>
                <a href="#contact" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Contact</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 B2BNet. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</Link>
            <Link href="/security" className="text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
