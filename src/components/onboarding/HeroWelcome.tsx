import React from 'react';
import { Button } from '@/components/ui/button';
interface HeroWelcomeProps {
  imageSrc?: string;
  headline?: string;
  subText?: string;
  onSignup?: () => void;
  onLogin?: () => void;
}
import mahavir from '@/assets/mahavir-swami.png';
export const HeroWelcome: React.FC<HeroWelcomeProps> = ({
  imageSrc = mahavir,
  headline = "Tapasya Tracker",
  subText = "Jai Jinendra - A simple place to track your fasting, join your sangha",
  onSignup,
  onLogin
}) => {
  return <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-dawn">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Hero Image */}
        <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden shadow-sacred">
          <img src={imageSrc} alt="Jain Sangha Welcome" className="w-full max-h-full object-cover " />
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-foreground leading-tight" style={{
        fontFamily: 'Merriweather, serif'
      }}>
          {headline}
        </h1>
        
        {/* Hindi Text */}
        <p className="text-sm text-primary font-medium" style={{
        fontFamily: 'Inter, sans-serif'
      }}>
          जिन धर्म: जियो और जीने दो
        </p>

        {/* Sub Text */}
        <p className="text-lg text-muted-foreground leading-relaxed" style={{
        fontFamily: 'Inter, sans-serif'
      }}>
          {subText}
        </p>
        
        {/* Trial Note */}
        <div className="bg-accent/20 border border-accent/30 rounded-lg p-3 text-sm text-muted-foreground">
          <p className="text-center leading-relaxed">
            🙏 This is a trial to see if this app is useful for our community. 
            It may be slow as we use web email links instead of OTP. 
            We appreciate your patience and feedback as we improve.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Button size="xl" className="w-full rounded-full bg-gradient-sacred hover:shadow-floating transition-all duration-300" onClick={onSignup}>
            Create Account
          </Button>
          
          <Button variant="outline" size="xl" className="w-full rounded-full" onClick={onLogin}>
            Login
          </Button>
          
          <Button variant="ghost" size="sm" className="w-full text-primary hover:text-primary/80" onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScA1d2Zj2yLi1VzbqOYoKVea7B4-MmtHsq1pngRQWipsU1RXQ/viewform?usp=sharing&ouid=110568833292812051355', '_blank')}>
            📝 Share Feedback Instead
          </Button>
        </div>
      </div>
    </div>;
};