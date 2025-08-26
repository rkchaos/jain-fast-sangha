import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateHeader } from './DateHeader';
import { FestivalWidget } from './FestivalWidget';
import { StreakDiagram } from './StreakDiagram';
import { CheckInModal } from './CheckInModal';
import { Leaderboard } from './Leaderboard';
import { AdCarousel } from './AdCarousel';
import { InterstitialAd } from './InterstitialAd';
import { PastEntryModal } from '../calendar/PastEntryModal';
import { toast } from '@/components/ui/use-toast';
import { CalendarIcon } from 'lucide-react';

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
  const [showPastEntryModal, setShowPastEntryModal] = useState(false);
  const [isPastDate, setIsPastDate] = useState(false);
  const [selectedPastDate, setSelectedPastDate] = useState<Date | undefined>();
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

  const handlePastEntry = (data: { type: string; completed: boolean }) => {
    if (selectedPastDate) {
      toast({
        title: data.completed ? "Past Entry Saved! ✨" : "Past Entry Recorded",
        description: data.completed 
          ? `Your ${data.type} vrat on ${selectedPastDate.toLocaleDateString()} has been marked as completed.`
          : `Your ${data.type} attempt on ${selectedPastDate.toLocaleDateString()} has been recorded. Every effort counts!`
      });
    }
  };

  const handleCheckInClick = () => {
    if (isPastDate && selectedPastDate) {
      setShowPastEntryModal(true);
    } else {
      setShowCheckInModal(true);
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
          <div className="space-y-3">
            {/* Past Date Option */}
            <div className="flex items-center space-x-3 p-3 bg-accent/20 rounded-lg">
              <Checkbox 
                id="past-date"
                checked={isPastDate}
                onCheckedChange={(checked) => setIsPastDate(checked as boolean)}
              />
              <Label htmlFor="past-date" className="cursor-pointer">
                Record past vrat (retrospective entry)
              </Label>
            </div>

            {/* Past Date Picker */}
            {isPastDate && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedPastDate ? selectedPastDate.toLocaleDateString() : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedPastDate}
                    onSelect={setSelectedPastDate}
                    disabled={(date) => {
                      const today = new Date();
                      const oneMonthAgo = new Date();
                      oneMonthAgo.setMonth(today.getMonth() - 1);
                      return date >= today || date < oneMonthAgo;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            <Button 
              size="xl"
              className="w-full bg-gradient-sacred hover:shadow-floating transform hover:scale-105 transition-all duration-300"
              onClick={handleCheckInClick}
              disabled={isPastDate && !selectedPastDate}
            >
              {isPastDate ? "Record Past Vrat" : "Check in"}
            </Button>
          </div>
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

      {/* Past Entry Modal */}
      {selectedPastDate && (
        <PastEntryModal
          visible={showPastEntryModal}
          onClose={() => setShowPastEntryModal(false)}
          onSubmit={handlePastEntry}
          selectedDate={selectedPastDate}
        />
      )}

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