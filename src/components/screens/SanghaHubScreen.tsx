import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Crown, 
  Trophy, 
  Calendar, 
  MessageCircle, 
  Heart,
  Flame,
  Search,
  MapPin,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SanghaGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined: boolean;
  isAdmin: boolean;
  banner: string;
  location: string;
  category: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  points: number;
  checkIns: number;
  rank: number;
}

interface GroupEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "fast" | "event" | "talent" | "spiritual";
  rsvpCount: number;
  isRsvped: boolean;
}

// Clear all static data - will be fetched from database
const sanghaGroups: SanghaGroup[] = [];
const leaderboardData: LeaderboardEntry[] = [];
const groupEvents: GroupEvent[] = [];

export function SanghaHubScreen() {
  const [activeTab, setActiveTab] = useState("leaderboard"); // Default to leaderboard (only working tab)
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon! 🚧",
      description: `${feature} feature will be available in the next update.`,
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2: return <Trophy className="w-4 h-4 text-gray-400" />;
      case 3: return <Star className="w-4 h-4 text-amber-600" />;
      default: return <span className="w-4 h-4 flex items-center justify-center text-xs font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "fast": return <Heart className="w-4 h-4 text-primary" />;
      case "talent": return <Star className="w-4 h-4 text-jade" />;
      case "spiritual": return <Crown className="w-4 h-4 text-secondary" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "fast": return "Fasting";
      case "talent": return "Talent Show";
      case "spiritual": return "Spiritual";
      case "event": return "Community";
      default: return "Event";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dawn p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sangha Hub</h1>
          <p className="text-muted-foreground">Connect • Grow • Inspire</p>
        </div>
        <Button variant="outline" size="icon" onClick={() => handleComingSoon('Create Sangha')}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-sanghas" onClick={() => handleComingSoon('My Sanghas')}>My Sanghas</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="events" onClick={() => handleComingSoon('Events')}>Events</TabsTrigger>
        </TabsList>

        <TabsContent value="my-sanghas" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">My Sanghas feature coming soon!</p>
            <Button onClick={() => handleComingSoon('My Sanghas')}>
              Learn More
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Leaderboard</span>
              </CardTitle>
              <CardDescription>Track your progress and see how you're doing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your first vrat to appear on the leaderboard and track your spiritual progress.
                </p>
                <p className="text-sm text-muted-foreground">
                  Leaderboard data will be populated as more users join and track their vrats.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Events feature coming soon!</p>
            <Button onClick={() => handleComingSoon('Events')}>
              Learn More
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}