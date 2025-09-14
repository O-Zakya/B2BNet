
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ContactsDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedContacts, setSelectedContacts] = useState<number[]>([]);
  const [modalContainer, setModalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalContainer(document.body);
  }, []);

  const contacts = [
    { id: 1, name: 'Maizzou Hanane', company: 'Tech Solutions', email: 'maizzou@techsolutions.com', phone: '+212 661-123-456', country: 'Morocco', status: 'online', language: 'Arabic', tags: ['Client', 'VIP'] },
    { id: 2, name: 'Anouar El Ghali', company: 'Global Dynamics', email: 'anouar@globaldynamics.com', phone: '+212 678-001-380', country: 'Morocco', status: 'busy', language: 'French', tags: ['Partner'] },
    { id: 3, name: 'Fatima El Mahdaoui', company: 'Innovation Labs', email: 'fatima@innovationlabs.ma', phone: '+212 655-123-456', country: 'Morocco', status: 'offline', language: 'Arabic', tags: ['Prospect'] },
    { id: 4, name: 'Ahmed Ait Ali', company: 'Business Pro', email: 'ahmed@businesspro.ma', phone: '+212 642-123-456', country: 'Morocco', status: 'online', language: 'English', tags: ['Client'] },
    { id: 5, name: 'Mohamed Allaoui', company: 'Enterprise Hub', email: 'mohamed@enterprisehub.ma', phone: '+212 667-987-654', country: 'Morocco', status: 'online', language: 'Arabic', tags: ['Partner', 'VIP'] },
    { id: 6, name: 'Tarik El Yazidi', company: 'Smart Systems', email: 'tarik@smartsystems.ma', phone: '+212 676-987-654', country: 'Morocco', status: 'busy', language: 'French', tags: ['Client'] }
  ];

  const toggleContactSelection = (id: number) => {
    setSelectedContacts(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Morocco': '🇲🇦',
      'France': '🇫🇷',
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'China': '🇨🇳',
      'Australia': '🇦🇺',
      'United Arab Emirates': '🇦🇪'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">{contacts.length} total contacts</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <i className="ri-grid-fill w-4 h-4 flex items-center justify-center"></i>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <i className="ri-list-check w-4 h-4 flex items-center justify-center"></i>
            </button>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2"
          >
            <i className="ri-user-add-fill w-4 h-4 flex items-center justify-center"></i>
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 flex items-center justify-center"></i>
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>All Tags</option>
            <option>VIP</option>
            <option>Client</option>
            <option>Partner</option>
            <option>Prospect</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option>All Countries</option>
            <option>Morocco</option>
            <option>France</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Canada</option>
            <option>Spain</option>
            <option>Germany</option>
            <option>China</option>
            <option>Australia</option>
            <option>United Arab Emirates</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-purple-700">
              {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-2">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                Export
              </button>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer whitespace-nowrap">
                Group Call
              </button>
              <button className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer whitespace-nowrap">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Display */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((contact) => (
                <div key={contact.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <p className="text-sm text-gray-500">{contact.company}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContactSelection(contact.id)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="ri-mail-fill w-4 h-4 flex items-center justify-center"></i>
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <i className="ri-phone-fill w-4 h-4 flex items-center justify-center"></i>
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="text-lg">{getCountryFlag(contact.country)}</span>
                      <span>{contact.language}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {contact.tags.map((tag, index) => (
                      <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer text-sm">
                      Call
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleContactSelection(contact.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-xs">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{contact.company}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{contact.email}</div>
                        <div>{contact.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(contact.country)}</span>
                        <span className="text-sm text-gray-600">{contact.language}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, index) => (
                          <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(contact.status)}`}></div>
                        <span className="text-sm text-gray-600 capitalize">{contact.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer">
                          <i className="ri-phone-fill w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer">
                          <i className="ri-chat-3-fill w-4 h-4 flex items-center justify-center"></i>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-purple-600 cursor-pointer">
                          <i className="ri-more-fill w-4 h-4 flex items-center justify-center"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && modalContainer && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Contact</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Select Country</option>
                  <option>Morocco</option>
                  <option>France</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Spain</option>
                  <option>Germany</option>
                  <option>China</option>
                  <option>Australia</option>
                  <option>United Arab Emirates</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Select Language</option>
                  <option>English</option>
                  <option>Chinese</option>
                  <option>Korean</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm cursor-pointer">
                    Client
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer">
                    Partner
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer">
                    Prospect
                  </button>
                  <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer">
                    VIP
                  </button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap">
                  Add Contact
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
