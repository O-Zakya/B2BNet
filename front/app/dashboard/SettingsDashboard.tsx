'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  country: string;
  language: string;
  profilePhoto: string;
}

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<UserData>({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    phone: '',
    country: '',
    language: '',
    profilePhoto: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    calls: true,
    messages: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'ri-user-fill' },
    { id: 'communication', label: 'Communication', icon: 'ri-phone-fill' },
    { id: 'translation', label: 'Translation', icon: 'ri-translate-2' },
    { id: 'notifications', label: 'Notifications', icon: 'ri-notification-fill' },
    { id: 'security', label: 'Security', icon: 'ri-shield-fill' },
    { id: 'billing', label: 'Billing', icon: 'ri-bank-card-fill' }
  ];

  // ✅ Charger les données utilisateur au montage du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      const response = await axios.get('http://localhost:5000/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📊 Données utilisateur chargées:', response.data);

      setUserData({
        id: response.data.id,
        email: response.data.email || '',
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        jobTitle: response.data.jobTitle || '',
        phone: response.data.phone || '',
        country: response.data.country || '',
        language: response.data.language || '',
        profilePhoto: response.data.profilePhoto || ''
      });
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sauvegarder les modifications du profil
  const saveProfileChanges = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      const response = await axios.put('http://localhost:5000/user/profile', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        jobTitle: userData.jobTitle,
        phone: userData.phone,
        country: userData.country,
        language: userData.language
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Profil mis à jour:', response.data);
      alert('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Gérer le changement de photo de profil
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('Le fichier est trop volumineux (max 5MB)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        console.error('Aucun token trouvé');
        return;
      }

      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await axios.post('http://localhost:5000/user/upload-photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('✅ Photo uploadée:', response.data);
      
      // Mettre à jour l'état local avec la nouvelle photo
      setUserData(prev => ({
        ...prev,
        profilePhoto: response.data.profilePhoto
      }));

      alert('Photo de profil mise à jour avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      alert('Erreur lors de l\'upload de la photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({...prev, [key]: !prev[key as keyof typeof prev]}));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Section photo de profil */}
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-4 border-purple-200">
                {userData.profilePhoto ? (
                  <img
                    src={`http://localhost:5000/uploads/${userData.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.initials-fallback')) {
                        const initialsSpan = document.createElement('span');
                        initialsSpan.className = 'initials-fallback text-purple-600 font-semibold text-xl';
                        initialsSpan.textContent = `${userData.firstName[0] || ''}${userData.lastName[0] || ''}`.toUpperCase();
                        parent.appendChild(initialsSpan);
                      }
                    }}
                  />
                ) : (
                  <span className="text-purple-600 font-semibold text-xl">
                    {`${userData.firstName[0] || ''}${userData.lastName[0] || ''}`.toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                </button>
                <p className="text-sm text-gray-500 mt-2">Upload a professional photo for your profile (Max 5MB)</p>
              </div>
            </div>

            {/* Formulaire de profil */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Entrez votre prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Entrez votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                  title="L'email ne peut pas être modifié"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Entrez votre numéro de téléphone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <select
                  value={userData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  <option value="MA">Morocco</option>
                  <option value="FR">France</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="ES">Spain</option>
                  <option value="DE">Germany</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={userData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Entrez votre titre de poste"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={userData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Français">Français</option>
                <option value="العربية">العربية</option>
                <option value="Español">Español</option>
                <option value="Deutsch">Deutsch</option>
              </select>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Auto-answer calls</label>
                    <p className="text-sm text-gray-500">Automatically answer incoming calls after 3 rings</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Call recording</label>
                    <p className="text-sm text-gray-500">Automatically record all calls for quality purposes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">HD Audio</label>
                    <p className="text-sm text-gray-500">Enable high-definition audio quality</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Camera</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Built-in Camera</option>
                    <option>External Webcam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>HD (720p)</option>
                    <option>Full HD (1080p)</option>
                    <option>4K (2160p)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audio Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Microphone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Built-in Microphone</option>
                    <option>Headset Microphone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Built-in Speakers</option>
                    <option>Headphones</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-3 mb-4">
                <i className="ri-translate-2 text-purple-600 w-6 h-6 flex items-center justify-center"></i>
                <h3 className="text-lg font-semibold text-gray-900">AI Translation Settings</h3>
              </div>
              <p className="text-gray-600">Configure your real-time translation preferences</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                  <option>Japanese</option>
                  <option>Korean</option>
                </select>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Auto-Translation</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Voice calls</label>
                      <p className="text-sm text-gray-500">Automatically translate during voice calls</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Video calls</label>
                      <p className="text-sm text-gray-500">Show subtitles during video calls</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="font-medium text-gray-700">Chat messages</label>
                      <p className="text-sm text-gray-500">Auto-translate incoming messages</p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Email notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.email}
                    onChange={() => toggleNotification('email')}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Push notifications</label>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.push}
                    onChange={() => toggleNotification('push')}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">SMS notifications</label>
                    <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.sms}
                    onChange={() => toggleNotification('sms')}
                    className="rounded" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Incoming calls</label>
                    <p className="text-sm text-gray-500">Get notified of incoming calls</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.calls}
                    onChange={() => toggleNotification('calls')}
                    className="rounded" 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">New messages</label>
                    <p className="text-sm text-gray-500">Get notified of new chat messages</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.messages}
                    onChange={() => toggleNotification('messages')}
                    className="rounded" 
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <i className="ri-shield-check-fill text-red-600 w-6 h-6 flex items-center justify-center"></i>
                <h3 className="text-lg font-semibold text-red-900">Security Status</h3>
              </div>
              <p className="text-red-700">Your account is secure with 2FA enabled</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Professional Plan</h3>
                  <p className="text-gray-600">Unlimited calls, video meetings, and AI translation</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">$29</p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${tab.icon} w-5 h-5 flex items-center justify-center`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            {renderTabContent()}
            
            {/* Boutons de sauvegarde (uniquement pour le profil) */}
            {activeTab === 'profile' && (
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={fetchUserData}
                  className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveProfileChanges}
                  disabled={saving}
                  className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-violet-700 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}