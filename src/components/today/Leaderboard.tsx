import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  streak: number;
  rank: number;
}

interface LeaderboardProps {
  filter?: 'global' | 'sangha' | 'friends';
  currentUserId?: string;
}

// Mock leaderboard data
const mockLeaderboards = {
  global: [
    { id: '1', name: 'Priya Jain', avatar: '', streak: 45, rank: 1 },
    { id: '2', name: 'Ravi Shah', avatar: '', streak: 38, rank: 2 },
    { id: '3', name: 'Anjali Mehta', avatar: '', streak: 32, rank: 3 },
    { id: '4', name: 'Vikram Jain', avatar: '', streak: 28, rank: 4 },
    { id: '5', name: 'Kavita Agarwal', avatar: '', streak: 25, rank: 5 },
    { id: '6', name: 'Deepak Bhandari', avatar: '', streak: 22, rank: 6 },
    { id: '7', name: 'Sunita Jain', avatar: '', streak: 20, rank: 7 },
    { id: '8', name: 'Manish Shah', avatar: '', streak: 18, rank: 8 },
    { id: '9', name: 'Rekha Jain', avatar: '', streak: 15, rank: 9 },
    { id: '10', name: 'Ajay Mehta', avatar: '', streak: 12, rank: 10 },
  ],
  sangha: [
    { id: '1', name: 'Priya Jain', avatar: '', streak: 45, rank: 1 },
    { id: '2', name: 'Ravi Shah', avatar: '', streak: 38, rank: 2 },
    { id: '3', name: 'Anjali Mehta', avatar: '', streak: 32, rank: 3 },
    { id: '4', name: 'Vikram Jain', avatar: '', streak: 28, rank: 4 },
    { id: '5', name: 'Kavita Agarwal', avatar: '', streak: 25, rank: 5 },
  ],
  friends: [
    { id: '1', name: 'Priya Jain', avatar: '', streak: 45, rank: 1 },
    { id: '2', name: 'Ravi Shah', avatar: '', streak: 38, rank: 2 },
    { id: '3', name: 'Anjali Mehta', avatar: '', streak: 32, rank: 3 },
  ]
};

const currentUser = { id: 'current', name: 'You', avatar: '', streak: 15, rank: 23 };

export const Leaderboard: React.FC<LeaderboardProps> = ({ 
  filter = 'global',
  currentUserId = 'current'
}) => {
  const [activeFilter, setActiveFilter] = useState(filter);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-orange-500" />;
      default:
        return <Award className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 2:
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 3:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderUserRow = (user: LeaderboardUser, isCurrentUser: boolean = false) => (
    <div 
      key={user.id} 
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-accent/50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8">
          {user.rank <= 3 ? (
            getRankIcon(user.rank)
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              #{user.rank}
            </span>
          )}
        </div>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar} />
          <AvatarFallback className="text-xs">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <p className="font-medium text-sm">
            {user.name}
            {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
          </p>
        </div>
      </div>
      
      <Badge 
        variant="outline" 
        className={user.rank <= 3 ? getRankColor(user.rank) : ''}
      >
        {user.streak} days
      </Badge>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global" className="text-xs">Global</TabsTrigger>
            <TabsTrigger value="sangha" className="text-xs">Sangha</TabsTrigger>
            <TabsTrigger value="friends" className="text-xs">Friends</TabsTrigger>
          </TabsList>
          
          {(['global', 'sangha', 'friends'] as const).map((filterType) => (
            <TabsContent key={filterType} value={filterType} className="mt-4">
              <div className="space-y-2">
                {mockLeaderboards[filterType].map((user) => renderUserRow(user))}
              </div>
              
              {/* Current User Position (if not in top 10) */}
              {!mockLeaderboards[filterType].find(u => u.id === currentUserId) && (
                <div className="mt-4 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Your position:</p>
                  {renderUserRow(currentUser, true)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};