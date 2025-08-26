import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { EnhancedOnboarding } from "@/components/onboarding/EnhancedOnboarding";
import { TodayPage } from "@/components/today/TodayPage";
import { CalendarPage } from "@/components/calendar/CalendarPage";
import { SanghaHubScreen } from "@/components/screens/SanghaHubScreen";
import { CommunityNewsScreen } from "@/components/screens/CommunityNewsScreen";
import { MonkNetworkScreen } from "@/components/screens/MonkNetworkScreen";
import { BlogScreen } from "@/components/screens/BlogScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
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
      case "calendar":
        return <CalendarPage />;
      case "sangha":
        return <SanghaHubScreen />;
      case "blogs":
        return <BlogScreen />;
      case "community":
        return <CommunityNewsScreen />;
      case "spiritual":
        return <MonkNetworkScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <TodayPage />;
    }
  };

  if (!user) {
    return <EnhancedOnboarding onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
