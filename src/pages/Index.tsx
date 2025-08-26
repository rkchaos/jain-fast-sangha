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

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isOnboarded, setIsOnboarded] = useState(false); // Set to true to skip onboarding

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

  if (!isOnboarded) {
    return <EnhancedOnboarding onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
