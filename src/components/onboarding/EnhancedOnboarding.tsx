import React, { useState } from 'react';
import { HeroWelcome } from './HeroWelcome';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { toast } from 'sonner';

interface EnhancedOnboardingProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'signup' | 'login';

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
    // After successful signup, user goes directly to home
    toast.success("Welcome! 🙏 You're all set to begin your spiritual journey", { duration: 5000 });
    onComplete();
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
    
    default:
      return (
        <HeroWelcome 
          onSignup={() => setCurrentStep('signup')}
          onLogin={() => setCurrentStep('login')}
        />
      );
  }
};