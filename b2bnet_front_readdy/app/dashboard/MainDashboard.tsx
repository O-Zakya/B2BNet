
'use client';

import { useState } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import OverviewDashboard from './OverviewDashboard';
import CallsDashboard from './CallsDashboard';
import VideoCallsDashboard from './VideoCallsDashboard';
import MessagesDashboard from './MessagesDashboard';
import ContactsDashboard from './ContactsDashboard';
import SettingsDashboard from './SettingsDashboard';
import MeetingDashboard from './MeetingDashboard';
import CalendarDashboard from './CalendarDashboard';

export default function MainDashboard() {
  const [activeView, setActiveView] = useState('overview');

  const renderDashboard = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewDashboard setActiveView={setActiveView} />;
      case 'calls':
        return <CallsDashboard />;
      case 'video-calls':
        return <VideoCallsDashboard />;
      case 'meeting':
        return <MeetingDashboard setActiveView={setActiveView} />;
      case 'messages':
        return <MessagesDashboard />;
      case 'calendar':
        return <CalendarDashboard setActiveView={setActiveView} />;
      case 'contacts':
        return <ContactsDashboard />;
      case 'settings':
        return <SettingsDashboard />;
      default:
        return <OverviewDashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
      
      <div className="flex-1 flex flex-col">
        <DashboardHeader setActiveView={setActiveView} />
        
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}
