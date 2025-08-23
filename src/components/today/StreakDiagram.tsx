import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Trophy, Target } from 'lucide-react';

interface StreakDiagramProps {
  userId: string;
  currentStreak?: number;
  range?: '30' | '90' | '365';
  onViewHistory?: () => void;
}

export const StreakDiagram: React.FC<StreakDiagramProps> = ({
  userId,
  currentStreak = 7,
  range = '30',
  onViewHistory
}) => {
  const [selectedRange, setSelectedRange] = useState(range);

  const getRangeData = (range: string) => {
    switch (range) {
      case '30':
        return { total: 30, completed: 18, percentage: 60 };
      case '90':
        return { total: 90, completed: 45, percentage: 50 };
      case '365':
        return { total: 365, completed: 128, percentage: 35 };
      default:
        return { total: 30, completed: 18, percentage: 60 };
    }
  };

  const data = getRangeData(selectedRange);

  return (
    <Card className="bg-gradient-jade text-jade-foreground shadow-gentle">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Progress
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewHistory}
            className="text-jade-foreground hover:bg-jade-foreground/10"
          >
            <History className="h-4 w-4 mr-1" />
            View History
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold">{currentStreak}</div>
          <p className="text-sm opacity-90">Day Streak</p>
        </div>

        {/* Range Selector */}
        <Tabs value={selectedRange} onValueChange={(value) => setSelectedRange(value as '30' | '90' | '365')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-jade-foreground/10">
            <TabsTrigger value="30" className="text-xs">30D</TabsTrigger>
            <TabsTrigger value="90" className="text-xs">90D</TabsTrigger>
            <TabsTrigger value="365" className="text-xs">1Y</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Progress Circle Representation */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Completed: {data.completed}</span>
            <span>Goal: {data.total}</span>
          </div>
          <Progress 
            value={data.percentage} 
            className="h-3 bg-jade-foreground/20"
          />
          <div className="flex items-center justify-center gap-2 text-sm opacity-90">
            <Target className="h-3 w-3" />
            <span>{data.percentage}% completion rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};