import { useState } from "react";
import { BottomNavigation } from "@/components/BottomNavigation";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { EnhancedTodayScreen } from "@/components/screens/EnhancedTodayScreen";
import { CalendarScreen } from "@/components/screens/CalendarScreen";
import { SanghaHubScreen } from "@/components/screens/SanghaHubScreen";
import { CommunityNewsScreen } from "@/components/screens/CommunityNewsScreen";
import { MonkNetworkScreen } from "@/components/screens/MonkNetworkScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isOnboarded, setIsOnboarded] = useState(false); // Set to true to skip onboarding

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <EnhancedTodayScreen />;
      case "calendar":
        return <CalendarScreen />;
      case "sangha":
        return <SanghaHubScreen />;
      case "community":
        return <CommunityNewsScreen />;
      case "spiritual":
        return <MonkNetworkScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <EnhancedTodayScreen />;
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
