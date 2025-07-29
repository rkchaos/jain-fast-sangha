import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { TodayScreen } from "@/components/screens/TodayScreen";
import { CalendarScreen } from "@/components/screens/CalendarScreen";
import { LeaderboardScreen } from "@/components/screens/LeaderboardScreen";
import { CommunityScreen } from "@/components/screens/CommunityScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isOnboarded, setIsOnboarded] = useState(false); // Set to true to skip onboarding

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <TodayScreen />;
      case "calendar":
        return <CalendarScreen />;
      case "leaderboard":
        return <LeaderboardScreen />;
      case "community":
        return <CommunityScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <TodayScreen />;
    }
  };

  if (!isOnboarded) {
    return <OnboardingScreen onComplete={() => setIsOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {renderActiveScreen()}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
