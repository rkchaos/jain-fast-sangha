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
    author: "Jain Times Editorial",
    date: "2 hours ago",
    category: "news",
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
    author: "Community Updates",
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
    author: "Spiritual Digest",
    date: "1 day ago",
    category: "spiritual",
    likes: 234,
    comments: 45,
    isLiked: true,
    tags: ["Spiritual", "Teaching", "Mindfulness"]
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

      {/* Tabs */}
      <Tabs defaultValue="news">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news">News & Updates</TabsTrigger>
          <TabsTrigger value="causes">Sacred Causes</TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-4">
          {/* Featured News */}
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
            Load More Articles
          </Button>
        </TabsContent>

        <TabsContent value="causes" className="space-y-4">
          {/* Campaign Stats */}
          <Card className="shadow-gentle">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">₹12.5M</p>
                  <p className="text-xs text-muted-foreground">Total Raised</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-jade">45</p>
                  <p className="text-xs text-muted-foreground">Active Campaigns</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-secondary">2,847</p>
                  <p className="text-xs text-muted-foreground">Donors This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="shadow-gentle">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCampaignCategoryColor(campaign.category)}>
                          {campaign.category}
                        </Badge>
                        {campaign.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {campaign.description}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        by {campaign.organizationName}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {formatAmount(campaign.currentAmount)} raised
                      </span>
                      <span className="text-sm text-muted-foreground">
                        of {formatAmount(campaign.targetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={(campaign.currentAmount / campaign.targetAmount) * 100} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>{Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}% complete</span>
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{campaign.donorCount} donors</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {Math.round((campaign.currentAmount / campaign.targetAmount) * 100)}% funded
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button variant="sacred" className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate Now
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View All Campaigns */}
          <Button variant="outline" className="w-full">
            View All Active Campaigns
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}