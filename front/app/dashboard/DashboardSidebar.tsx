'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function DashboardSidebar({ activeView, setActiveView }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: 'ri-dashboard-3-fill' },
    { id: 'calls', label: 'Voice Calls', icon: 'ri-phone-fill' },
    { id: 'video-calls', label: 'Video Calls', icon: 'ri-video-fill' },
    { id: 'meeting', label: 'Meeting', icon: 'ri-group-fill' },
    { id: 'messages', label: 'Messages', icon: 'ri-chat-3-fill' },
    { id: 'contacts', label: 'Contacts', icon: 'ri-contacts-fill' },
    { id: 'calendar', label: 'Calendar', icon: 'ri-calendar-fill' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Récupérer le token depuis localStorage
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          console.error('Aucun token trouvé');
          setUserName('Utilisateur');
          setLoading(false);
          return;
        }

        // Appel à ton endpoint /user/me avec le token
        const res = await axios.get('http://localhost:5000/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Construire le nom complet à partir des données JWT
        const fullName = `${res.data.firstName} ${res.data.lastName}`;
        setUserName(fullName);
        
      } catch (err: any) {
        console.error('Erreur lors du chargement de l\'utilisateur :', err);
        
        // Si le token est invalide, rediriger vers la connexion
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          // Optionnel : rediriger vers la page de connexion
          // window.location.href = '/signin';
        }
        
        setUserName('Utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out relative`}>
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-gray-200 transition-all duration-300`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-3' : 'justify-between'}`}>
          <div className="flex items-center space-x-1.5">
            <div className="w-9 h-9 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="B2BNet Logo" 
                width={30} 
                height={30}
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-xl" style={{ color: '#3f3d3d' }}>
                </h1>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <i className={`ri-menu-${isCollapsed ? 'unfold' : 'fold'}-line w-5 h-5 text-gray-600`}></i>
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
              activeView === item.id
                ? 'bg-purple-100 text-purple-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={isCollapsed ? item.label : undefined}
          >
            <i className={`${item.icon} w-5 h-5 flex items-center justify-center ${isCollapsed ? 'mx-auto' : ''}`}></i>
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}