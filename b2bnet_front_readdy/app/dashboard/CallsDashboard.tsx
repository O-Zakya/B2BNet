
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function CallsDashboard() {
  const [activeTab, setActiveTab] = useState('recent');
  const [showCallModal, setShowCallModal] = useState(false);
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalContainer(document.body);
  }, []);

  const recentCalls = [
    { id: 1, name: 'Maizzou Hanane', company: 'SQLI', phone: '+212 661-234-567', email: 'maizzou.hanane@sqli.ma', time: '10:30 AM', duration: '12m 34s', type: 'incoming', status: 'completed', translated: true },
    { id: 2, name: 'Mohamed Allaoui', company: 'Global Dynamics', phone: '+212 678-456-789', email: 'mohamed.allaoui@globaldynamics.ma', time: '9:45 AM', duration: '8m 12s', type: 'outgoing', status: 'completed', translated: true },
    { id: 3, name: 'Kamal Belkadi', company: 'Innovation Labs', phone: '+212 655-987-321', email: 'kamal.belkadi@innovationlabs.ma', time: '9:15 AM', duration: '5m 45s', type: 'incoming', status: 'missed', translated: false },
    { id: 4, name: 'Mounir Hafid', company: 'Business Pro', phone: '+212 642-789-654', email: 'mounir.hafid@businesspro.ma', time: '8:50 AM', duration: '15m 20s', type: 'outgoing', status: 'completed', translated: true }
  ];

  const favoriteContacts = [
    { name: 'Anouar El Ghali', company: 'Enterprise Hub', phone: '+212 756-439-876', status: 'online' },
    { name: 'Ahmed Ait Ali', company: 'Smart Systems', phone: '+212 687-945-632', status: 'busy' },
    { name: 'Mounir Hafid', company: 'Tech Innovations', phone: '+212 745-231-793', status: 'offline' },
    { name: 'Maizzou Hanane', company: 'SQLI', phone: '+212 678-549-865', status: 'online' },
    { name: 'Kamal Belkadi', company: 'Innovation Labs', phone: '+212 655-987-321', status: 'online' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Voice Calls</h1>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowCallModal(true)}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-phone-fill w-4 h-4 flex items-center justify-center"></i>
            <span>New Voice Call</span>
          </button>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg px-8 py-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Calls</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
            <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center">
              <i className="ri-phone-fill text-blue-600 w-7 h-7 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg px-8 py-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Duration</p>
              <p className="text-3xl font-bold text-gray-900">4h 23m</p>
            </div>
            <div className="bg-green-50 w-14 h-14 rounded-lg flex items-center justify-center">
              <i className="ri-time-fill text-green-600 w-7 h-7 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg px-8 py-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Missed Calls</p>
              <p className="text-3xl font-bold text-gray-900">18</p>
            </div>
            <div className="bg-red-50 w-14 h-14 rounded-lg flex items-center justify-center">
              <i className="ri-close-circle-fill text-red-600 w-7 h-7 flex items-center justify-center"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call History */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Voice Call History</h2>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'recent' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Recent
                </button>
                <button
                  onClick={() => setActiveTab('missed')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === 'missed' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Missed
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      call.type === 'incoming' ? 'bg-green-100' : call.type === 'outgoing' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      <i className={`${
                        call.type === 'incoming' ? 'ri-arrow-down-line text-green-600' : 
                        call.type === 'outgoing' ? 'ri-arrow-up-line text-blue-600' : 'ri-close-line text-red-600'
                      } w-5 h-5 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{call.name}</p>
                        {call.translated && (
                          <div className="bg-purple-100 px-2 py-1 rounded-full">
                            <i className="ri-translate-2 text-purple-600 w-3 h-3 flex items-center justify-center"></i>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{call.company}</p>
                      <p className="text-sm text-gray-400">{call.phone}</p>
                      <p className="text-sm text-gray-400">{call.email}</p>
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
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer">
                        <i className="ri-phone-fill w-4 h-4 flex items-center justify-center"></i>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer">
                        <i className="ri-chat-3-fill w-4 h-4 flex items-center justify-center"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Favorite Contacts */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Favorite Contacts</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {favoriteContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-green-500' : 
                        contact.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.company}</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-purple-600 cursor-pointer">
                    <i className="ri-phone-fill w-4 h-4 flex items-center justify-center"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Call Modal */}
      {showCallModal && modalContainer && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Start New Call</h2>
              <button 
                onClick={() => setShowCallModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+212 661-234-567"
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@example.com"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="translation" className="rounded" />
                <label htmlFor="translation" className="text-sm text-gray-700">Enable AI Translation</label>
              </div>
              <div className="flex space-x-3">
                <button className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap">
                  Start Voice Call
                </button>
              </div>
            </div>
          </div>
        </div>,
        modalContainer
      )}
    </div>
  );
}
