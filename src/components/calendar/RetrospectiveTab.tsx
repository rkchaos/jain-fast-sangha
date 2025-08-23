import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, TrendingUp, Calendar, Download, Share, Target } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface RetrospectiveTabProps {
  userId: string;
  defaultRange?: '30' | '90' | '365';
}

// Mock data for retrospective
const mockStats = {
  '30': {
    totalVrats: 12,
    completed: 8,
    completionRate: 67,
    bestStreak: 7,
    progressScore: 85
  },
  '90': {
    totalVrats: 45,
    completed: 32,
    completionRate: 71,
    bestStreak: 12,
    progressScore: 78
  },
  '365': {
    totalVrats: 128,
    completed: 89,
    completionRate: 70,
    bestStreak: 15,
    progressScore: 82
  }
};

const positiveInsights = [
  "You're growing — celebrate this progress.",
  "Small wins add up — keep the momentum.",
  "Consistency matters more than perfection.",
  "You completed X vrats this period — well done.",
  "Set a small 3-day goal — build from there.",
  "Your best streak shows your potential — keep going.",
  "Every vrat is a step forward — be kind to yourself.",
  "You improved by Y% vs last period — keep this path.",
  "A gentle reminder: growth is gradual—celebrate today.",
  "You honored your practice — that's progress."
];

const motivationalInsights = [
  "In the last 30 days you completed 12 Ekasna — consistency improved 40% vs previous 30 days.",
  "You have a best streak of 7 days — that shows steady focus.",
  "Completion rate this period is 68% — excellent progress.",
  "You added notes on 5 days — journaling helps deepen practice.",
  "During Paryushan you completed 4 full vrats — well done.",
  "Small steps: Try a 3-day micro-goal to start the next stretch."
];

export const RetrospectiveTab: React.FC<RetrospectiveTabProps> = ({
  userId,
  defaultRange = '30'
}) => {
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [selectedSangha, setSelectedSangha] = useState('all');
  const [selectedVratType, setSelectedVratType] = useState('all');

  const stats = mockStats[selectedRange];

  const handleExportCsv = () => {
    toast({
      title: "Export Started",
      description: "Your data is being exported to CSV format.",
    });
  };

  const handleShareProgress = () => {
    toast({
      title: "Progress Shared",
      description: "Your progress has been shared with your Sangha.",
    });
  };

  const handleSetGoal = () => {
    toast({
      title: "Goal Setting",
      description: "Goal setting feature will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground">Retrospective: Your Progress</h2>
        <p className="text-sm text-muted-foreground">
          Focus on growth — celebrate small wins.
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={selectedRange} onValueChange={(value) => setSelectedRange(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSangha} onValueChange={setSelectedSangha}>
              <SelectTrigger>
                <SelectValue placeholder="Sangha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sanghas</SelectItem>
                <SelectItem value="mumbai">Mumbai Jain Samaj</SelectItem>
                <SelectItem value="delhi">Delhi Digambar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVratType} onValueChange={setSelectedVratType}>
              <SelectTrigger>
                <SelectValue placeholder="Vrat Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="upvas">Upvas</SelectItem>
                <SelectItem value="ekasna">Ekasna</SelectItem>
                <SelectItem value="ayambil">Ayambil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalVrats}</div>
            <p className="text-xs text-muted-foreground">Total Vrats</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.bestStreak}</div>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.progressScore}</div>
            <p className="text-xs text-muted-foreground">Progress Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Completion Rate</span>
              <span>{stats.completionRate}%</span>
            </div>
            <Progress value={stats.completionRate} className="h-3" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress Score</span>
              <span>{stats.progressScore}/100</span>
            </div>
            <Progress value={stats.progressScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Positive Insights */}
      <Card className="bg-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {motivationalInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="p-3 bg-background/50 rounded-lg">
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Strip */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  Math.random() > 0.3 ? 'bg-primary' : 'bg-muted'
                }`}
                title={`Day ${30 - i}`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last 30 days • Green: Completed vrat • Gray: No vrat
          </p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button variant="outline" onClick={handleSetGoal} className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Set Goal
        </Button>
        
        <Button variant="outline" onClick={handleShareProgress} className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Share Progress
        </Button>
        
        <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Add Note
        </Button>
      </div>
    </div>
  );
};