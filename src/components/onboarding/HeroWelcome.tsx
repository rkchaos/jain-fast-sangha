import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroWelcomeProps {
  imageSrc?: string;
  headline?: string;
  subText?: string;
  onSignup?: () => void;
  onLogin?: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  imageSrc = "/placeholder.svg",
  headline = "Jai Jinendra — Welcome to your Sangha",
  subText = "A simple place to track your fasting, join your sangha and follow Paryushan.",
  onSignup,
  onLogin
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-dawn">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Hero Image */}
        <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-sacred">
          <img 
            src={imageSrc} 
            alt="Jain Sangha Welcome" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-foreground leading-tight" style={{ fontFamily: 'Merriweather, serif' }}>
          {headline}
        </h1>

        {/* Sub Text */}
        <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
          {subText}
        </p>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button 
            size="xl" 
            className="w-full rounded-full bg-gradient-sacred hover:shadow-floating transition-all duration-300" 
            onClick={onSignup}
          >
            Create Account
          </Button>
          
          <Button 
            variant="outline"
            size="xl" 
            className="w-full rounded-full" 
            onClick={onLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};