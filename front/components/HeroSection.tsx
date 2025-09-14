
'use client';

interface HeroSectionProps {
  onGetStartedClick?: () => void;
}

export default function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-purple-50/30 to-violet-100/40">
      <div className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Content */}
          <div className="space-y-6 order-2 lg:order-1 px-4 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Where <span className="text-purple-600">Small Businesses</span>
                <span className="text-violet-600 block">Connect & Thrive</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed whitespace-nowrap">
                Break down communication barriers with our all-in-one platform.
              </p>
            </div>

            <button 
              onClick={onGetStartedClick}
              className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-semibold text-base cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </button>

            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-6 pt-2">
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">1K+</div>
                <div className="text-xs text-gray-600">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">10+</div>
                <div className="text-xs text-gray-600">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">99.9%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative order-1 lg:order-2">
            <div className="relative px-4">
              <img 
                src="/b2bheroo.png"
                alt="B2BNet Business Communication Platform"
                className="w-[95%] h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
