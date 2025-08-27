import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Bell, 
  Clock, 
  User, 
  Mail, 
  Users, 
  Share2, 
  LogOut,
  Calendar,
  Moon,
  Sun,
  Key
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SettingsScreen() {
  const { signOut, profile } = useAuth();
  const { toast } = useToast();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    dailyPrompts: true,
    festivalAlerts: true,
    tithiAlerts: false,
    communityUpdates: true
  });

  const userProfile = {
    name: profile?.name || "Your Name",
    email: profile?.email || "your.email@example.com",
    sanghas: [],
    joinDate: "January 2024"
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
        duration: 5000
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
        duration: 5000
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
        duration: 5000
      });
      
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
        duration: 5000
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon! 🚧",
      description: `${feature} will be available in the next update.`
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-center">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-20 space-y-6">
        {/* Profile Section */}
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-peaceful text-lg">
                  {getInitials(userProfile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{userProfile.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {userProfile.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Member since {userProfile.joinDate}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => {
                const mailtoLink = `mailto:rahul@rashtechnologies.com?cc=aayush@rashtechnologies.com,namo@rashtechnologies.com&subject=Tapasya%20Tracker%20Feedback&body=Hi%20team,%0A%0AI%20would%20like%20to%20share%20feedback%20about%20the%20Tapasya%20Tracker%20app:%0A%0A`;
                window.location.href = mailtoLink;
              }}
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </Button>
            
            <div className="space-y-2">
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        minLength={6}
                      />
                    </div>
                    <Button 
                      onClick={handlePasswordChange} 
                      className="w-full" 
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleComingSoon("Profile editing")}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Daily Prompts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive daily micro-fast reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.dailyPrompts}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, dailyPrompts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Festival Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Get notified about upcoming festivals
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.festivalAlerts}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, festivalAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Tithi Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Purnima and Amavasya reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.tithiAlerts}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, tithiAlerts: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Community Updates</p>
                  <p className="text-xs text-muted-foreground">
                    Activity from your Sangha members
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications.communityUpdates}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, communityUpdates: checked }))
                }
              />
            </div>

            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleComingSoon("Notification settings")}
              >
                Set Notification Time
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleComingSoon("App sharing")}
            >
              <Share2 className="h-4 w-4" />
              Share App with Friends
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleComingSoon("Sangha invitations")}
            >
              <Users className="h-4 w-4" />
              Invite to Sangha
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2"
              onClick={() => handleComingSoon("Calendar sync")}
            >
              <Calendar className="h-4 w-4" />
              Sync with Calendar
            </Button>
          </CardContent>
        </Card>

        {/* Ad Preferences */}
        <Card className="shadow-gentle">
          <CardHeader>
            <CardTitle>Ad Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Help us show you relevant content from Jain businesses and community partners.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => handleComingSoon("Ad preferences")}
            >
              Manage Ad Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-gentle">
          <CardContent className="pt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full mb-4"
              onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLScA1d2Zj2yLi1VzbqOYoKVea7B4-MmtHsq1pngRQWipsU1RXQ/viewform?usp=sharing&ouid=110568833292812051355', '_blank')}
            >
              📝 Share Your Feedback
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}