import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Crown, Medal, Users, Mail, Phone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserSangha {
  id: string;
  name: string;
  role: 'admin' | 'member';
}

interface LeaderboardUser {
  id: string;
  name: string;
  streak: number;
  rank: number;
  email?: string;
  phone?: string;
}

interface SanghaMetrics {
  totalMembers: number;
  activeMembers: number;
  averageStreak: number;
  topStreak: number;
}

interface SanghaLeaderboardProps {
  userSanghas: UserSangha[];
}

export function SanghaLeaderboard({ userSanghas }: SanghaLeaderboardProps) {
  const [selectedSangha, setSelectedSangha] = useState<string>('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [metrics, setMetrics] = useState<SanghaMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (userSanghas.length > 0 && !selectedSangha) {
      setSelectedSangha(userSanghas[0].id);
    }
  }, [userSanghas]);

  useEffect(() => {
    if (selectedSangha) {
      fetchSanghaLeaderboard();
      
      // Set up real-time subscription for membership changes
      const channel = supabase
        .channel('sangha-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'memberships',
            filter: `sangha_id=eq.${selectedSangha}`
          },
          () => {
            console.log('Membership change detected, refreshing leaderboard...');
            fetchSanghaLeaderboard();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'vrat_records'
          },
          () => {
            console.log('Vrat record change detected, refreshing leaderboard...');
            fetchSanghaLeaderboard();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedSangha]);

  const fetchSanghaLeaderboard = async () => {
    if (!selectedSangha) return;
    
    setLoading(true);
    try {
      // Get sangha members with their profiles using proper join
      const { data: members, error: membersError } = await supabase
        .from('memberships')
        .select(`
          user_id,
          profiles!memberships_user_id_fkey (id, name, email, phone)
        `)
        .eq('sangha_id', selectedSangha);

      console.log('Fetched members for sangha:', selectedSangha, members);

      if (membersError) throw membersError;

      // Calculate streaks for each member
      const leaderboardData = await Promise.all(
        members.map(async (member) => {
          const { data: vrats } = await supabase
            .from('vrat_records')
            .select('date, status')
            .eq('user_id', member.user_id)
            .eq('status', 'success')
            .order('date', { ascending: false })
            .limit(365);

          // Calculate current streak
          let streak = 0;
          const today = new Date();
          
          if (vrats && vrats.length > 0) {
            const sortedDates = vrats.map(v => new Date(v.date)).sort((a, b) => b.getTime() - a.getTime());
            
            // Check if there's a vrat from today or yesterday
            const daysSinceLastVrat = Math.floor((today.getTime() - sortedDates[0].getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSinceLastVrat <= 1) {
              let currentDate = sortedDates[0];
              streak = 1;
              
              for (let i = 1; i < sortedDates.length; i++) {
                const daysDiff = Math.floor((currentDate.getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24));
                if (daysDiff === 1) {
                  streak++;
                  currentDate = sortedDates[i];
                } else {
                  break;
                }
              }
            }
          }

          return {
            id: member.user_id,
            name: member.profiles?.name || 'Anonymous',
            email: member.profiles?.email || '',
            phone: member.profiles?.phone || '',
            streak,
            rank: 0 // Will be set after sorting
          };
        })
      );

      // Sort by streak and assign ranks
      leaderboardData.sort((a, b) => b.streak - a.streak);
      leaderboardData.forEach((user, index) => {
        user.rank = index + 1;
      });

      setLeaderboard(leaderboardData);

      // Calculate metrics
      const totalMembers = leaderboardData.length;
      const activeMembers = leaderboardData.filter(user => user.streak > 0).length;
      const averageStreak = totalMembers > 0 ? Math.round(leaderboardData.reduce((sum, user) => sum + user.streak, 0) / totalMembers) : 0;
      const topStreak = leaderboardData.length > 0 ? leaderboardData[0].streak : 0;

      setMetrics({
        totalMembers,
        activeMembers,
        averageStreak,
        topStreak
      });

      console.log('Leaderboard metrics updated:', {
        totalMembers,
        activeMembers,
        averageStreak,
        topStreak
      });

    } catch (error) {
      console.error('Error fetching sangha leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-600" />;
      default:
        return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-muted';
    }
  };

  if (userSanghas.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Sanghas Yet</h3>
        <p className="text-muted-foreground">Join a sangha to see the leaderboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Sangha Leaderboard</h3>
          <p className="text-muted-foreground text-sm">See how you rank among your sangha members</p>
        </div>
        
        <Select value={selectedSangha} onValueChange={setSelectedSangha}>
          <SelectTrigger>
            <SelectValue placeholder="Select a sangha" />
          </SelectTrigger>
          <SelectContent>
            {userSanghas.map((sangha) => (
              <SelectItem key={sangha.id} value={sangha.id}>
                {sangha.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{metrics.totalMembers}</div>
                <p className="text-xs text-muted-foreground">Total Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.activeMembers}</div>
                <p className="text-xs text-muted-foreground">Active Members</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.averageStreak}</div>
                <p className="text-xs text-muted-foreground">Avg Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.topStreak}</div>
                <p className="text-xs text-muted-foreground">Top Streak</p>
              </CardContent>
            </Card>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading leaderboard...</p>
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Rankings
              </CardTitle>
              <Dialog open={showMemberList} onOpenChange={setShowMemberList}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Sangha Members</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {leaderboard.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {member.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {member.email}
                                </div>
                              )}
                              {member.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {member.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{member.streak} days</Badge>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 10).map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      member.id === user?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(member.rank)}`}>
                        {getRankIcon(member.rank)}
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.streak} day streak
                        </p>
                      </div>
                    </div>
                    {member.id === user?.id && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                ))}
                
                {leaderboard.length === 0 && (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No members found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}