
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
import CallModal from '@/components/CallModal';

export default function MainDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

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
        
        {/* Bouton flottant pour lancer un appel */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-colors"
            title="Lancer un appel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Modal d'appel */}
      <CallModal 
        isOpen={isCallModalOpen} 
        onClose={() => setIsCallModalOpen(false)} 
      />
    </div>
  );
}
