'use client';

export default function TrustSection() {
  const trustBadges = [
    {
      icon: 'ri-shield-check-fill',
      title: 'Enterprise Security',
      description: 'End-to-end encryption with military-grade security protocols',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'ri-verified-badge-fill',
      title: 'GDPR Compliant',
      description: 'Fully compliant with European data protection regulations',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'ri-award-fill',
      title: 'ISO Certified',
      description: 'ISO 27001 certified for information security management',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: 'ri-time-fill',
      title: '99.9% Uptime',
      description: 'Guaranteed uptime with redundant infrastructure',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const companies = [
    'TechCorp Solutions',
    'Global Dynamics',
    'Innovation Labs',
    'Business Pro',
    'Enterprise Hub',
    'Smart Systems'
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Trust Badges */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Your security and privacy are our top priorities. We meet the highest industry standards for data protection and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {trustBadges.map((badge, index) => (
            <div key={index} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
              <div className={`${badge.bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <i className={`${badge.icon} ${badge.color} text-2xl w-8 h-8 flex items-center justify-center`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Company Logos */}
        <div className="text-center mb-12">
          <p className="text-gray-500 mb-8">Trusted by 10,000+ companies worldwide</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {companies.map((company, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 h-16 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-gray-600 font-semibold text-sm">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <div className="text-gray-600">Active Businesses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">50M+</div>
            <div className="text-gray-600">Monthly Calls</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime SLA</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}