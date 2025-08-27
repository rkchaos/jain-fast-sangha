import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, Users, Trophy, Crown, Medal, Search, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { SanghaLeaderboard } from '@/components/today/SanghaLeaderboard';

interface Sangha {
  id: string;
  name: string;
  description?: string;
  privacy: 'public' | 'private';
  created_at: string;
  memberCount?: number;
}

interface UserSangha extends Sangha {
  role: 'admin' | 'member';
  joined_at: string;
}

export function SanghaHubScreen() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableSanghas, setAvailableSanghas] = useState<Sangha[]>([]);
  const [userSanghas, setUserSanghas] = useState<UserSangha[]>([]);
  const [loading, setLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    city: '',
    state: '',
    communityType: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAvailableSanghas();
      fetchUserSanghas();

      // Set up real-time subscription for sangha changes
      const channel = supabase
        .channel('sangha-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'memberships'
          },
          () => {
            console.log('Membership change detected, refreshing sanghas...');
            fetchAvailableSanghas();
            fetchUserSanghas();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchAvailableSanghas = async () => {
    try {
      setLoading(true);
      const { data: sanghas, error } = await supabase
        .from('sanghas')
        .select('*')
        .eq('privacy', 'public');
      
      if (error) throw error;
      
      // Get member counts for each sangha
      const sanghsWithCounts = await Promise.all(
        sanghas.map(async (sangha) => {
          const { count } = await supabase
            .from('memberships')
            .select('*', { count: 'exact' })
            .eq('sangha_id', sangha.id);
          
          return {
            ...sangha,
            memberCount: count || 0
          };
        })
      );
      
      setAvailableSanghas(sanghsWithCounts);
    } catch (error: any) {
      console.error('Error fetching sanghas:', error);
      toast.error('Failed to load sanghas');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSanghas = async () => {
    if (!user) return;
    
    try {
      const { data: memberships, error } = await supabase
        .from('memberships')
        .select(`
          *,
          sanghas!inner (*)
        `)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      const userSanghas = memberships.map(membership => ({
        ...membership.sanghas,
        role: membership.role,
        joined_at: membership.joined_at
      }));
      
      setUserSanghas(userSanghas);
    } catch (error: any) {
      console.error('Error fetching user sanghas:', error);
    }
  };

  const handleJoinSangha = async (sanghaId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from('memberships')
        .select('id')
        .eq('user_id', user.id)
        .eq('sangha_id', sanghaId)
        .maybeSingle();
        
      if (existingMembership) {
        toast.error('You are already a member of this sangha!');
        return;
      }
      
      const { error } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          sangha_id: sanghaId,
          role: 'member'
        });
      
      if (error) throw error;
      
      toast.success('Successfully joined sangha!');
      fetchUserSanghas();
      fetchAvailableSanghas();
    } catch (error: any) {
      console.error('Error joining sangha:', error);
      toast.error('Failed to join sangha');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSangha = async () => {
    if (!user || !createForm.name || !createForm.city || !createForm.state || !createForm.communityType) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Create sangha
      const { data: sangha, error: sanghaError } = await supabase
        .from('sanghas')
        .insert({
          name: createForm.name,
          description: `${createForm.communityType} community in ${createForm.city}, ${createForm.state}`,
          privacy: 'public'
        })
        .select()
        .single();
      
      if (sanghaError) throw sanghaError;
      
      // Add creator as admin
      const { error: membershipError } = await supabase
        .from('memberships')
        .insert({
          user_id: user.id,
          sangha_id: sangha.id,
          role: 'admin'
        });
      
      if (membershipError) throw membershipError;
      
      toast.success('Sangha created successfully!');
      setCreateForm({ name: '', city: '', state: '', communityType: '' });
      fetchUserSanghas();
      fetchAvailableSanghas();
    } catch (error: any) {
      console.error('Error creating sangha:', error);
      toast.error('Failed to create sangha');
    } finally {
      setLoading(false);
    }
  };

  const filteredSanghas = availableSanghas.filter(sangha =>
    sangha.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sangha Hub</h1>
              <p className="text-muted-foreground mt-1">Connect, grow, and find inspiration in your community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="join">Join</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="join">Join Sangha</TabsTrigger>
              <TabsTrigger value="create">Create New Sangha</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="join" className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search sanghas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading sanghas...</p>
              </div>
            ) : filteredSanghas.length > 0 ? (
              <div className="grid gap-4">
                {filteredSanghas.map((sangha) => (
                  <Card key={sangha.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{sangha.name}</CardTitle>
                          <CardDescription>{sangha.description}</CardDescription>
                        </div>
                        <Button 
                          onClick={() => handleJoinSangha(sangha.id)}
                          disabled={loading}
                        >
                          Join
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {sangha.memberCount} members
                        </div>
                        <Badge variant="secondary">{sangha.privacy}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Sanghas Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or create a new sangha</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create New Sangha</CardTitle>
                <CardDescription>Start a new community for spiritual growth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sangha-name">Sangha Name</Label>
                  <Input
                    id="sangha-name"
                    placeholder="Enter sangha name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City/District</Label>
                    <Input
                      id="city"
                      placeholder="Enter city or district"
                      value={createForm.city}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={createForm.state}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="community-type">Community Type</Label>
                  <Select 
                    value={createForm.communityType} 
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, communityType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select community type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shwetambar">Shwetambar</SelectItem>
                      <SelectItem value="Digambar">Digambar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleCreateSangha} 
                  className="w-full"
                  disabled={loading || !createForm.name || !createForm.city || !createForm.state || !createForm.communityType}
                >
                  {loading ? 'Creating...' : 'Create Sangha'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <SanghaLeaderboard userSanghas={userSanghas} />
          </TabsContent>
        </Tabs>

        {/* WhatsApp Share Template */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">📱 Share with Community</h3>
          <p className="text-sm text-muted-foreground mb-3">Copy this message to share on WhatsApp:</p>
          <div className="p-3 bg-background rounded border text-sm">
            🙏 **Samvatsari Tapasya Tracker** 🙏<br/><br/>
            
            Celebrate this auspicious Samvatsari with mindful fasting! Track your spiritual journey with our new webapp:<br/><br/>
            
            🔗 **tapasyatracker.rashtechnologies.com**<br/><br/>
            
            ✨ **Features:**<br/>
            📊 Track daily vrats (Upvas, Ekasna, Ayambil)<br/>
            🏆 Join Sangha leaderboards<br/>
            📈 View progress analytics<br/>
            💬 Community support<br/><br/>
            
            📱 **Coming Soon:** Mobile app for even easier tracking!<br/>
            🎥 **Demo video** launching this week<br/><br/>
            
            Join our community and make this Samvatsari more meaningful. Try it today and share your feedback! 🙏<br/><br/>
            
            #Samvatsari2024 #TapasyaTracker #JainCommunity
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={() => {
              navigator.clipboard.writeText(`🙏 Samvatsari Tapasya Tracker 🙏

Celebrate this auspicious Samvatsari with mindful fasting! Track your spiritual journey with our new webapp:

🔗 tapasyatracker.rashtechnologies.com

✨ Features:
📊 Track daily vrats (Upvas, Ekasna, Ayambil)
🏆 Join Sangha leaderboards  
📈 View progress analytics
💬 Community support

📱 Coming Soon: Mobile app for even easier tracking!
🎥 Demo video launching this week

Join our community and make this Samvatsari more meaningful. Try it today and share your feedback! 🙏

#Samvatsari2024 #TapasyaTracker #JainCommunity`);
              toast.success('Message copied to clipboard!');
            }}
          >
            Copy WhatsApp Message
          </Button>
        </div>

        {/* Backend Access Info */}
        <div className="mt-6 p-4 bg-accent/20 rounded-lg">
          <h3 className="font-semibold mb-2">🔧 Backend Management</h3>
          <p className="text-sm text-muted-foreground mb-3">Admin access for content management:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <a 
              href="https://supabase.com/dashboard/project/jakdsjslactlnullqtec/editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-background rounded border hover:bg-muted/50"
            >
              📊 Database Editor - Manage users, vrats, sanghas
            </a>
            <a 
              href="https://supabase.com/dashboard/project/jakdsjslactlnullqtec/auth/users" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 bg-background rounded border hover:bg-muted/50"
            >
              👥 User Management - View registered users
            </a>
            <div className="p-2 bg-background rounded border">
              📝 Blog Approval - Update `approved` column in `blogs` table
            </div>
            <div className="p-2 bg-background rounded border">
              📰 News Management - Add/edit entries in `news` table
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}