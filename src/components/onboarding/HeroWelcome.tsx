import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroWelcomeProps {
  imageSrc?: string;
  headline?: string;
  subText?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  imageSrc = "/placeholder.svg",
  headline = "Jai Jinendra — Welcome to your Sangha",
  subText = "A simple place to track your fasting, join your sangha and follow Paryushan.",
  ctaText = "Begin",
  onCtaClick
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

        {/* CTA Button */}
        <Button 
          size="xl" 
          className="w-full rounded-full bg-gradient-sacred hover:shadow-floating transition-all duration-300" 
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};