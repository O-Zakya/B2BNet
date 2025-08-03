'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface DashboardHeaderProps {
  setActiveView?: (view: string) => void;
}

export default function DashboardHeader({ setActiveView }: DashboardHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('US');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoto, setUserPhoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

  const languages = [
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', lang: 'AR' },
    { code: 'FR', name: 'France', flag: '🇫🇷', lang: 'FR' },
    { code: 'US', name: 'United States', flag: '🇺🇸', lang: 'EN' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', lang: 'EN' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', lang: 'EN' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', lang: 'ES' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', lang: 'DE' },
    { code: 'CN', name: 'China', flag: '🇨🇳', lang: 'CN' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', lang: 'EN' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', lang: 'AR' }
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('userToken');
        
        if (!token) {
          console.error('Aucun token trouvé');
          setUserName('Utilisateur');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('🔍 Réponse complète du serveur:', res.data);

        // ✅ Construction du nom complet avec gestion des valeurs nulles
        const firstName = res.data.firstName || '';
        const lastName = res.data.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Utilisateur';
        
        setUserName(fullName);
        setUserEmail(res.data.email || '');
        
        // ✅ CORRECTION: Construction simple du chemin de l'image
        if (res.data.profilePhoto) {
          setUserPhoto(res.data.profilePhoto);
          console.log('📸 Photo configurée:', {
            filename: res.data.profilePhoto,
            fullURL: `http://localhost:5000/uploads/${res.data.profilePhoto}`
          });
        } else {
          console.log('❌ Aucune photo de profil trouvée dans la réponse');
        }
        
      } catch (err: any) {
        console.error('❌ Erreur lors du chargement de l\'utilisateur :', err);
        
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          router.push('/signin');
        }
        
        setUserName('Utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage) || languages[2];
  };

  // ✅ Fonction pour initier la déconnexion (affiche la confirmation)
  const initiateSignOut = () => {
    setShowSignOutConfirmation(true);
  };

  // ✅ Fonction pour confirmer la déconnexion
  const confirmSignOut = () => {
    try {
      console.log('🚪 Déconnexion confirmée...');
      
      // Supprimer les données de session
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      console.log('✅ Session terminée');
      
      // Fermer tous les dropdowns
      setShowProfile(false);
      setShowSignOutConfirmation(false);
      
      // Rediriger vers la page de connexion
      router.push('/');
      
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
    }
  };

  // ✅ Fonction pour annuler la déconnexion
  const cancelSignOut = () => {
    setShowSignOutConfirmation(false);
  };

  const handleProfileSettings = () => {
    if (setActiveView) {
      setActiveView('settings');
    }
    setShowProfile(false);
  };

  const handleSettings = () => {
    if (setActiveView) {
      setActiveView('settings');
    }
    setShowProfile(false);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Chargement...' : `Welcome back, ${userName}`}
          </h2>
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-sm font-medium">Online</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-2xl">{getCurrentLanguage().flag}</span>
              <span className="text-xs font-medium text-gray-700">{getCurrentLanguage().lang}</span>
              <i className="ri-arrow-down-s-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        setSelectedLanguage(language.code);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center space-x-3"
                    >
                      <span className="text-lg">{language.flag}</span>
                      <div>
                        <span className="font-medium">{language.lang}</span>
                        <span className="text-gray-500 ml-2">{language.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
            >
              <i className="ri-notification-3-fill w-6 h-6 flex items-center justify-center"></i>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">New message from Maizzou Hanane</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Call scheduled for 3 PM</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Meeting scheduled for tomorrow</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border-2 border-purple-200">
                {userPhoto ? (
                  <>
                    <img
                      src={`http://localhost:5000/uploads/${userPhoto}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Erreur chargement image:', `http://localhost:5000/uploads/${userPhoto}`);
                        const target = e.target as HTMLImageElement;
                        const parent = target.parentElement;
                        if (parent) {
                          target.style.display = 'none';
                          if (!parent.querySelector('.initials-fallback')) {
                            const initialsSpan = document.createElement('span');
                            initialsSpan.className = 'initials-fallback text-purple-600 font-semibold text-sm';
                            initialsSpan.textContent = getInitials(userName);
                            parent.appendChild(initialsSpan);
                          }
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ Image chargée avec succès:', `http://localhost:5000/uploads/${userPhoto}`);
                      }}
                    />
                  </>
                ) : (
                  <span className="text-purple-600 font-semibold text-sm">
                    {getInitials(userName)}
                  </span>
                )}
              </div>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-900">{userName || 'Utilisateur'}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={handleProfileSettings}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center space-x-2"
                  >
                    <i className="ri-user-settings-line w-4 h-4"></i>
                    <span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={handleSettings}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center space-x-2"
                  >
                    <i className="ri-settings-3-line w-4 h-4"></i>
                    <span>Settings</span>
                  </button>
                  <hr className="my-2" />
                  
                {!showSignOutConfirmation ? (
                  <button
                    onClick={initiateSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer flex items-center space-x-2 transition-colors"
                  >
                    <i className="ri-logout-box-line w-4 h-4"></i>
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded">
                    <p className="text-xs text-gray-700 mb-3 font-medium">
                      Are you sure you want to sign out?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={confirmSignOut}
                        className="flex-1 px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 transition-colors font-medium"
                      >
                        Yes, sign out
                      </button>
                      <button
                        onClick={cancelSignOut}
                        className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}