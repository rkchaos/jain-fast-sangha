import { Home, Calendar, Trophy, Users, Settings, BookOpen, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "home", icon: Home, label: "Today" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
  { id: "sangha", icon: Users, label: "Sangha" },
  { id: "blogs", icon: BookOpen, label: "Blogs" },
  { id: "community", icon: Award, label: "News" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function BottomNavigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 transition-all duration-300",
                isActive 
                  ? "text-primary transform scale-110" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-all duration-300",
                  isActive && "animate-gentle-bounce"
                )} 
              />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}