import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Bell,
  Play,
  Calendar,
  Users,
  Heart,
  BookOpen,
  Radio,
  Star,
  Clock,
  MapPin,
  Languages,
  Crown
} from "lucide-react";

interface Monk {
  id: string;
  name: string;
  title: string;
  location: string;
  followers: number;
  specialization: string[];
  languages: string[];
  isLive: boolean;
  nextEvent?: {
    title: string;
    date: string;
    time: string;
  };
  bio: string;
  isFollowing: boolean;
}

interface Pravachan {
  id: string;
  title: string;
  monk: string;
  duration: string;
  date: string;
  views: number;
  likes: number;
  category: "spiritual" | "practical" | "festival" | "meditation";
  language: string;
  isLiked: boolean;
  thumbnail?: string;
}

interface LiveEvent {
  id: string;
  title: string;
  monk: string;
  startTime: string;
  viewers: number;
  category: string;
  description: string;
}

const monks: Monk[] = [
  {
    id: "1",
    name: "Acharya Shri Vijay Kumar",
    title: "Acharya",
    location: "Palitana, Gujarat",
    followers: 25400,
    specialization: ["Meditation", "Philosophy", "Daily Living"],
    languages: ["Hindi", "Gujarati", "English"],
    isLive: true,
    nextEvent: {
      title: "Morning Meditation Session",
      date: "Tomorrow",
      time: "6:00 AM"
    },
    bio: "Spiritual guide with 30+ years of experience in Jain philosophy and meditation practices.",
    isFollowing: true
  },
  {
    id: "2",
    name: "Sadhvi Shri Punya Pradhan",
    title: "Sadhvi",
    location: "Mumbai, Maharashtra", 
    followers: 18900,
    specialization: ["Women's Spirituality", "Family Values", "Youth Guidance"],
    languages: ["Hindi", "Marathi", "English"],
    isLive: false,
    nextEvent: {
      title: "Family Dharma Discussion",
      date: "Saturday",
      time: "7:00 PM"
    },
    bio: "Dedicated to empowering families through spiritual wisdom and practical guidance.",
    isFollowing: false
  },
  {
    id: "3",
    name: "Muni Shri Dharma Sagar",
    title: "Muni",
    location: "Ahmedabad, Gujarat",
    followers: 12300,
    specialization: ["Scripture Study", "Karma Philosophy", "Young Adults"],
    languages: ["Gujarati", "Hindi"],
    isLive: false,
    bio: "Young monk inspiring the next generation with accessible interpretations of ancient wisdom.",
    isFollowing: true
  }
];

const pravachans: Pravachan[] = [
  {
    id: "1",
    title: "Finding Peace in Modern Chaos",
    monk: "Acharya Shri Vijay Kumar",
    duration: "45:32",
    date: "2 days ago",
    views: 15600,
    likes: 892,
    category: "practical",
    language: "Hindi",
    isLiked: true
  },
  {
    id: "2",
    title: "The Art of Mindful Fasting",
    monk: "Sadhvi Shri Punya Pradhan",
    duration: "32:18",
    date: "5 days ago",
    views: 8900,
    likes: 567,
    category: "spiritual",
    language: "English",
    isLiked: false
  },
  {
    id: "3",
    title: "Das Lakshan Parv: Ten Virtues Explained",
    monk: "Muni Shri Dharma Sagar",
    duration: "56:45",
    date: "1 week ago",
    views: 22100,
    likes: 1340,
    category: "festival",
    language: "Gujarati",
    isLiked: true
  }
];

const liveEvents: LiveEvent[] = [
  {
    id: "1",
    title: "Evening Pravachan: Ahimsa in Daily Life",
    monk: "Acharya Shri Vijay Kumar",
    startTime: "Started 15 minutes ago",
    viewers: 847,
    category: "Spiritual Teaching",
    description: "Exploring practical applications of non-violence in modern living"
  }
];

export function MonkNetworkScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [followedMonks, setFollowedMonks] = useState<Set<string>>(new Set(["1", "3"]));
  const [likedPravachans, setLikedPravachans] = useState<Set<string>>(new Set(["1", "3"]));

  const toggleFollow = (monkId: string) => {
    setFollowedMonks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monkId)) {
        newSet.delete(monkId);
      } else {
        newSet.add(monkId);
      }
      return newSet;
    });
  };

  const toggleLike = (pravachanId: string) => {
    setLikedPravachans(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pravachanId)) {
        newSet.delete(pravachanId);
      } else {
        newSet.add(pravachanId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "spiritual": return "bg-primary text-primary-foreground";
      case "practical": return "bg-jade text-jade-foreground";
      case "festival": return "bg-secondary text-secondary-foreground";
      case "meditation": return "bg-soft-blue text-soft-blue-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-dawn p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Spiritual Network</h1>
          <p className="text-muted-foreground">Connect with spiritual guides</p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
      </div>

      {/* Live Events Banner */}
      {liveEvents.length > 0 && (
        <Card className="shadow-gentle border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <Badge variant="destructive">LIVE</Badge>
                </div>
                <div>
                  <h4 className="font-medium">{liveEvents[0].title}</h4>
                  <p className="text-sm text-muted-foreground">
                    by {liveEvents[0].monk} • {liveEvents[0].viewers} watching
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm">
                <Radio className="w-4 h-4 mr-2" />
                Join Live
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search monks, teachings, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="monks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monks">Spiritual Guides</TabsTrigger>
          <TabsTrigger value="pravachans">Teachings</TabsTrigger>
          <TabsTrigger value="events">Live Events</TabsTrigger>
        </TabsList>

        <TabsContent value="monks" className="space-y-4">
          {/* Featured Monks */}
          <div className="space-y-4">
            {monks.map((monk) => (
              <Card key={monk.id} className="shadow-gentle">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback>{monk.name.split(' ').slice(-2).map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {monk.isLive && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{monk.name}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{monk.title}</Badge>
                            {monk.isLive && (
                              <Badge variant="destructive" className="text-xs">LIVE</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={followedMonks.has(monk.id) ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => toggleFollow(monk.id)}
                        >
                          {followedMonks.has(monk.id) ? "Following" : "Follow"}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{monk.bio}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{(monk.followers / 1000).toFixed(1)}K followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{monk.location}</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1">
                    {monk.specialization.map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>

                  {/* Languages */}
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <div className="flex space-x-1">
                      {monk.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Next Event */}
                  {monk.nextEvent && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Upcoming</span>
                      </div>
                      <p className="text-sm">{monk.nextEvent.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {monk.nextEvent.date} at {monk.nextEvent.time}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pravachans" className="space-y-4">
          {/* Recent Pravachans */}
          <div className="space-y-4">
            {pravachans.map((pravachan) => (
              <Card key={pravachan.id} className="shadow-gentle">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-16 bg-muted rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{pravachan.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            by {pravachan.monk}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{pravachan.duration}</span>
                            </div>
                            <span>•</span>
                            <span>{formatViews(pravachan.views)} views</span>
                            <span>•</span>
                            <span>{pravachan.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(pravachan.id)}
                            className={likedPravachans.has(pravachan.id) ? "text-red-500" : ""}
                          >
                            <Heart className={`w-4 h-4 ${likedPravachans.has(pravachan.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getCategoryColor(pravachan.category)}>
                          {pravachan.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {pravachan.language}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {/* Upcoming Events */}
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle>Upcoming Spiritual Events</CardTitle>
              <CardDescription>Join live sessions and spiritual gatherings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Morning Meditation Session</h4>
                      <p className="text-sm text-muted-foreground">
                        by Acharya Shri Vijay Kumar
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Tomorrow at 6:00 AM</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Family Dharma Discussion</h4>
                      <p className="text-sm text-muted-foreground">
                        by Sadhvi Shri Punya Pradhan
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Saturday at 7:00 PM</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}