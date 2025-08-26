import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  TrendingUp,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  Bookmark,
  Bell
} from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: "news" | "announcement" | "spiritual";
  location?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  imageUrl?: string;
  tags: string[];
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  organizationName: string;
  targetAmount: number;
  currentAmount: number;
  daysLeft: number;
  donorCount: number;
  category: "temple" | "education" | "animal" | "environment" | "humanitarian";
  isVerified: boolean;
  imageUrl?: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: "1",
    title: "Das Lakshan Parv Celebrations Begin Across India",
    content: "The sacred ten-day festival of Das Lakshan Parv has commenced with grand celebrations in Jain temples nationwide. Devotees are observing enhanced spiritual practices...",
    author: "Jain Uwas Team",
    date: "2 hours ago",
    category: "announcement",
    location: "Pan India",
    likes: 156,
    comments: 23,
    isLiked: false,
    tags: ["Festival", "Das Lakshan", "Celebration"]
  },
  {
    id: "2",
    title: "New Jain Meditation Center Opens in Bangalore",
    content: "A state-of-the-art meditation and spiritual learning center has been inaugurated in Bangalore, featuring modern amenities while preserving traditional values...",
    author: "Jain Uwas Team",
    date: "5 hours ago", 
    category: "announcement",
    location: "Bangalore",
    likes: 89,
    comments: 12,
    isLiked: true,
    tags: ["Infrastructure", "Meditation", "Bangalore"]
  },
  {
    id: "3",
    title: "Acharya Shri's Teachings on Mindful Living",
    content: "In his recent discourse, Acharya Shri emphasized the importance of integrating ancient Jain principles with modern lifestyle challenges...",
    author: "Jain Uwas Team",
    date: "1 day ago",
    category: "spiritual",
    likes: 234,
    comments: 45,
    isLiked: true,
    tags: ["Spiritual", "Teaching", "Mindfulness"]
  },
  {
    id: "4",
    title: "App Update: New Features for Better Spiritual Tracking",
    content: "We're excited to announce new features in the Jain Sangha app including enhanced calendar tracking, community blogs, and improved meditation timers...",
    author: "Jain Uwas Team",
    date: "3 days ago",
    category: "announcement",
    likes: 145,
    comments: 28,
    isLiked: false,
    tags: ["App Update", "Features", "Technology"]
  }
];

const campaigns: Campaign[] = [
  {
    id: "1",
    title: "Save Elephants Sanctuary Project",
    description: "Supporting elephant welfare and creating safe havens for rescued elephants in alignment with Jain principles of non-violence.",
    organizationName: "Jain Animal Welfare Trust",
    targetAmount: 500000,
    currentAmount: 342000,
    daysLeft: 15,
    donorCount: 1247,
    category: "animal",
    isVerified: true
  },
  {
    id: "2",
    title: "Heritage Temple Restoration Fund",
    description: "Restoring the ancient Palitana temple complex to preserve our sacred heritage for future generations.",
    organizationName: "Temple Conservation Society",
    targetAmount: 2000000,
    currentAmount: 1200000,
    daysLeft: 45,
    donorCount: 856,
    category: "temple",
    isVerified: true
  },
  {
    id: "3",
    title: "Free Education for Underprivileged Children",
    description: "Providing quality education and spiritual values to children from economically disadvantaged backgrounds.",
    organizationName: "Jain Education Foundation",
    targetAmount: 300000,
    currentAmount: 185000,
    daysLeft: 30,
    donorCount: 423,
    category: "education",
    isVerified: true
  }
];

export function CommunityNewsScreen() {
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set(["2", "3"]));
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  const toggleLike = (articleId: string) => {
    setLikedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(articleId)) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "news": return "bg-primary text-primary-foreground";
      case "announcement": return "bg-jade text-jade-foreground";
      case "spiritual": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCampaignCategoryColor = (category: string) => {
    switch (category) {
      case "temple": return "bg-primary text-primary-foreground";
      case "animal": return "bg-jade text-jade-foreground"; 
      case "education": return "bg-soft-blue text-soft-blue-foreground";
      case "environment": return "bg-secondary text-secondary-foreground";
      case "humanitarian": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-dawn p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Community Hub</h1>
          <p className="text-muted-foreground">Stay connected with our global family</p>
        </div>
        <Button variant="outline" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
      </div>

      {/* News & Updates - No Sacred Causes */}
      <div className="space-y-4">

        {/* Announcements & Updates */}
        <div className="space-y-4">
          {newsArticles.map((article) => (
              <Card key={article.id} className="shadow-gentle">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                        {article.location && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{article.location}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-6">{article.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {article.content}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(article.id)}
                      className={bookmarkedArticles.has(article.id) ? "text-primary" : ""}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(article.id)}
                        className={likedArticles.has(article.id) ? "text-red-500" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-1 ${likedArticles.has(article.id) ? "fill-current" : ""}`} />
                        <span className="text-xs">{article.likes + (likedArticles.has(article.id) ? 1 : 0)}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">{article.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        {/* Load More */}
        <Button variant="outline" className="w-full">
          Load More Updates
        </Button>
      </div>
    </div>
  );
}