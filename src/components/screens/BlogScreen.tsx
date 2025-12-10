import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookOpen,
  Clock,
  User,
  Search,
  Filter,
  PlusCircle
} from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  image_url?: string;
  youtube_url?: string;
  created_at: string;
  user_id: string;
  user_name?: string;
  likes_count?: number;
  comments_count?: number;
  is_liked?: boolean;
  needs_review?: boolean;
}

const blogCategories = [
  'All',
  'community',
  'spiritual', 
  'teachings',
  'personal'
];

export function BlogScreen() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    category: "community",
    tags: "",
    image_url: "",
    youtube_url: ""
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Get all approved blogs for public view
      const { data: approvedBlogs, error: approvedError } = await supabase
        .from('blogs')
        .select(`
          *,
          blog_likes (id, user_id),
          blog_comments (id)
        `)
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (approvedError) throw approvedError;

      let allBlogs = approvedBlogs || [];

      // If user is logged in, also get their pending blogs
      if (user) {
        const { data: userBlogs, error: userError } = await supabase
          .from('blogs')
          .select(`
            *,
            blog_likes (id, user_id),
            blog_comments (id)
          `)
          .eq('user_id', user.id)
          .eq('approved', false)
          .order('created_at', { ascending: false });

        if (userError) throw userError;

        // Merge user's pending blogs with approved blogs
        allBlogs = [...(userBlogs || []), ...allBlogs];
      }

      // Fetch profile names for all blog authors
      const userIds = [...new Set(allBlogs.map(blog => blog.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.name]) || []);

      const blogsWithCounts = allBlogs.map(blog => ({
        ...blog,
        user_name: profileMap.get(blog.user_id) || 'Anonymous',
        likes_count: blog.blog_likes?.length || 0,
        comments_count: blog.blog_comments?.length || 0,
        is_liked: user ? blog.blog_likes?.some((like: any) => like.user_id === user.id) : false,
        needs_review: !blog.approved && blog.user_id === user?.id
      }));

      setBlogs(blogsWithCounts);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast({
        title: "Error",
        description: "Failed to load blogs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .insert({
          title: newBlog.title,
          content: newBlog.content,
          category: newBlog.category as "community" | "spiritual" | "teachings" | "personal",
          tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          image_url: newBlog.image_url || null,
          youtube_url: newBlog.youtube_url || null,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Blog Submitted!",
        description: "Your blog has been submitted for review and will be visible once approved.",
      });

      setIsCreateModalOpen(false);
      setNewBlog({
        title: "",
        content: "",
        category: "community",
        tags: "",
        image_url: "",
        youtube_url: ""
      });
      
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
      toast({
        title: "Error",
        description: "Failed to create blog",
        variant: "destructive"
      });
    }
  };

  const handleLike = async (blogId: string) => {
    if (!user) return;

    try {
      const blog = blogs.find(b => b.id === blogId);
      if (!blog) return;

      if (blog.is_liked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .match({ blog_id: blogId, user_id: user.id });
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({ blog_id: blogId, user_id: user.id });
      }

      fetchBlogs();
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Community Blogs
          </h1>
          {user && (
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Write
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Blog</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                      placeholder="Write your blog content..."
                      rows={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newBlog.category} onValueChange={(value) => setNewBlog({...newBlog, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.filter(cat => cat !== 'All').map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                      placeholder="spirituality, meditation, dharma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      id="image_url"
                      value={newBlog.image_url}
                      onChange={(e) => setNewBlog({...newBlog, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube_url">YouTube URL (optional)</Label>
                    <Input
                      id="youtube_url"
                      value={newBlog.youtube_url}
                      onChange={(e) => setNewBlog({...newBlog, youtube_url: e.target.value})}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  <Button 
                    onClick={handleCreateBlog} 
                    className="w-full"
                    disabled={!newBlog.title || !newBlog.content}
                  >
                    Submit for Approval
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blogCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Blog List */}
      <div className="flex-1 px-6 pb-20">
        {filteredBlogs.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <PlusCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Blogs Yet</h3>
              <p className="text-sm text-muted-foreground">
                Be the first to share your spiritual journey with the community!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className={`shadow-gentle ${blog.needs_review ? 'border-yellow-500 bg-yellow-50/50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-peaceful text-xs">
                        {blog.user_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{blog.user_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {blog.category}
                        </Badge>
                        {blog.needs_review && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Under Review
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{blog.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blog.image_url && (
                    <img 
                      src={blog.image_url} 
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {blog.content}
                  </p>

                  {blog.youtube_url && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2">Video:</p>
                      <a 
                        href={blog.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary text-sm hover:underline"
                      >
                        Watch on YouTube
                      </a>
                    </div>
                  )}

                  {blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.map((tag, index) => (
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
                      onClick={() => handleLike(blog.id)}
                      className="gap-2 text-muted-foreground hover:text-primary"
                    >
                      <Heart className={`h-4 w-4 ${blog.is_liked ? 'fill-current text-red-500' : ''}`} />
                      {blog.likes_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-primary"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {blog.comments_count}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-primary"
                    >
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