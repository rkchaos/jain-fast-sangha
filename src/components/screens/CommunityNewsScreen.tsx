import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, MessageCircle, Share2, Clock, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
}

export function CommunityNewsScreen() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    { id: "all", label: "All" },
    { id: "news", label: "News" },
    { id: "events", label: "Events" },
    { id: "announcements", label: "Announcements" },
    { id: "festivals", label: "Festivals" }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_likes (id, user_id),
          news_comments (id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const newsWithCounts = data?.map(item => ({
        ...item,
        likes_count: item.news_likes?.length || 0,
        comments_count: item.news_comments?.length || 0,
        is_liked: user ? item.news_likes?.some((like: any) => like.user_id === user.id) : false
      })) || [];

      setNews(newsWithCounts);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "Error",
        description: "Failed to load news",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (newsId: string) => {
    if (!user) return;

    try {
      const newsItem = news.find(n => n.id === newsId);
      if (!newsItem) return;

      if (newsItem.is_liked) {
        await supabase
          .from('news_likes')
          .delete()
          .match({ news_id: newsId, user_id: user.id });
      } else {
        await supabase
          .from('news_likes')
          .insert({ news_id: newsId, user_id: user.id });
      }

      fetchNews();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-center mb-6">Community News</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap flex-shrink-0"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pb-20">
        {filteredNews.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <ExternalLink className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No News Available</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for community updates and announcements.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card key={item.id} className="shadow-gentle">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-peaceful text-xs">
                        {item.author?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.author}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(item.id)}
                      className="gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Heart className={`h-4 w-4 ${item.is_liked ? 'fill-current text-red-500' : ''}`} />
                      {item.likes_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <MessageCircle className="h-4 w-4" />
                      {item.comments_count}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}