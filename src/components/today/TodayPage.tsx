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
import { PastEntryModal } from '../calendar/PastEntryModal';
import { CalendarIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useVratRecords } from '@/hooks/useVratRecords';
import { VratType, VratStatus } from '@/types/database';
import { toast } from 'sonner';

import prayingHands from '@/assets/praying_hands.png';

// Jain Dharma information content
const jainDharmaInfo = {
  date: "Jain Dharma",
  title: "Why Tapasya (Fasting)?",
  virtue: "Tapasya purifies the soul, builds self-discipline, and develops compassion for all living beings.",
  description: "Fasting is a fundamental practice in Jainism that helps control desires, purify thoughts, and advance on the spiritual path. This app launched during Paryushan and Das Lakshan 2025 to help the community practice and track their spiritual journey. We welcome your feedback as we grow together."
};

interface CheckInData {
  type: string;
  note?: string;
  timestamp: Date;
}

export const TodayPage: React.FC = () => {
  const { user } = useAuth();
  const { todayRecord, streak, createVratRecord, updateVratRecord, loading } = useVratRecords();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showPastEntryModal, setShowPastEntryModal] = useState(false);
  const [isPastDate, setIsPastDate] = useState(false);
  const [selectedPastDate, setSelectedPastDate] = useState<Date | undefined>();

  const isCheckedIn = todayRecord && !['success', 'tried', 'fail'].includes(todayRecord.status);
  const hasCompletedToday = todayRecord && ['success', 'tried', 'fail'].includes(todayRecord.status);

  const handleCheckIn = async (data: { type: string; note?: string }) => {
    try {
      await createVratRecord(
        data.type as VratType,
        'success', // Start as in-progress, will be updated on completion
        data.note
      );
      
      toast.success(`${data.type} vrat started! 🙏 Stay mindful and strong.`);
    } catch (error) {
      toast.error('Failed to start vrat. Please try again.');
    }
  };

  const handleCheckOut = async (completed: boolean = true) => {
    if (!todayRecord) return;

    try {
      const status: VratStatus = completed ? 'success' : 'tried';
      await updateVratRecord(todayRecord.id, status);
      
      toast.success(
        completed 
          ? `Vrat completed! ✨ Your streak is now ${streak + 1} days.`
          : "Progress recorded. Every effort counts on this spiritual journey."
      );
    } catch (error) {
      toast.error('Failed to update vrat. Please try again.');
    }
  };

  const handlePastEntry = async (data: { type: string; completed: boolean }) => {
    if (!selectedPastDate) return;

    try {
      const status: VratStatus = data.completed ? 'success' : 'tried';
      await createVratRecord(
        data.type as VratType,
        status,
        undefined,
        selectedPastDate.toISOString().split('T')[0],
        true
      );

      toast.success(
        data.completed 
          ? `Past ${data.type} vrat recorded as completed! ✨`
          : `Past ${data.type} attempt recorded. Every effort counts!`
      );
      
      setShowPastEntryModal(false);
      setSelectedPastDate(undefined);
      setIsPastDate(false);
    } catch (error) {
      toast.error('Failed to record past entry. Please try again.');
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
    toast.success('Check your Calendar tab for detailed history');
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Date Header */}
      <DateHeader />

      {/* Jain Dharma Info Widget */}
      <FestivalWidget
        date={jainDharmaInfo.date}
        title={jainDharmaInfo.title}
        virtue={jainDharmaInfo.virtue}
        description={jainDharmaInfo.description}
      />

      {/* Feedback Button */}
      <Button 
        variant="outline" 
        className="w-full mb-4"
        onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScA1d2Zj2yLi1VzbqOYoKVea7B4-MmtHsq1pngRQWipsU1RXQ/viewform?usp=sharing&ouid=110568833292812051355', '_blank')}
      >
        📝 Share Your Feedback
      </Button>

      {/* Praying Hands Image */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-sacred">
          <img 
            src={prayingHands} 
            alt="Praying Hands" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Check-in Section */}
      <div className="space-y-4">
        {!isCheckedIn && !hasCompletedToday ? (
          <div className="space-y-3">
            {/* Past Date Option - More Prominent */}
            <div className="flex items-center space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Checkbox 
                id="past-date"
                checked={isPastDate}
                onCheckedChange={(checked) => setIsPastDate(checked as boolean)}
                className="h-5 w-5"
              />
              <Label htmlFor="past-date" className="cursor-pointer text-base font-medium text-blue-800">
                📅 Record past vrat (retrospective entry)
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
                      today.setHours(0, 0, 0, 0); // Reset time to compare only dates
                      const selectedDateTime = new Date(date);
                      selectedDateTime.setHours(0, 0, 0, 0);
                      
                      const oneMonthAgo = new Date();
                      oneMonthAgo.setMonth(today.getMonth() - 1);
                      
                      // Disable future dates and dates older than 1 month
                      return selectedDateTime >= today || selectedDateTime < oneMonthAgo;
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
                {todayRecord?.vrat_type} Vrat in Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Started at {new Date(todayRecord?.created_at || '').toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              {todayRecord?.note && (
                <p className="text-sm text-foreground mt-2 italic">
                  "{todayRecord.note}"
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
    </div>
  );
};