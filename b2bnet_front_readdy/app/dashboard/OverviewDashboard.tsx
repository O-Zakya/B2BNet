
'use client';

interface OverviewDashboardProps {
  setActiveView: (view: string) => void;
}

export default function OverviewDashboard({ setActiveView }: OverviewDashboardProps) {
  const stats = [
    { label: 'Total Calls Today', value: '4', icon: 'ri-phone-fill', videoIcon: 'ri-video-fill', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Messages Received', value: '10', icon: 'ri-chat-3-fill', color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Total Meetings Today', value: '1', icon: 'ri-group-fill', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Active Contacts', value: '12', icon: 'ri-contacts-fill', color: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  const recentCalls = [
    { name: 'Maizzou Hanane', company: 'SQLI', time: '10:30 AM', duration: '12m 34s', type: 'incoming', status: 'completed' },
    { name: 'Mohamed Allaoui', company: 'Tech Solutions', time: '9:45 AM', duration: '8m 12s', type: 'outgoing', status: 'completed' },
    { name: 'Fatima El Mahdaoui', company: 'Innovation Labs', time: '9:15 AM', duration: '5m 45s', type: 'incoming', status: 'missed' },
    { name: 'Tarik El Yazidi', company: 'Business Pro', time: '8:50 AM', duration: '15m 20s', type: 'outgoing', status: 'completed' }
  ];

  const recentMessages = [
    { name: 'Maizzou Hanane', message: 'Thanks you!', time: '5m ago', unread: true },
    { name: 'Anouar El Ghali', message: 'Can we schedule a call tomorrow?', time: '12m ago', unread: true },
    { name: 'Fatima El Mahdaoui', message: 'The contract has been signed', time: '1h ago', unread: false },
    { name: 'Ahmed Ait Ali', message: 'Meeting confirmed for 3 PM', time: '2h ago', unread: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveView('video-calls')}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-video-line w-4 h-5.5"></i>
            <span>Start Video Call</span>
          </button>
          <button 
            onClick={() => setActiveView('calls')}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-phone-fill w-4 h-5.5"></i>
            <span>Start Voice Call</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center relative`}>
                {stat.videoIcon ? (
                  <div className="relative w-full h-full">
                    <i className={`${stat.icon} ${stat.color} w-4 h-4 flex items-center justify-center absolute bottom-2 left-2`}></i>
                    <i className={`${stat.videoIcon} ${stat.color} w-4 h-4 flex items-center justify-center absolute top-2 right-2`}></i>
                  </div>
                ) : (
                  <i className={`${stat.icon} ${stat.color} w-6 h-6 flex items-center justify-center`}></i>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Calls</h2>
              <button 
                onClick={() => setActiveView('calls')}
                className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCalls.map((call, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      call.type === 'incoming' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      <i className={`${
                        call.type === 'incoming' ? 'ri-video-fill text-purple-400' : 'ri-phone-fill text-blue-600'
                      } w-4 h-4 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{call.name}</p>
                      <p className="text-sm text-gray-500">{call.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{call.time}</p>
                    <p className={`text-xs ${
                      call.status === 'completed' ? 'text-green-600' : 
                      call.status === 'missed' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {call.status === 'completed' ? call.duration : call.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
              <button 
                onClick={() => setActiveView('messages')}
                className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentMessages.map((message, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-sm">
                      {message.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.name}
                      </p>
                      <p className="text-xs text-gray-500">{message.time}</p>
                    </div>
                    <p className={`text-sm mt-1 ${message.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {message.message}
                    </p>
                    {message.unread && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setActiveView('calls')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <i className="ri-phone-fill text-purple-600 w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium text-gray-900">Voice Call</span>
          </button>
          <button 
            onClick={() => setActiveView('video-calls')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <i className="ri-video-fill text-purple-600 w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium text-gray-900">Video Call</span>
          </button>
          <button 
            onClick={() => setActiveView('meeting')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <i className="ri-group-fill text-purple-600 w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium text-gray-900">Meeting</span>
          </button>
          <button 
            onClick={() => setActiveView('messages')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <i className="ri-chat-new-fill text-purple-600 w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium text-gray-900">New Message</span>
          </button>
          <button 
            onClick={() => setActiveView('meeting')}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer"
          >
            <i className="ri-group-fill text-purple-600 w-5 h-5 flex items-center justify-center"></i>
            <span className="font-medium text-gray-900">Schedule Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
