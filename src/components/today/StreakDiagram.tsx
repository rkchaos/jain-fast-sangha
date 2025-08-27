import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, Trophy, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StreakDiagramProps {
  userId?: string;
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
  const [userData, setUserData] = useState({ total: 0, completed: 0, percentage: 0 });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUserData = async (days: number) => {
    const currentUserId = userId || user?.id;
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('vrat_records')
        .select('*')
        .eq('user_id', currentUserId)
        .gte('date', startDate.toISOString().split('T')[0]);
      
      if (error) throw error;
      
      const totalVrats = data.length;
      const completed = data.filter(record => record.status === 'success').length;
      const percentage = totalVrats > 0 ? Math.round((completed / totalVrats) * 100) : 0;
      
      setUserData({ total: totalVrats, completed, percentage });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData({ total: days, completed: 0, percentage: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const days = selectedRange === '30' ? 30 : selectedRange === '90' ? 90 : 365;
    fetchUserData(days);
  }, [selectedRange, user, userId]);

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

        {/* Progress Representation */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>
              {loading ? 'Loading...' : `Completed: ${userData.completed}`}
            </span>
            <span>Total Vrats: {userData.total}</span>
          </div>
          <Progress 
            value={userData.percentage} 
            className="h-3 bg-jade-foreground/20"
          />
          <div className="flex items-center justify-center gap-2 text-sm opacity-90">
            <Target className="h-3 w-3" />
            <span>{userData.percentage}% completion rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};