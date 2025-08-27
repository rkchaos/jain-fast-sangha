import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Crown, Flame, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  streak: number;
  rank: number;
  sanghaName: string;
}

export function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const [viewType, setViewType] = useState<"sangha" | "global">("sangha");

  // Empty leaderboard data - to be populated from Supabase
  const leaderboardData: LeaderboardEntry[] = [];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-bold">#{rank}</span>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-center mb-6">Leaderboard</h1>
        
        {/* Tab Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "weekly" ? "sacred" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("weekly")}
            className="flex-1"
          >
            Weekly
          </Button>
          <Button
            variant={activeTab === "monthly" ? "sacred" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("monthly")}
            className="flex-1"
          >
            Monthly
          </Button>
        </div>

        {/* View Type Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewType === "sangha" ? "peaceful" : "outline"}
            size="sm"
            onClick={() => setViewType("sangha")}
            className="flex-1"
          >
            My Sangha
          </Button>
          <Button
            variant={viewType === "global" ? "peaceful" : "outline"}
            size="sm"
            onClick={() => setViewType("global")}
            className="flex-1"
          >
            Global
          </Button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 px-6 pb-20">
        <Card className="shadow-gentle">
          <CardContent className="p-6">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Rankings Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start tracking your vrats to appear on the leaderboard!
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={cn(
                      "flex items-center gap-4 p-4 transition-colors",
                      entry.name === "You" 
                        ? "bg-accent/20 border-l-4 border-l-primary" 
                        : "hover:bg-muted/50",
                      index < leaderboardData.length - 1 && "border-b border-border"
                    )}
                  >
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback className="bg-gradient-peaceful">
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-medium truncate",
                          entry.name === "You" && "text-primary font-semibold"
                        )}>
                          {entry.name}
                        </h3>
                        {entry.name === "You" && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {entry.sanghaName}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{entry.score}</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Flame className="h-3 w-3 text-primary" />
                        <span className="text-sm text-muted-foreground">{entry.streak}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Stats Summary */}
        <Card className="mt-4 shadow-gentle">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-center">Your {activeTab} Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">-</div>
                <div className="text-xs text-muted-foreground">Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}