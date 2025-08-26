import React, { useState } from 'react';
import { HeroWelcome } from './HeroWelcome';
import { SignupForm } from './SignupForm';

import { SanghaSelector } from './SanghaSelector';
import { toast } from 'sonner';

interface EnhancedOnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'signup' | 'sangha';

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userData, setUserData] = useState<{
    name?: string;
    phone?: string;
    email?: string;
  }>({});

  const handleWelcome = () => {
    setCurrentStep('signup');
  };

  const handleSignup = (data: { name: string; phone: string; email: string }) => {
    setUserData(data);
    setCurrentStep('sangha');
    toast.success("Account created! Now let's find your Sangha community");
  };

  const handleJoinSangha = (sanghaId: string) => {
    toast.success("Welcome to Jain Sangha! 🙏 You're all set to begin your spiritual journey");
    setTimeout(onComplete, 1500);
  };

  const handleCreateSangha = (sangha: { name: string; privacy: 'public' | 'private'; description?: string }) => {
    toast.success(`${sangha.name} created! 🎉 Your new Sangha is ready. Invite others to join!`);
    setTimeout(onComplete, 1500);
  };

  switch (currentStep) {
    case 'welcome':
      return <HeroWelcome onCtaClick={handleWelcome} />;
    
    case 'signup':
      return (
        <SignupForm 
          onSignup={handleSignup}
          onBack={() => setCurrentStep('welcome')}
        />
      );
    
    case 'sangha':
      return (
        <SanghaSelector
          userId="new-user"
          onJoin={handleJoinSangha}
          onCreate={handleCreateSangha}
        />
      );
    
    default:
      return <HeroWelcome onCtaClick={handleWelcome} />;
  }
};