import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodayPrompt {
  title: string;
  description: string;
  type: "micro" | "festival" | "vrat";
  points: number;
  streak?: number;
}

export function TodayScreen() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Sample today's prompt
  const todayPrompt: TodayPrompt = {
    title: "Your Daily Micro-Fast",
    description: "Today, practice mindful eating by chewing each bite 32 times. This ancient practice enhances digestion and brings awareness to your meals.",
    type: "micro",
    points: 10,
    streak: 7
  };

  const handleCheckIn = () => {
    setIsCompleted(true);
    setShowCelebration(true);
    // Hide celebration after animation
    setTimeout(() => setShowCelebration(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-dawn">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {todayPrompt.title}
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-primary" />
            <span>{todayPrompt.points} points</span>
          </div>
          {todayPrompt.streak && (
            <div className="flex items-center gap-1">
              <Flame className="h-4 w-4 text-primary" />
              <span>{todayPrompt.streak} day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-20">
        {/* Today's Prompt Card */}
        <Card className="mb-6 shadow-gentle">
          <CardContent className="p-6">
            <p className="text-foreground leading-relaxed text-center">
              {todayPrompt.description}
            </p>
          </CardContent>
        </Card>

        {/* Check-in Button */}
        <div className="text-center mb-8">
          {isCompleted ? (
            <div className="space-y-4">
              <div className={cn(
                "inline-flex items-center gap-2 text-primary font-semibold",
                showCelebration && "animate-sacred-glow"
              )}>
                <CheckCircle className="h-6 w-6" />
                <span>Well done! +{todayPrompt.points} points</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Your dedication to mindful practice is inspiring
              </p>
            </div>
          ) : (
            <Button
              onClick={handleCheckIn}
              variant="checkin"
              size="xl"
              className="w-full max-w-sm"
            >
              Complete Today's Practice
            </Button>
          )}
        </div>

        {/* Progress Section */}
        <Card className="shadow-gentle">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-center">Your Journey</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Progress</span>
                  <span>7/7 days</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Goal</span>
                  <span>21/30 days</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground">
                  "धर्म हि तेजो वृद्धि कुर्वन्तु" - May righteousness increase your inner light
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}