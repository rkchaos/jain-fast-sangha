import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trophy, TrendingUp } from 'lucide-react';
import { RetrospectiveTab } from './RetrospectiveTab';

interface CalendarEvent {
  date: Date;
  type: 'vrat' | 'festival' | 'custom';
  title: string;
  completed?: boolean;
}

// Mock calendar events
const mockEvents: CalendarEvent[] = [
  { date: new Date(2024, 11, 1), type: 'vrat', title: 'Upvas', completed: true },
  { date: new Date(2024, 11, 3), type: 'festival', title: 'Purnima' },
  { date: new Date(2024, 11, 5), type: 'vrat', title: 'Ekasna', completed: true },
  { date: new Date(2024, 11, 8), type: 'vrat', title: 'Ayambil', completed: false },
  { date: new Date(2024, 11, 15), type: 'festival', title: 'Das Lakshan Parva' },
];

export const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('calendar');

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event => 
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

  const modifiers = {
    hasEvent: mockEvents.map(event => event.date),
    completed: mockEvents.filter(event => event.completed).map(event => event.date),
    festival: mockEvents.filter(event => event.type === 'festival').map(event => event.date),
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
                      <div key={index} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                        </div>
                        <Badge className={getEventTypeColor(event.type, event.completed)}>
                          {event.completed ? 'Completed' : event.type === 'festival' ? 'Festival' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No events scheduled for this date
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="retrospective">
          <RetrospectiveTab userId="current-user" />
        </TabsContent>
      </Tabs>
    </div>
  );
};