import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { EnhancedOnboarding } from "@/components/onboarding/EnhancedOnboarding";
import { TodayPage } from "@/components/today/TodayPage";
import { SanghaHubScreen } from "@/components/screens/SanghaHubScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { BlogScreen } from "@/components/screens/BlogScreen";
import { CommunityNewsScreen } from "@/components/screens/CommunityNewsScreen";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <TodayPage />;
      case "leaderboard":
        return <LeaderboardScreen />;
      case "sangha":
        return <SanghaHubScreen />;
      case "blogs":
        return <BlogScreen />;
      case "community":
        return <CommunityNewsScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <TodayPage />;
    }
  };

  if (!user) {
    return <EnhancedOnboarding onComplete={() => {
      // Force re-check of auth state instead of page reload
      window.location.hash = '';
      setActiveTab('home');
    }} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
