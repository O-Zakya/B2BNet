'use client';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Empowering Small Businesses to <span className="text-purple-600">Communicate Globally</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            B2BNet bridges the gap between local businesses and global opportunities. Our comprehensive communication platform combines crystal-clear voice calls, HD video conferencing, instant messaging, and breakthrough AI translation technology to help small businesses connect, collaborate, and grow beyond borders.
          </p>
        </div>

        {/* Platform Interface Images */}
        <div className="space-y-12 mt-16">
          {/* First Row - 3 Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Dashboard */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 h-96 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src="/Dashboard.png"
                  alt="B2BNet Dashboard"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <span className="text-base font-semibold text-purple-600">Dashboard</span>
              </div>
            </div>

            {/* Voice Calls */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 h-96 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src="/Voice Call.png"
                  alt="Voice Call Interface"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <span className="text-base font-semibold text-purple-600">Voice Calls</span>
              </div>
            </div>

            {/* Video Conference */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 h-96 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src="/Video Call.png"
                  alt="Video Conference Interface"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <span className="text-base font-semibold text-purple-600">Video Calls</span>
              </div>
            </div>
          </div>

          {/* Second Row - 2 Images Centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Meetings */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 h-96 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src="/Meetings.png"
                  alt="Meetings Interface"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <span className="text-base font-semibold text-purple-600">Meetings</span>
              </div>
            </div>

            {/* Messages */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 h-96 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img 
                  src="/Messages.png"
                  alt="Messages Interface"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-purple-100">
                <span className="text-base font-semibold text-purple-600">Messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}