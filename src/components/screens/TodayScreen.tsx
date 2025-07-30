import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Star, Flame, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodayPrompt {
  title: string;
  description: string;
  type: "micro" | "festival" | "vrat";
  points: number;
  streak?: number;
}

export function TodayScreen() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [selectedFastType, setSelectedFastType] = useState<string>("");
  const [fastSuccess, setFastSuccess] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  // Sample today's prompt
  const todayPrompt: TodayPrompt = {
    title: "Your Daily Micro-Fast",
    description: "Today, practice mindful eating by chewing each bite 32 times. This ancient practice enhances digestion and brings awareness to your meals.",
    type: "micro",
    points: 10,
    streak: 7
  };

  const fastTypes = [
    { value: "ekasan", label: "Ekasan (One meal)" },
    { value: "upwas", label: "Upwas (Complete fast)" },
    { value: "ayambil", label: "Ayambil (Simple food)" },
    { value: "navkarsi", label: "Navkarsi (After sunrise)" },
    { value: "chouvihar", label: "Chouvihar (No night food)" }
  ];

  const handleCheckIn = () => {
    if (!selectedFastType) {
      toast({
        title: "Please select a fast type",
        description: "Choose which fast you're performing today before checking in.",
        variant: "destructive"
      });
      return;
    }
    setIsCheckedIn(true);
    setShowCelebration(true);
    toast({
      title: "Fast Started! 🙏",
      description: `You've begun your ${fastTypes.find(f => f.value === selectedFastType)?.label} fast.`
    });
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const handleCheckOut = (success: boolean) => {
    setIsCheckedOut(true);
    setFastSuccess(success);
    const message = success 
      ? "Congratulations! You've successfully completed your fast. Your dedication is inspiring." 
      : "No worries! Every attempt brings you closer to spiritual growth. Keep practicing.";
    
    toast({
      title: success ? "Fast Completed! 🎉" : "Keep Going! 💪",
      description: message
    });
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

        {/* Fast Selection and Check-in/out */}
        <div className="space-y-6 mb-8">
          {!isCheckedIn ? (
            <>
              {/* Fast Type Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Select your fast type for today:
                </label>
                <Select value={selectedFastType} onValueChange={setSelectedFastType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your fast type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fastTypes.map((fast) => (
                      <SelectItem key={fast.value} value={fast.value}>
                        {fast.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Check-in Button */}
              <Button
                onClick={handleCheckIn}
                variant="checkin"
                size="xl"
                className="w-full"
                disabled={!selectedFastType}
              >
                Start Fast
              </Button>
            </>
          ) : !isCheckedOut ? (
            <div className="space-y-4">
              <div className={cn(
                "text-center space-y-2",
                showCelebration && "animate-sacred-glow"
              )}>
                <div className="flex items-center justify-center gap-2 text-primary font-semibold">
                  <Clock className="h-5 w-5" />
                  <span>Fast in Progress</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {fastTypes.find(f => f.value === selectedFastType)?.label}
                </p>
              </div>
              
              {/* Check-out Buttons */}
              <div className="space-y-3">
                <p className="text-center text-sm font-medium">
                  How did your fast go?
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleCheckOut(true)}
                    variant="sacred"
                    size="lg"
                    className="flex-1"
                  >
                    Completed Successfully ✨
                  </Button>
                  <Button
                    onClick={() => handleCheckOut(false)}
                    variant="peaceful"
                    size="lg"
                    className="flex-1"
                  >
                    Did My Best 🙏
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={cn(
                "inline-flex items-center gap-2 font-semibold",
                fastSuccess ? "text-primary" : "text-peaceful"
              )}>
                <CheckCircle className="h-6 w-6" />
                <span>
                  {fastSuccess ? `Completed! +${todayPrompt.points} points` : "Practice Logged"}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {fastSuccess 
                  ? "Your dedication to spiritual practice is inspiring" 
                  : "Every step on the spiritual path matters"}
              </p>
            </div>
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