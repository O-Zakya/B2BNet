'use client';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-violet-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-purple-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-violet-200 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-6">
        <div className="space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="ri-rocket-fill text-white text-3xl w-10 h-10 flex items-center justify-center"></i>
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Ready to Transform
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
              Your Business Communication?
            </span>
          </h2>

          {/* Supporting Text */}
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of small businesses already connecting globally with B2BNet. Start using our free platform today and experience the future of business communication.
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-700">
            <div className="flex items-center space-x-2">
              <i className="ri-check-fill text-green-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">Completely Free</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-check-fill text-green-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">No Hidden Costs</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-check-fill text-green-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-check-fill text-green-500 w-5 h-5 flex items-center justify-center"></i>
              <span className="font-medium">All Features Included</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-12 py-5 rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all duration-300 font-bold text-xl cursor-pointer whitespace-nowrap shadow-2xl hover:shadow-3xl transform hover:-translate-y-2">
              Get Started Free
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center space-x-8 text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1,000+</div>
                <div className="text-sm">Happy Businesses</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">10+</div>
                <div className="text-sm">Countries Served</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.7/5</div>
                <div className="text-sm">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}