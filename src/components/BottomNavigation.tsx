import { Home, Trophy, Users, Settings, BookOpen, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Today", enabled: true },
  { id: "leaderboard", icon: Trophy, label: "Leaderboard", enabled: true },
  { id: "sangha", icon: Users, label: "Sangha", enabled: false },
  { id: "blogs", icon: BookOpen, label: "Blogs", enabled: false },
  { id: "community", icon: Award, label: "News", enabled: false },
  { id: "settings", icon: Settings, label: "Settings", enabled: true },
];

export function BottomNavigation({ activeTab, onTabChange }: NavigationProps) {
  const { toast } = useToast();
  
  const handleTabClick = (item: typeof navItems[0]) => {
    if (!item.enabled) {
      toast({
        title: "Coming Soon! 🚧",
        description: `${item.label} feature will be available in the next update.`,
      });
      return;
    }
    onTabChange(item.id);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id && item.enabled;
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300",
                isActive 
                  ? "text-primary transform scale-110" 
                  : item.enabled 
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/50 cursor-pointer"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-all duration-300",
                  isActive && "animate-gentle-bounce",
                  !item.enabled && "opacity-60"
                )} 
              />
              <span className={cn(
                "text-xs font-medium truncate",
                !item.enabled && "opacity-60"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}