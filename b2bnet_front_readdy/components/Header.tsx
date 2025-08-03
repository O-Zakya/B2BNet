
'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  onSignInClick?: () => void;
  onGetStartedClick?: () => void;
}

export default function Header({ onSignInClick, onGetStartedClick }: HeaderProps) {
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-purple-50/60 backdrop-blur-lg border-b border-purple-100/30' 
        : 'bg-purple-50/80 backdrop-blur-md border-b border-purple-100/50'
    }`}>
      <div className="w-full px-8 py-2 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-1.5">
          {/* Logo Image */}
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/logob2b.png" 
              alt="B2BNet Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          {/* Brand Name */}
          <div className="text-lg font-bold" style={{ color: '#3f3d3dff', fontFamily: 'AR One Sans, sans-serif' }}>
            B2BNet
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-3">
          {/* Country Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="flex items-center space-x-1 px-2.5 py-1 text-gray-700 border border-gray-700 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-sm">Country</span>
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            
            {isCountryOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[180px] z-50">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇲🇦 Morocco</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇫🇷 France</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇺🇸 United States</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇬🇧 United Kingdom</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇨🇦 Canada</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇪🇸 Spain</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇩🇪 Germany</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇨🇳 China</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇦🇺 Australia</button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">🇦🇪 United Arab Emirates</button>
              </div>
            )}
          </div>

          {/* Sign In Button - Teams style */}
          <button 
            onClick={onSignInClick}
            className="flex items-center space-x-2 px-3.5 py-1 border rounded-md hover:bg-purple-50 transition-colors font-semibold cursor-pointer" 
            style={{ color: '#845fc8', borderColor: '#845fc8' }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-sm">Sign in</span>
          </button>

          {/* Get Started Button */}
          <button 
            onClick={onGetStartedClick}
            className="flex items-center space-x-2 px-4 py-1 rounded-md transition-colors font-semibold cursor-pointer text-white" 
            style={{ backgroundColor: '#845fc8' }}
          >
            <span className="text-sm">Get Started</span>
          </button>
        </div>
      </div>
    </header>
  );
}
