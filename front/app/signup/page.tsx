'use client';

import { useState } from 'react';
import SignUpModal from './SignUpModal';

export default function SignUpPage() {
  const [isSignUpOpen, setIsSignUpOpen] = useState(true);

  const handleClose = () => {
    setIsSignUpOpen(false);
    // Optionnel : rediriger vers la page d'accueil si l'utilisateur ferme
    window.location.href = '/';
  };

  const handleSwitchToSignIn = () => {
    // Rediriger vers la page 
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <SignUpModal 
        isOpen={isSignUpOpen}
        onClose={handleClose}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </div>
  );
}