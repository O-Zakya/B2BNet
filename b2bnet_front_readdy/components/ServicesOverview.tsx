'use client';

export default function ServicesOverview() {
  const services = [
    {
      icon: 'ri-phone-fill',
      title: 'Crystal Voice',
      subtitle: 'HD Voice Calling',
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      icon: 'ri-video-fill',
      title: 'Face Connect',
      subtitle: 'Video Conferencing',
      color: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600'
    },
    {
      icon: 'ri-chat-3-fill',
      title: 'InstantLink',
      subtitle: 'Real-time Messaging',
      color: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      icon: 'ri-group-fill',
      title: 'TeamSpace',
      subtitle: 'Group Conferencing',
      color: 'from-pink-500 to-pink-600',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      icon: 'ri-translate-2',
      title: 'SmartTranslate',
      subtitle: 'AI-Powered Translation',
      color: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-violet-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything Your Business Needs to <span className="text-purple-600">Connect & Grow</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Five powerful communication tools designed to break down barriers and expand your business horizons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 hover:border-purple-200">
                <div className={`${service.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <i className={`${service.icon} ${service.iconColor} text-2xl w-8 h-8 flex items-center justify-center`}></i>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.subtitle}</p>
                
                <div className={`h-1 w-full bg-gradient-to-r ${service.color} rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300`}>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Central Connecting Element */}
        <div className="flex justify-center mt-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              All Connected in One <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 font-semibold">Platform</span>
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full mx-auto opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
}