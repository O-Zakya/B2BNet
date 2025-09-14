'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../../components/Modal';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSwitchToSignIn }: SignUpModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailNotification, setShowEmailNotification] = useState(false);
  const [showPhoneNotification, setShowPhoneNotification] = useState(false);
  const [emailCodeInput, setEmailCodeInput] = useState('');
  const [phoneCodeInput, setPhoneCodeInput] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    country: '',
    language: '',
    emailCode: '',
    phoneCode: '',
    password: '',
    confirmPassword: ''
  });

  const countries = [
    { code: 'FR', name: 'France', flag: '🇫🇷', language: 'Français' },
    { code: 'US', name: 'United States', flag: '🇺🇸', language: 'English' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', language: 'English' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', language: 'Deutsch' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', language: 'Español' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', language: 'Italiano' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', language: 'English/Français' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', language: 'English' }
  ];

  const handleCountrySelect = (country: { code: string; name: string; flag: string; language: string }) => {
    setFormData({
      ...formData,
      country: country.code,
      language: country.language
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      setEmailVerified(true);
      setShowEmailNotification(true);
      setTimeout(() => {
        setShowEmailNotification(false);
        setCurrentStep(currentStep + 1);
      }, 2000);
      return;
    }
    if (currentStep === 4) {
      setPhoneVerified(true);
      setShowPhoneNotification(true);
      setTimeout(() => {
        setShowPhoneNotification(false);
        setCurrentStep(currentStep + 1);
      }, 2000);
      return;
    }
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // ✅ FONCTION CORRIGÉE POUR L'ENVOI AU BACKEND
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      // Créer FormData pour supporter l'upload de fichier
      const submitFormData = new FormData();
      
      // Ajouter tous les champs texte
      submitFormData.append('firstName', formData.firstName);
      submitFormData.append('lastName', formData.lastName);
      submitFormData.append('jobTitle', formData.jobTitle);
      submitFormData.append('email', formData.email);
      submitFormData.append('phone', formData.phone);
      submitFormData.append('country', formData.country);
      submitFormData.append('language', formData.language);
      submitFormData.append('password', formData.password);
      
      // Ajouter la photo si elle existe
      if (profilePhoto) {
        submitFormData.append('profilePhoto', profilePhoto);
      }

      // ✅ REQUÊTE VERS TON BACKEND
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        body: submitFormData, // Pas de Content-Type, le navigateur l'ajoute automatiquement pour FormData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Inscription réussie:', result.message);
        router.push('/dashboard');
        onClose();
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      setError('Impossible de se connecter au serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="e.g. CEO, Manager, Entrepreneur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">Use your business email address</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                placeholder="Your phone number"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full p-3 border rounded-lg text-left transition-all cursor-pointer ${
                    formData.country === country.code
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium text-sm text-gray-800">{country.name}</span>
                    </div>
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{country.language}</span>
                  </div>
                </button>
              ))}
            </div>

            {formData.country && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium text-sm">
                  Selected Country: {countries.find(c => c.code === formData.country)?.name}
                </p>
                <p className="text-green-700 text-xs">
                  Language: {formData.language}
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-purple-100/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-lg">
              <i className="ri-mail-line text-purple-600 w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Verify Your Email</h2>
              <p className="text-gray-600 text-sm">
                We've sent a verification code to<br />
                <span className="font-semibold text-gray-900">{formData.email}</span>
              </p>
            </div>

            {emailVerified ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <i className="ri-check-line text-green-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-600 mb-2">Email Verified!</h3>
                  <p className="text-gray-600 text-sm">Proceeding to SMS verification...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={emailCodeInput[i] || ''}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                      onChange={(e) => {
                        const newCode = emailCodeInput.split('');
                        newCode[i] = e.target.value;
                        setEmailCodeInput(newCode.join(''));
                        
                        if (e.target.value && i < 5) {
                          const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Didn't receive the code? <button className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">Resend</button>
                </p>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-purple-100/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto shadow-lg">
              <i className="ri-phone-line text-purple-600 w-8 h-8 flex items-center justify-center"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Phone</h2>
              <p className="text-gray-600">
                We've sent a verification code to<br />
                <span className="font-semibold text-gray-900">{formData.phone}</span>
              </p>
            </div>

            {phoneVerified ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <i className="ri-check-line text-green-600 w-8 h-8 flex items-center justify-center"></i>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-600 mb-2">Phone Verified!</h3>
                  <p className="text-gray-600 text-sm">Creating your account...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={phoneCodeInput[i] || ''}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                      onChange={(e) => {
                        const newCode = phoneCodeInput.split('');
                        newCode[i] = e.target.value;
                        setPhoneCodeInput(newCode.join(''));
                        
                        if (e.target.value && i < 5) {
                          const nextInput = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Didn't receive the code? <button className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">Resend</button>
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-camera-line text-purple-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Photo</h2>
              <p className="text-gray-600">Add a profile photo to personalize your account (optional)</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {profilePhotoPreview ? (
                    <img
                      src={profilePhotoPreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-purple-100 flex items-center justify-center">
                      <i className="ri-user-line text-gray-400 w-12 h-12"></i>
                    </div>
                  )}
                  {profilePhotoPreview && (
                    <button
                      onClick={() => {
                        setProfilePhoto(null);
                        setProfilePhotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <i className="ri-close-line w-4 h-4"></i>
                    </button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    <i className="ri-upload-2-line w-4 h-4 mr-2"></i>
                    Choose Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 text-center">
                    Maximum file size: 5MB<br />
                    Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-lock-line text-purple-600 w-8 h-8 flex items-center justify-center"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Password</h2>
              <p className="text-gray-600">Almost done! Create a secure password for your account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Password must contain:</p>
                <ul className="space-y-1">
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    <span>One uppercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <i className="ri-check-line text-green-600 w-4 h-4 flex items-center justify-center"></i>
                    <span>One number</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Personal Info',
    'Country',
    'Email Verification',
    'SMS Verification',
    'Profile Photo',
    'Password'
  ];

  return (
    <>
      {/* Success Notifications - Positioned at top right of screen */}
      {showEmailNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-bounce">
          <div className="flex items-center space-x-2">
            <i className="ri-check-line w-5 h-5"></i>
            <span className="text-sm font-medium">Email verified!</span>
          </div>
        </div>
      )}
      
      {showPhoneNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-bounce">
          <div className="flex items-center space-x-2">
            <i className="ri-check-line w-5 h-5"></i>
            <span className="text-sm font-medium">Phone verified!</span>
          </div>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>

      {/* Header avec logo et croix */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-lg font-bold text-purple-600" style={{ fontFamily: 'AR One Sans, sans-serif' }}>
          B2BNet
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-full transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Titre centré */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Create your business account</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step < currentStep ? 'bg-purple-600 text-white' :
                step === currentStep ? 'bg-purple-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center leading-tight">
                {stepTitles[step - 1]}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-purple-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* ✅ AFFICHAGE DES ERREURS */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-end items-center mt-6">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
              >
                Previous
              </button>
            )}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-lg disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-lg disabled:opacity-50 flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Sign In Link en bas centré */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <button 
            onClick={onSwitchToSignIn}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </Modal>
    </>
  );
}