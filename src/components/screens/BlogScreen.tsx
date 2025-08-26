import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play,
  BookOpen,
  Clock,
  User,
  Search
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar?: string;
  image?: string;
  youtubeUrl?: string;
  tags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  isLiked: boolean;
}

const mockBlogs: BlogPost[] = [
  {
    id: '1',
    title: 'Healthy Fasting Foods: What to Eat During Upvas',
    content: 'During Jain fasting, it\'s important to choose foods that are pure and provide sustained energy. Here are some traditional and healthy options that align with our spiritual practice...',
    author: 'Dr. Priya Jain',
    authorAvatar: '',
    image: '/placeholder.svg',
    youtubeUrl: 'https://youtube.com/watch?v=example1',
    tags: ['Nutrition', 'Fasting', 'Health'],
    likes: 24,
    comments: 8,
    createdAt: '2 hours ago',
    isLiked: false
  },
  {
    id: '2',
    title: 'Meditation Techniques for Spiritual Growth',
    content: 'Simple meditation practices that can enhance your spiritual journey and complement your fasting practice. These techniques have been passed down through generations...',
    author: 'Acharya Shri Vijay',
    authorAvatar: '',
    tags: ['Meditation', 'Spirituality', 'Practice'],
    likes: 45,
    comments: 12,
    createdAt: '1 day ago',
    isLiked: true
  },
  {
    id: '3',
    title: 'Preparing Mind and Body for Paryushan',
    content: 'As we approach the holy period of Paryushan, here are some ways to prepare yourself mentally and physically for this sacred time of reflection and purification...',
    author: 'Sunita Mehta',
    authorAvatar: '',
    image: '/placeholder.svg',
    youtubeUrl: 'https://youtube.com/watch?v=example3',
    tags: ['Paryushan', 'Preparation', 'Festival'],
    likes: 67,
    comments: 23,
    createdAt: '3 days ago',
    isLiked: false
  }
];

export function BlogScreen() {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    image: '',
    youtubeUrl: '',
    tags: ''
  });

  const handleLike = (blogId: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId 
        ? { ...blog, isLiked: !blog.isLiked, likes: blog.isLiked ? blog.likes - 1 : blog.likes + 1 }
        : blog
    ));
  };

  const handleCreateBlog = () => {
    if (newBlog.title && newBlog.content) {
      const blog: BlogPost = {
        id: Date.now().toString(),
        title: newBlog.title,
        content: newBlog.content,
        author: 'You',
        image: newBlog.image || undefined,
        youtubeUrl: newBlog.youtubeUrl || undefined,
        tags: newBlog.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        likes: 0,
        comments: 0,
        createdAt: 'Just now',
        isLiked: false
      };
      
      setBlogs([blog, ...blogs]);
      setNewBlog({ title: '', content: '', image: '', youtubeUrl: '', tags: '' });
      setShowCreateModal(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderYouTubeEmbed = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return (
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Community Blogs
          </h1>
          <p className="text-muted-foreground">Share knowledge and learn from the community</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button variant="sacred" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Write Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="Enter blog title..."
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  placeholder="Write your blog content..."
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  value={newBlog.image}
                  onChange={(e) => setNewBlog({ ...newBlog, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube URL (optional)</Label>
                <Input
                  id="youtube"
                  value={newBlog.youtubeUrl}
                  onChange={(e) => setNewBlog({ ...newBlog, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newBlog.tags}
                  onChange={(e) => setNewBlog({ ...newBlog, tags: e.target.value })}
                  placeholder="Health, Fasting, Spirituality"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateBlog} className="flex-1">
                  Publish Blog
                </Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="shadow-gentle">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={blog.authorAvatar} />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{blog.author}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{blog.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="mt-2 text-lg">{blog.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">{blog.content}</p>
              
              {/* Image */}
              {blog.image && (
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              {/* YouTube Embed */}
              {blog.youtubeUrl && renderYouTubeEmbed(blog.youtubeUrl)}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(blog.id)}
                    className={blog.isLiked ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${blog.isLiked ? 'fill-current' : ''}`} />
                    {blog.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {blog.comments}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}