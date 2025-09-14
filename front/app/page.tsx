'use client';

import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ServicesOverview from '../components/ServicesOverview';
import ServiceDetails from '../components/ServiceDetails';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
// Make sure the file exists at the specified path, or update the path if necessary
import SignInModal from './signin/SignInModal';
import SignUpModal from './signup/SignUpModal';

export default function Home() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const handleSignInClick = () => {
    setIsSignInModalOpen(true);
  };

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const handleSwitchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white max-w-[1400px] mx-auto">
      <Header onSignInClick={handleSignInClick} onGetStartedClick={handleSignUpClick} />
      <div className="pt-16">
        <HeroSection onGetStartedClick={handleSignUpClick} />
        <AboutSection />
        <ServicesOverview />
        <ServiceDetails onGetStartedClick={handleSignUpClick} />
        <FinalCTA />
        <Footer />
      </div>

      {/* Modals */}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToSignIn={handleSwitchToSignUp}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    </div>
  );
}
