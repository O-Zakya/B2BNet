'use client';

interface CalendarDashboardProps {
  setActiveView: (view: string) => void;
}

export default function CalendarDashboard({ setActiveView }: CalendarDashboardProps) {
  const scheduledMeetings = [
    { id: '1', title: 'Team Standup', time: '10:00 AM', date: 'Dec 27', color: 'bg-blue-500' },
    { id: '2', title: 'Client Presentation', time: '2:00 PM', date: 'Dec 27', color: 'bg-purple-500' },
    { id: '3', title: 'Project Review', time: '9:00 AM', date: 'Dec 28', color: 'bg-green-500' },
    { id: '4', title: 'Budget Planning', time: '3:30 PM', date: 'Dec 28', color: 'bg-orange-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveView('meeting')}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-arrow-left-line w-4 h-4"></i>
            <span>Back to Meetings</span>
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2">
            <i className="ri-add-line w-4 h-4"></i>
            <span>New Meeting</span>
          </button>
        </div>
      </div>

      {/* Quick Schedule Form */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule New Meeting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Title</label>
            <input 
              type="text" 
              placeholder="Enter meeting title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>30 minutes</option>
              <option>45 minutes</option>
              <option>1 hour</option>
              <option>1.5 hours</option>
              <option>2 hours</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Participants (Email addresses)</label>
            <input 
              type="text" 
              placeholder="Enter email addresses separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea 
              rows={3}
              placeholder="Add meeting description or agenda"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Schedule Meeting
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">December 2024</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="ri-arrow-left-line w-4 h-4"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <i className="ri-arrow-right-line w-4 h-4"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {/* Simple Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            <div className="text-center font-medium text-gray-500 py-2">Sun</div>
            <div className="text-center font-medium text-gray-500 py-2">Mon</div>
            <div className="text-center font-medium text-gray-500 py-2">Tue</div>
            <div className="text-center font-medium text-gray-500 py-2">Wed</div>
            <div className="text-center font-medium text-gray-500 py-2">Thu</div>
            <div className="text-center font-medium text-gray-500 py-2">Fri</div>
            <div className="text-center font-medium text-gray-500 py-2">Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Calendar days - simplified */}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 5; // Starting from Dec 1
              const isCurrentMonth = day > 0 && day <= 31;
              const isToday = day === 27;
              const hasMeeting = [27, 28].includes(day);
              
              return (
                <div key={i} className={`p-3 h-16 border rounded-lg ${
                  isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-purple-500' : ''}`}>
                  {isCurrentMonth && (
                    <>
                      <div className={`text-sm ${isToday ? 'font-bold text-purple-600' : 'text-gray-900'}`}>
                        {day}
                      </div>
                      {hasMeeting && (
                        <div className="mt-1">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheduled Meetings List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Scheduled Meetings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {scheduledMeetings.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-purple-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${meeting.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{meeting.title}</p>
                    <p className="text-sm text-gray-500">{meeting.date} at {meeting.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-purple-600 p-1">
                    <i className="ri-edit-line w-4 h-4"></i>
                  </button>
                  <button className="text-gray-600 hover:text-red-600 p-1">
                    <i className="ri-delete-bin-line w-4 h-4"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
