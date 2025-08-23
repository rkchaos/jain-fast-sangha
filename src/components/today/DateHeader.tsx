import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateHeaderProps {
  date?: Date;
  timeVisible?: boolean;
}

export const DateHeader: React.FC<DateHeaderProps> = ({ 
  date = new Date(), 
  timeVisible = true 
}) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-gradient-sacred text-primary-foreground p-4 rounded-lg shadow-sacred">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <div>
            <h2 className="text-lg font-semibold">
              {formatDate(date)}
            </h2>
          </div>
        </div>
        
        {timeVisible && (
          <div className="flex items-center space-x-2 text-primary-foreground/80">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {formatTime(date)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};