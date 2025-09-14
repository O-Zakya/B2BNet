'use client';

interface MeetingDashboardProps {
  setActiveView: (view: string) => void;
}

export default function MeetingDashboard({ setActiveView }: MeetingDashboardProps) {
  const upcomingMeetings = [
    { 
      id: '1', 
      title: 'Team Standup', 
      time: '10:00 AM', 
      date: 'Today', 
      participants: 5, 
      status: 'starting-soon',
      meetingId: 'meeting-123-456'
    },
    { 
      id: '2', 
      title: 'Client Presentation', 
      time: '2:00 PM', 
      date: 'Today', 
      participants: 8, 
      status: 'scheduled',
      meetingId: 'meeting-789-101'
    },
    { 
      id: '3', 
      title: 'Project Review', 
      time: '9:00 AM', 
      date: 'Tomorrow', 
      participants: 3, 
      status: 'scheduled',
      meetingId: 'meeting-112-131'
    },
    { 
      id: '4', 
      title: 'Budget Planning', 
      time: '3:30 PM', 
      date: 'Dec 28', 
      participants: 6, 
      status: 'scheduled',
      meetingId: 'meeting-415-161'
    }
  ];

  const handleJoinMeeting = (meetingId: string) => {
    // Logic to join meeting - could redirect to meeting room
    console.log(`Joining meeting: ${meetingId}`);
  };

  const handleStartMeeting = () => {
    // Logic to start instant meeting
    console.log('Starting instant meeting');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveView('calendar')}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-calendar-line w-4 h-4"></i>
            <span>Schedule Meeting</span>
          </button>
          <button 
            onClick={handleStartMeeting}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-video-add-line w-4 h-4"></i>
            <span>Start Meeting</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-video-add-fill text-purple-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Instant Meeting</h3>
            <p className="text-gray-600 mb-4">Start a meeting right now with anyone</p>
            <button 
              onClick={handleStartMeeting}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
            >
              Start Now
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-calendar-schedule-fill text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Meeting</h3>
            <p className="text-gray-600 mb-4">Plan a meeting for later with calendar</p>
            <button 
              onClick={() => setActiveView('calendar')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
            >
              Schedule
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-user-add-fill text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Join Meeting</h3>
            <p className="text-gray-600 mb-4">Join a meeting with meeting ID</p>
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="Enter meeting ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors w-full"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Meetings</h2>
            <button 
              onClick={() => setActiveView('calendar')}
              className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
            >
              View Calendar
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-purple-200 hover:bg-purple-50/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    meeting.status === 'starting-soon' ? 'bg-orange-100' : 'bg-blue-100'
                  }`}>
                    <i className={`ri-group-fill ${
                      meeting.status === 'starting-soon' ? 'text-orange-600' : 'text-blue-600'
                    } text-lg`}></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <i className="ri-calendar-line w-4 h-4"></i>
                        <span>{meeting.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="ri-time-line w-4 h-4"></i>
                        <span>{meeting.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <i className="ri-group-line w-4 h-4"></i>
                        <span>{meeting.participants} participants</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {meeting.status === 'starting-soon' && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                      Starting Soon
                    </span>
                  )}
                  <button 
                    onClick={() => handleJoinMeeting(meeting.meetingId)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      meeting.status === 'starting-soon' 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {meeting.status === 'starting-soon' ? 'Join Now' : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Meetings */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Meetings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-group-fill text-gray-600 w-4 h-4"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Weekly Review</p>
                  <p className="text-sm text-gray-500">Dec 26, 2024 • 45 minutes • 4 participants</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium">Completed</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-group-fill text-gray-600 w-4 h-4"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Product Demo</p>
                  <p className="text-sm text-gray-500">Dec 25, 2024 • 30 minutes • 7 participants</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium">Completed</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-group-fill text-gray-600 w-4 h-4"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Team Sync</p>
                  <p className="text-sm text-gray-500">Dec 24, 2024 • 25 minutes • 6 participants</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-green-600 text-sm font-medium">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
