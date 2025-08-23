import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Plus } from 'lucide-react';

interface Sangha {
  id: string;
  name: string;
  memberCount: number;
  location: string;
  isPrivate: boolean;
}

interface SanghaSelectorProps {
  userId: string;
  onJoin: (sanghaId: string) => void;
  onCreate: (sangha: { name: string; privacy: 'public' | 'private'; description?: string }) => void;
}

// Mock data for existing sanghas
const mockSanghas: Sangha[] = [
  { id: '1', name: 'Mumbai Jain Samaj', memberCount: 245, location: 'Mumbai', isPrivate: false },
  { id: '2', name: 'Delhi Digambar Jain Sabha', memberCount: 189, location: 'Delhi', isPrivate: false },
  { id: '3', name: 'Pune Shwetambar Murtipujak', memberCount: 156, location: 'Pune', isPrivate: false },
  { id: '4', name: 'Bangalore Jain Society', memberCount: 98, location: 'Bangalore', isPrivate: false },
  { id: '5', name: 'Ahmedabad Jain Sangh', memberCount: 312, location: 'Ahmedabad', isPrivate: false },
];

export const SanghaSelector: React.FC<SanghaSelectorProps> = ({ userId, onJoin, onCreate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    privacy: 'public' as 'public' | 'private',
    description: ''
  });

  const filteredSanghas = mockSanghas.filter(sangha =>
    sangha.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sangha.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (createForm.name.trim()) {
      onCreate({
        name: createForm.name.trim(),
        privacy: createForm.privacy,
        description: createForm.description.trim() || undefined
      });
      setIsCreateModalOpen(false);
      setCreateForm({ name: '', privacy: 'public', description: '' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Join a Sangha</h1>
          <p className="text-sm text-muted-foreground">
            Join a group near you or start a new Sangha. You can join more later.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search sanghas by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sangha List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredSanghas.map((sangha) => (
            <Card key={sangha.id} className="hover:shadow-gentle transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{sangha.name}</h3>
                      {sangha.isPrivate && (
                        <Badge variant="outline" className="text-xs">Private</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {sangha.memberCount} members
                      </span>
                      <span>{sangha.location}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onJoin(sangha.id)}
                    className="ml-4"
                  >
                    Join Sangha
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Sangha Button */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Create Sangha
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Sangha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sangha-name">Sangha Name *</Label>
                <Input
                  id="sangha-name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter sangha name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="privacy">Privacy</Label>
                <Select
                  value={createForm.privacy}
                  onValueChange={(value: 'public' | 'private') => 
                    setCreateForm(prev => ({ ...prev, privacy: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your sangha..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleCreate} 
                className="w-full" 
                disabled={!createForm.name.trim()}
              >
                Create and Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};