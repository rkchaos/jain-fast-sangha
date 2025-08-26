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

const sanghaGroups: SanghaGroup[] = [
  {
    id: "1",
    name: "Mumbai Central Jain Samaj",
    description: "United in faith, growing through fasting and community service",
    memberCount: 247,
    isJoined: true,
    isAdmin: false,
    banner: "bg-gradient-sacred",
    location: "Mumbai, Maharashtra",
    category: "City Community",
    weeklyGoal: 100,
    weeklyProgress: 75
  },
  {
    id: "2", 
    name: "Daily Fasting Warriors",
    description: "Dedicated practitioners supporting each other's spiritual journey",
    memberCount: 89,
    isJoined: true,
    isAdmin: true,
    banner: "bg-gradient-jade",
    location: "Online Community",
    category: "Spiritual Practice",
    weeklyGoal: 50,
    weeklyProgress: 42
  },
  {
    id: "3",
    name: "Youth Jain Society",
    description: "Young minds embracing traditional values in modern times",
    memberCount: 156,
    isJoined: false,
    isAdmin: false,
    banner: "bg-gradient-peaceful",
    location: "Pan India",
    category: "Youth Community",
    weeklyGoal: 75,
    weeklyProgress: 28
  }
];

const leaderboardData: LeaderboardEntry[] = [
  { id: "1", name: "Anita Shah", streak: 28, points: 840, checkIns: 30, rank: 1 },
  { id: "2", name: "Raj Jain", streak: 15, points: 675, checkIns: 18, rank: 2 },
  { id: "3", name: "Priya Mehta", streak: 12, points: 480, checkIns: 15, rank: 3 },
  { id: "4", name: "You", streak: 7, points: 245, checkIns: 8, rank: 4 },
  { id: "5", name: "Kiran Patel", streak: 5, points: 180, checkIns: 7, rank: 5 }
];

const groupEvents: GroupEvent[] = [
  {
    id: "1",
    title: "Community Upvas Challenge",
    date: "Tomorrow",
    time: "6:00 AM",
    type: "fast",
    rsvpCount: 23,
    isRsvped: true
  },
  {
    id: "2",
    title: "Talent Show: Devotional Singing",
    date: "Saturday",
    time: "7:00 PM", 
    type: "talent",
    rsvpCount: 45,
    isRsvped: false
  },
  {
    id: "3",
    title: "Monk Pravachan by Acharya Shri",
    date: "Sunday",
    time: "9:00 AM",
    type: "spiritual",
    rsvpCount: 78,
    isRsvped: true
  }
];

export function SanghaHubScreen() {
  const [activeTab, setActiveTab] = useState("my-sanghas");
  const [searchQuery, setSearchQuery] = useState("");

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
        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-sanghas">My Sanghas</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="my-sanghas" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search sanghas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* My Sanghas */}
          <div className="space-y-4">
            {sanghaGroups.filter(sangha => sangha.isJoined).map((sangha) => (
              <Card key={sangha.id} className="shadow-gentle">
                <div className={`h-16 ${sangha.banner} rounded-t-lg relative`}>
                  {sangha.isAdmin && (
                    <Badge className="absolute top-2 right-2 bg-white/20 text-white border-white/30">
                      Admin
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{sangha.name}</CardTitle>
                      <CardDescription className="text-sm">{sangha.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{sangha.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{sangha.location}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Weekly Progress</span>
                        <span>{sangha.weeklyProgress}/{sangha.weeklyGoal}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-300"
                          style={{ width: `${(sangha.weeklyProgress / sangha.weeklyGoal) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Events
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Members Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">All Members</h3>
            <div className="space-y-3">
              {sanghaGroups.filter(sangha => sangha.isJoined).map((sangha) => (
                <Card key={sangha.id} className="shadow-gentle">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{sangha.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Mock members */}
                      {['Anita Shah', 'Raj Jain', 'Priya Mehta', 'Kiran Patel', 'You', 'Deepak Shah'].map((member, index) => (
                        <div key={index} className="flex flex-col items-center space-y-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-xs">
                              {member.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-center font-medium">{member}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-muted-foreground text-center">
                        {sangha.memberCount} total members
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Discover New Sanghas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Discover Communities</h3>
            <div className="space-y-3">
              {sanghaGroups.filter(sangha => !sangha.isJoined).map((sangha) => (
                <Card key={sangha.id} className="shadow-gentle">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{sangha.name}</h4>
                        <p className="text-sm text-muted-foreground">{sangha.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{sangha.memberCount} members</span>
                          <Badge variant="outline">{sangha.category}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Weekly Leaderboard</span>
              </CardTitle>
              <CardDescription>Top performers in Mumbai Central Jain Samaj</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((entry) => (
                  <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.name === "You" ? "bg-primary/5 border border-primary/20" : "bg-muted/30"
                  }`}>
                    <div className="flex items-center space-x-3">
                      {getRankIcon(entry.rank)}
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3" />
                            <span>{entry.streak}</span>
                          </div>
                          <span>•</span>
                          <span>{entry.checkIns} check-ins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{entry.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {groupEvents.map((event) => (
              <Card key={event.id} className="shadow-gentle">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getEventIcon(event.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{getEventTypeLabel(event.type)}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {event.rsvpCount} attending
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant={event.isRsvped ? "secondary" : "outline"} 
                      size="sm"
                    >
                      {event.isRsvped ? "Going" : "RSVP"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Event Button */}
          <Button variant="sacred" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create New Event
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}