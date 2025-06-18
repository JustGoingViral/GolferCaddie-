import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BottomNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  return (
    <nav className="bg-white border-t border-neutral-200 py-2 fixed bottom-0 left-0 right-0 z-50">
      <div className="container mx-auto px-2">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center px-2 py-2 min-h-[60px] flex-1",
              activeTab === "caddie" ? "text-primary" : "text-neutral-600"
            )}
            onClick={() => onTabChange("caddie")}
          >
            <span className="material-icons text-lg">golf_course</span>
            <span className="text-xs mt-1">Caddie</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center px-2 py-2 min-h-[60px] flex-1",
              activeTab === "course" ? "text-primary" : "text-neutral-600"
            )}
            onClick={() => onTabChange("course")}
          >
            <span className="material-icons text-lg">map</span>
            <span className="text-xs mt-1">Course</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center px-2 py-2 min-h-[60px] flex-1",
              activeTab === "scorecard" ? "text-primary" : "text-neutral-600"
            )}
            onClick={() => onTabChange("scorecard")}
          >
            <span className="material-icons text-lg">scoreboard</span>
            <span className="text-xs mt-1">Score</span>
          </Button>
          
          <Button
            variant="ghost"
            className={cn(
              "flex flex-col items-center px-2 py-2 min-h-[60px] flex-1",
              activeTab === "shots" ? "text-primary" : "text-neutral-600"
            )}
            onClick={() => onTabChange("shots")}
          >
            <span className="material-icons text-lg">equalizer</span>
            <span className="text-xs mt-1">Stats</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
