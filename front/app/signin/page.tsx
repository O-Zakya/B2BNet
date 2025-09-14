'use client';

import { useState } from 'react';
import SignInModal from './SignInModal';

export default function SignInPage() {
  const [isSignInOpen, setIsSignInOpen] = useState(true);

  const handleClose = () => {
    setIsSignInOpen(false);
    // Optionnel : rediriger vers la page d'accueil si l'utilisateur ferme
    window.location.href = '/';
  };

  const handleSwitchToSignUp = () => {
    // Rediriger vers la page signup
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignInModal 
        isOpen={isSignInOpen}
        onClose={handleClose}
        onSwitchToSignUp={handleSwitchToSignUp}
      />
    </div>
  );
}