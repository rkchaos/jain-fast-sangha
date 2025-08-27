import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trophy, TrendingUp, Plus } from 'lucide-react';
import { RetrospectiveTab } from './RetrospectiveTab';
import { PastEntryModal } from './PastEntryModal';
import { toast } from '@/components/ui/use-toast';
import { useVratRecords } from '@/hooks/useVratRecords';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CalendarEvent {
  date: Date;
  type: 'vrat' | 'festival' | 'custom';
  title: string;
  completed?: boolean;
  id?: string;
}

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { createVratRecord } = useVratRecords();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');
  const [showPastEntryModal, setShowPastEntryModal] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch vrat records from database
  const fetchVratRecords = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('vrat_records')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const calendarEvents: CalendarEvent[] = data.map(record => ({
        id: record.id,
        date: new Date(record.date),
        type: 'vrat',
        title: record.vrat_type,
        completed: record.status === 'success'
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching vrat records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVratRecords();
  }, [user]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const getEventTypeColor = (type: string, completed?: boolean) => {
    switch (type) {
      case 'vrat':
        return completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
      case 'festival':
        return 'bg-orange-100 text-orange-800';
      case 'custom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePastEntry = async (data: { type: string; completed: boolean }) => {
    if (!selectedDate || !user) return;

    try {
      const status = data.completed ? 'success' : 'failed';
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      await createVratRecord(
        data.type as any,
        status as any,
        undefined,
        dateStr,
        true // isRetrospective
      );
      
      // Refresh the calendar data
      await fetchVratRecords();
      
      toast({
        title: data.completed ? "Entry Saved! ✨" : "Entry Recorded",
        description: data.completed 
          ? `Your ${data.type} vrat has been marked as completed.`
          : `Your ${data.type} attempt has been recorded. Every effort counts!`
      });
    } catch (error) {
      console.error('Error saving past entry:', error);
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const canAddPastEntry = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    
    // Allow entries for any past date (unlimited retrospective)
    return date < today;
  };

  const modifiers = {
    hasEvent: events.map(event => event.date),
    completed: events.filter(event => event.completed).map(event => event.date),
    festival: events.filter(event => event.type === 'festival').map(event => event.date),
  };

  const modifiersStyles = {
    hasEvent: { 
      fontWeight: 'bold',
      position: 'relative' as const,
    },
    completed: {
      backgroundColor: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
    },
    festival: {
      backgroundColor: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
    },
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          Calendar & Progress
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your vrats and view your spiritual journey
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="retrospective">Retrospective</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm">Legend:</h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge className="bg-primary text-primary-foreground">Completed Vrat</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Pending Vrat</Badge>
                  <Badge className="bg-accent text-accent-foreground">Festival</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Details */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg group">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getEventTypeColor(event.type, event.completed)}>
                            {event.completed ? 'Completed' : event.type === 'festival' ? 'Festival' : 'Pending'}
                          </Badge>
                          {event.type === 'vrat' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                              onClick={() => {
                                const updatedEvents = events.filter((e, i) => 
                                  !(e.date.toDateString() === selectedDate.toDateString() && 
                                    events.findIndex(event => event.date.toDateString() === selectedDate.toDateString() && event === e) === index)
                                );
                                setEvents(updatedEvents);
                                toast({
                                  title: "Entry Removed",
                                  description: "The vrat entry has been deleted."
                                });
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <p className="text-muted-foreground">
                      No events recorded for this date
                    </p>
                    {canAddPastEntry(selectedDate) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPastEntryModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Past Entry
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Add Past Entry for existing events */}
                {getEventsForDate(selectedDate).length > 0 && canAddPastEntry(selectedDate) && (
                  <div className="mt-4 pt-3 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full"
                      onClick={() => setShowPastEntryModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Update Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="retrospective">
          <RetrospectiveTab userId={user?.id || ''} />
        </TabsContent>
      </Tabs>

      {/* Past Entry Modal */}
      {selectedDate && (
        <PastEntryModal
          visible={showPastEntryModal}
          onClose={() => setShowPastEntryModal(false)}
          onSubmit={handlePastEntry}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};