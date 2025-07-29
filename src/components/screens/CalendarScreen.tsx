import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Circle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasActivity: boolean;
  activityType?: "micro" | "festival" | "vrat" | "completed";
  isToday?: boolean;
}

export function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Generate calendar days for the current month
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      
      // Sample activity data
      const hasActivity = isCurrentMonth && Math.random() > 0.6;
      const activityTypes = ["micro", "festival", "vrat", "completed"] as const;
      const activityType = hasActivity ? activityTypes[Math.floor(Math.random() * activityTypes.length)] : undefined;

      days.push({
        date: date.getDate(),
        isCurrentMonth,
        hasActivity,
        activityType,
        isToday
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDay(null);
  };

  const getActivityColor = (type: string | undefined) => {
    switch (type) {
      case "completed":
        return "bg-primary text-primary-foreground";
      case "festival":
        return "bg-accent text-accent-foreground";
      case "vrat":
        return "bg-secondary text-secondary-foreground";
      case "micro":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  const getActivityIcon = (type: string | undefined) => {
    switch (type) {
      case "completed":
        return <Star className="h-3 w-3" />;
      case "festival":
      case "vrat":
      case "micro":
        return <Circle className="h-2 w-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-primary text-primary" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-accent text-accent" />
            <span>Festival</span>
          </div>
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-secondary text-secondary" />
            <span>Vrat</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 px-6 pb-20">
        <Card className="shadow-gentle">
          <CardContent className="p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative aspect-square flex items-center justify-center rounded-lg text-sm transition-all duration-200",
                    day.isCurrentMonth 
                      ? "text-foreground hover:bg-muted" 
                      : "text-muted-foreground",
                    day.isToday && "bg-primary text-primary-foreground font-bold",
                    day.hasActivity && !day.isToday && getActivityColor(day.activityType),
                    selectedDay === day && "ring-2 ring-primary"
                  )}
                >
                  <span>{day.date}</span>
                  {day.hasActivity && !day.isToday && (
                    <div className="absolute bottom-1 right-1">
                      {getActivityIcon(day.activityType)}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day Detail */}
        {selectedDay && (
          <Card className="mt-4 shadow-gentle animate-fade-in-up">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">
                Day {selectedDay.date} Details
              </h3>
              {selectedDay.hasActivity ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedDay.activityType === "completed" && "✅ Daily practice completed"}
                    {selectedDay.activityType === "festival" && "🎭 Festival observance"}
                    {selectedDay.activityType === "vrat" && "🌙 Vrat day"}
                    {selectedDay.activityType === "micro" && "🔥 Micro-fast scheduled"}
                  </p>
                  <Button variant="peaceful" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No activities scheduled for this day
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}