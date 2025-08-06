import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { 
  Heart, 
  Flame, 
  Calendar, 
  Trophy, 
  Users,
  Sun,
  Moon,
  Star,
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin
} from "lucide-react";

interface TodayPrompt {
  id: string;
  title: string;
  description: string;
  type: "daily" | "festival" | "ekadashi" | "special";
  points: number;
  streak?: number;
  category: string;
  tipText?: string;
}

interface FastType {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  points: number;
}

const fastTypes: FastType[] = [
  {
    id: "ekasan",
    name: "Ekasan",
    description: "One meal a day",
    difficulty: "beginner",
    duration: "12-16 hours",
    points: 10
  },
  {
    id: "upvas",
    name: "Upvas", 
    description: "Complete water fast",
    difficulty: "advanced",
    duration: "24 hours",
    points: 25
  },
  {
    id: "ayambil",
    name: "Ayambil",
    description: "Boiled food without salt/spices",
    difficulty: "intermediate", 
    duration: "All day",
    points: 15
  },
  {
    id: "navkarsi",
    name: "Navkarsi",
    description: "After sunrise meal",
    difficulty: "beginner",
    duration: "Until sunrise",
    points: 8
  },
  {
    id: "chouvihar",
    name: "Chouvihar",
    description: "No food after sunset",
    difficulty: "beginner",
    duration: "After sunset",
    points: 5
  }
];

const todayPrompts: TodayPrompt[] = [
  {
    id: "1",
    title: "Begin with Gratitude",
    description: "Start your day by expressing gratitude for three things in your life",
    type: "daily",
    points: 5,
    category: "Spiritual",
    tipText: "Gratitude opens the heart to abundance and peace"
  },
  {
    id: "2", 
    title: "Mindful Eating",
    description: "Eat your first meal in complete silence, focusing on each bite",
    type: "daily",
    points: 8,
    category: "Mindfulness",
    tipText: "Conscious eating transforms nourishment into meditation"
  },
  {
    id: "3",
    title: "Acts of Kindness",
    description: "Perform one random act of kindness for someone today",
    type: "daily", 
    points: 10,
    category: "Compassion",
    tipText: "Small acts of love create ripples of positive energy"
  }
];

export function EnhancedTodayScreen() {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [selectedFastType, setSelectedFastType] = useState<string>("");
  const [fastStartTime, setFastStartTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [todayPrompt] = useState(todayPrompts[0]);
  const [dailyProgress, setDailyProgress] = useState(75);
  const [monthlyProgress, setMonthlyProgress] = useState(45);

  const selectedFast = fastTypes.find(fast => fast.id === selectedFastType);

  const handleCheckIn = () => {
    if (!selectedFastType) {
      toast({
        title: "Select Fast Type",
        description: "Please choose which type of fast you're performing today.",
        variant: "destructive"
      });
      return;
    }

    setIsCheckedIn(true);
    setFastStartTime(new Date());
    toast({
      title: "Fast Started! 🙏",
      description: `Your ${selectedFast?.name} practice has begun. May this bring you peace and spiritual growth.`,
    });
  };

  const handleCheckOut = (successful: boolean) => {
    setIsCompleted(true);
    
    if (successful) {
      setCurrentStreak(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      
      toast({
        title: "🎉 Congratulations!",
        description: `You've successfully completed your ${selectedFast?.name}! Your dedication inspires the community.`,
      });
    } else {
      toast({
        title: "No Worries 💙",
        description: "Every attempt is a step forward on your spiritual journey. Tomorrow is a new beginning.",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-secondary text-secondary-foreground";
      case "intermediate": return "bg-jade text-jade-foreground"; 
      case "advanced": return "bg-primary text-primary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeElapsed = () => {
    if (!fastStartTime) return "0h 0m";
    const now = new Date();
    const elapsed = now.getTime() - fastStartTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-dawn p-4 space-y-6">
      {/* Header with Streak and Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold text-foreground">{currentStreak}</span>
            <span className="text-muted-foreground">day streak</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{getCurrentTime()}</span>
        </div>
      </div>

      {/* Today's Prompt Card */}
      <Card className="shadow-gentle">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-foreground">{todayPrompt.title}</CardTitle>
              <CardDescription>{todayPrompt.description}</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10">
              +{todayPrompt.points} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>{todayPrompt.tipText}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fast Selection and Check-in */}
      {!isCheckedIn && !isCompleted && (
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-primary" />
              <span>Today's Practice</span>
            </CardTitle>
            <CardDescription>
              Choose your fasting practice for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedFastType} onValueChange={setSelectedFastType}>
              <SelectTrigger>
                <SelectValue placeholder="Select your fast type" />
              </SelectTrigger>
              <SelectContent>
                {fastTypes.map((fast) => (
                  <SelectItem key={fast.id} value={fast.id}>
                    <div className="flex items-center space-x-2">
                      <span>{fast.name}</span>
                      <Badge variant="outline" className={getDifficultyColor(fast.difficulty)}>
                        {fast.difficulty}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFast && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedFast.name}</h4>
                  <Badge variant="outline">+{selectedFast.points} points</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedFast.description}</p>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Duration: {selectedFast.duration}</span>
                  <Badge className={getDifficultyColor(selectedFast.difficulty)}>
                    {selectedFast.difficulty}
                  </Badge>
                </div>
              </div>
            )}

            <Button 
              onClick={handleCheckIn}
              variant="checkin"
              size="lg"
              className="w-full"
              disabled={!selectedFastType}
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Begin Fast
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Fast Progress */}
      {isCheckedIn && !isCompleted && (
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Fast in Progress</span>
            </CardTitle>
            <CardDescription>
              You're currently observing {selectedFast?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">{getTimeElapsed()}</div>
              <p className="text-sm text-muted-foreground">Time elapsed</p>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={() => handleCheckOut(true)}
                variant="peaceful"
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed Successfully
              </Button>
              <Button 
                onClick={() => handleCheckOut(false)}
                variant="outline"
                className="flex-1"
              >
                End Early
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Section */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sun className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Today's Goal</span>
            </div>
            <Progress value={dailyProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{dailyProgress}% complete</p>
          </CardContent>
        </Card>

        <Card className="shadow-gentle">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Monthly Goal</span>
            </div>
            <Progress value={monthlyProgress} className="mb-2" />
            <p className="text-xs text-muted-foreground">{monthlyProgress}% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Community Glimpse */}
      <Card className="shadow-gentle">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-jade" />
            <span>Community Today</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Anita Shah</p>
                  <p className="text-xs text-muted-foreground">completed Upvas</p>
                </div>
              </div>
              <Badge variant="outline">+25 pts</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Raj Jain</p>
                  <p className="text-xs text-muted-foreground">15-day streak!</p>
                </div>
              </div>
              <Trophy className="w-4 h-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-gentle-bounce text-6xl">
            🎉
          </div>
        </div>
      )}
    </div>
  );
}