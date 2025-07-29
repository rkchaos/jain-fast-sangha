import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Plus, Users, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface SanghaGroup {
  id: string;
  name: string;
  memberCount: number;
  isActive: boolean;
  currentEvent?: string;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export function CommunityScreen() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Sample Sangha groups
  const sanghaGroups: SanghaGroup[] = [
    {
      id: "1",
      name: "Mumbai Jain Centre",
      memberCount: 156,
      isActive: true,
      currentEvent: "Das Lakshan Parv - Day 3"
    },
    {
      id: "2",
      name: "Delhi Jain Community",
      memberCount: 89,
      isActive: false
    },
    {
      id: "3",
      name: "Pune Jain Samaj",
      memberCount: 203,
      isActive: true,
      currentEvent: "Ashtami Vrat"
    }
  ];

  // Sample community posts
  const communityPosts: CommunityPost[] = [
    {
      id: "1",
      author: "Priya Mehta",
      content: "Day 3 of Ekasana fast completed! 🙏 The mental clarity is incredible. May we all find strength in our practice.",
      timestamp: "2 hours ago",
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: "2",
      author: "Raj Jain",
      content: "Beautiful sermon on Ahimsa today at the temple. Reminder that our fasts purify not just the body but the soul. 🕉️",
      timestamp: "4 hours ago",
      likes: 8,
      comments: 2,
      isLiked: true
    },
    {
      id: "3",
      author: "Meera Shah",
      content: "Starting Ath Avtari fast tomorrow. Looking forward to this spiritual journey with our Sangha family! 💫",
      timestamp: "6 hours ago",
      likes: 15,
      comments: 5,
      isLiked: false
    }
  ];

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-center mb-6">Sangha Community</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-20 space-y-6">
        {/* Joined Sanghas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Sanghas</h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Join New
            </Button>
          </div>
          
          <div className="space-y-3">
            {sanghaGroups.map((sangha) => (
              <Card key={sangha.id} className="shadow-gentle">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-peaceful rounded-full p-3">
                        <Users className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{sangha.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sangha.memberCount} members
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {sangha.isActive && sangha.currentEvent && (
                        <Badge variant="secondary" className="mb-2">
                          Active
                        </Badge>
                      )}
                      <Button variant="peaceful" size="sm">
                        {sangha.currentEvent ? "Join Fast" : "View"}
                      </Button>
                    </div>
                  </div>
                  {sangha.currentEvent && (
                    <div className="mt-3 p-3 bg-accent/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{sangha.currentEvent}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Feed */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Community Updates</h2>
          
          <div className="space-y-4">
            {communityPosts.map((post) => {
              const isLiked = likedPosts.has(post.id) || post.isLiked;
              
              return (
                <Card key={post.id} className="shadow-gentle">
                  <CardContent className="p-4">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-gradient-peaceful">
                          {getInitials(post.author)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{post.author}</h4>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm leading-relaxed mb-4">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={cn(
                          "flex items-center gap-2 text-sm transition-colors",
                          isLiked 
                            ? "text-red-500" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Heart 
                          className={cn(
                            "h-4 w-4 transition-all",
                            isLiked && "fill-current animate-gentle-bounce"
                          )} 
                        />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}