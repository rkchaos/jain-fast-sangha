import React, { useState } from 'react';
import { HeroWelcome } from './HeroWelcome';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { SanghaSelector } from './SanghaSelector';
import { toast } from 'sonner';

interface EnhancedOnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'signup' | 'login' | 'sangha';

export const EnhancedOnboarding: React.FC<EnhancedOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userData, setUserData] = useState<{
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  } | null>(null);

  const handleWelcome = () => {
    // This function is no longer needed since we have separate handlers
  };

  const handleSignup = (data: { name: string; phone: string; email: string; password: string; confirmPassword: string }) => {
    setUserData(data);
    // After successful signup, user is logged in automatically, go to sangha selection
    setCurrentStep('sangha');
    toast.success("Account created! Now let's find your Sangha community", { duration: 5000 });
  };

  const handleSanghaSelection = () => {
    toast.success("Welcome! 🙏 You're all set to begin your spiritual journey", { duration: 5000 });
    // Force navigation to complete the onboarding
    onComplete();
  };

  const handleBackToSignup = () => {
    setCurrentStep('signup');
  };

  switch (currentStep) {
    case 'welcome':
      return (
        <HeroWelcome 
          onSignup={() => setCurrentStep('signup')}
          onLogin={() => setCurrentStep('login')}
        />
      );
    
    case 'signup':
      return (
        <SignupForm 
          onSignup={handleSignup}
          onBack={() => setCurrentStep('welcome')}
          userData={userData}
        />
      );

    case 'login':
      return (
        <LoginForm
          onBack={() => setCurrentStep('welcome')}
          onSwitchToSignup={() => setCurrentStep('signup')}
        />
      );
    
    case 'sangha':
      return (
        <SanghaSelector
          onBack={handleBackToSignup}
          onComplete={handleSanghaSelection}
          userData={userData}
        />
      );
    
    default:
      return (
        <HeroWelcome 
          onSignup={() => setCurrentStep('signup')}
          onLogin={() => setCurrentStep('login')}
        />
      );
  }
};