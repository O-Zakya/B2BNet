'use client';

import { useRouter } from 'next/navigation';

interface ServiceDetailsProps {
  onGetStartedClick?: () => void;
}

export default function ServiceDetails({ onGetStartedClick }: ServiceDetailsProps) {
  const router = useRouter();

  const handleLearnMore = () => {
    if (onGetStartedClick) {
      onGetStartedClick();
    }
  };
  const services = [
    {
      title: 'Smart Dashboard',
      benefit: 'Get a complete overview of your business communications with our intuitive dashboard. Monitor call activity, track performance metrics, and manage all your contacts from one centralized hub.',
      image: '/Dashboard.png',
      icon: 'ri-dashboard-fill',
      color: 'purple'
    },
    {
      title: 'Crystal Voice Calling',
      benefit: 'Connect with clients worldwide through crystal-clear HD voice calls with AI translation support. Perfect for international business communications with real-time language processing.',
      image: '/Voice%20Call.png',
      icon: 'ri-phone-fill',
      color: 'blue'
    },
    {
      title: 'Face Connect Video',
      benefit: 'Build stronger relationships with HD video calls that support screen sharing and real-time collaboration. Perfect for team meetings and client presentations.',
      image: '/Video%20Call.png',
      icon: 'ri-video-fill',
      color: 'violet'
    },
    {
      title: 'TeamSpace Meetings',
      benefit: 'Host professional meetings with advanced scheduling, participant management, and collaboration tools. Organize your business meetings efficiently with integrated calendar features.',
      image: '/Meetings.png',
      icon: 'ri-group-fill',
      color: 'green'
    },
    {
      title: 'InstantLink Messaging',
      benefit: 'Stay connected with instant messaging that includes file sharing, group chats, and message history. Streamline your team communication with organized conversation threads.',
      image: '/Messages.png',
      icon: 'ri-chat-3-fill',
      color: 'indigo'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for <span className="text-purple-600">Modern Business</span>
          </h2>
        </div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`${
                    service.color === 'purple' ? 'bg-purple-100' :
                    service.color === 'blue' ? 'bg-blue-100' :
                    service.color === 'violet' ? 'bg-violet-100' :
                    service.color === 'green' ? 'bg-green-100' :
                    service.color === 'indigo' ? 'bg-indigo-100' :
                    'bg-purple-100'
                  } w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <i className={`${service.icon} ${
                      service.color === 'purple' ? 'text-purple-600' :
                      service.color === 'blue' ? 'text-blue-600' :
                      service.color === 'violet' ? 'text-violet-600' :
                      service.color === 'green' ? 'text-green-600' :
                      service.color === 'indigo' ? 'text-indigo-600' :
                      'text-purple-600'
                    } w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  {service.benefit}
                </p>
                
                <button 
                  onClick={handleLearnMore}
                  className={`${
                    index % 2 === 0 
                      ? 'bg-gradient-to-r from-violet-500/90 to-purple-600/90 hover:from-violet-600/95 hover:to-purple-700/95' 
                      : 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600/95 hover:to-indigo-700/95'
                  } text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold cursor-pointer whitespace-nowrap shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm border border-white/20`}
                >
                  Learn More
                </button>
              </div>

              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-xl">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="w-full h-80 object-contain rounded-xl"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-purple-100">
                    <i className={`${service.icon} ${
                      service.color === 'purple' ? 'text-purple-600' :
                      service.color === 'blue' ? 'text-blue-600' :
                      service.color === 'violet' ? 'text-violet-600' :
                      service.color === 'green' ? 'text-green-600' :
                      service.color === 'indigo' ? 'text-indigo-600' :
                      'text-purple-600'
                    } text-lg w-6 h-6 flex items-center justify-center`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}