import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DateHeader } from './DateHeader';
import { FestivalWidget } from './FestivalWidget';
import { StreakDiagram } from './StreakDiagram';
import { CheckInModal } from './CheckInModal';
import { Leaderboard } from './Leaderboard';
import { AdCarousel } from './AdCarousel';
import { InterstitialAd } from './InterstitialAd';
import { toast } from '@/components/ui/use-toast';

// Festival content based on copy tokens
const festivalMessages = [
  { date: "Day 1", title: "Das Lakshan: Uttam Ahimsa", virtue: "Practice non-violence in thought, word and deed." },
  { date: "Day 2", title: "Das Lakshan: Uttam Satya", virtue: "Speak truth kindly and with purpose." },
  { date: "Day 3", title: "Das Lakshan: Uttam Asteya", virtue: "Respect others' possessions—practice contentment." },
  { date: "Day 4", title: "Das Lakshan: Uttam Brahmacharya", virtue: "Practice restraint and mindful living." },
  { date: "Day 5", title: "Das Lakshan: Uttam Kshama", virtue: "Forgive freely—release the burden of anger." },
];

const currentFestival = festivalMessages[0]; // For demo

interface CheckInData {
  type: string;
  note?: string;
  timestamp: Date;
}

export const TodayPage: React.FC = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [currentCheckIn, setCurrentCheckIn] = useState<CheckInData | null>(null);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [streak, setStreak] = useState(7);

  const handleCheckIn = (data: { type: string; note?: string }) => {
    const checkInData: CheckInData = {
      ...data,
      timestamp: new Date()
    };
    
    setCurrentCheckIn(checkInData);
    setCheckedIn(true);
    
    toast({
      title: "Vrat Started! 🙏",
      description: `Your ${data.type} vrat has begun. Stay mindful and strong.`,
    });
  };

  const handleCheckOut = (completed: boolean = true) => {
    if (currentCheckIn) {
      setCheckedIn(false);
      if (completed) {
        setStreak(prev => prev + 1);
      }
      setCurrentCheckIn(null);
      
      toast({
        title: completed ? "Vrat Completed! ✨" : "Progress Recorded",
        description: completed 
          ? `Congratulations! Your ${currentCheckIn.type} vrat is complete. Your streak is now ${streak + (completed ? 1 : 0)} days.`
          : "Wasn't able to complete but I am proud of myself for trying. Every effort counts on this spiritual journey.",
      });
    }
  };

  const handleViewHistory = () => {
    // Navigate to retrospective/history view
    toast({
      title: "Coming Soon",
      description: "History view will be available soon",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Date Header */}
      <DateHeader />

      {/* Festival Widget */}
      <FestivalWidget
        date={currentFestival.date}
        title={currentFestival.title}
        virtue={currentFestival.virtue}
        description="Today's teaching focuses on the fundamental principle of non-violence, extending beyond physical harm to include thoughts and words that may cause suffering to any living being."
      />

      {/* Advertisement Carousel */}
      <AdCarousel ads={[
        { id: 'ad-1', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/puja-kit', alt: 'Puja Kit' },
        { id: 'ad-2', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/books', alt: 'Jain Books' },
        { id: 'ad-3', mediaUrl: '/placeholder.svg', targetUrl: 'https://example.com/retreat', alt: 'Spiritual Retreat' }
      ]} />

      {/* Check-in Section */}
      <div className="space-y-4">
        {!checkedIn ? (
          <Button 
            size="xl"
            className="w-full bg-gradient-sacred hover:shadow-floating transform hover:scale-105 transition-all duration-300"
            onClick={() => setShowCheckInModal(true)}
          >
            Check in
          </Button>
        ) : (
          <div className="space-y-3">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-primary mb-1">
                {currentCheckIn?.type} Vrat in Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Started at {currentCheckIn?.timestamp.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              {currentCheckIn?.note && (
                <p className="text-sm text-foreground mt-2 italic">
                  "{currentCheckIn.note}"
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                size="lg"
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => handleCheckOut(true)}
              >
                Completed Successfully ✨
              </Button>
              <Button 
                size="sm"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => handleCheckOut(false)}
              >
                Couldn't complete, but I tried
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <StreakDiagram 
        userId="current-user"
        currentStreak={streak}
        onViewHistory={handleViewHistory}
      />

      {/* Check-in Modal */}
      <CheckInModal
        visible={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onSubmit={handleCheckIn}
      />

      {/* Interstitial Ad */}
      <InterstitialAd
        ad={{
          id: 'interstitial-1',
          mediaUrl: '/placeholder.svg',
          targetUrl: 'https://example.com/special-offer',
          alt: 'Special Spiritual Retreat Offer'
        }}
        frequencyMins={10} // Show every 10 minutes for demo
        enabled={true}
      />
    </div>
  );
};