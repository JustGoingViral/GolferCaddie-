import { cn } from "@/lib/utils";

type TabNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  return (
    <div className="flex border-b border-neutral-200 mb-4">
      <button
        className={cn(
          "flex-1 py-2 px-4 font-medium border-b-2",
          activeTab === "caddie"
            ? "border-primary text-primary"
            : "border-transparent text-neutral-600"
        )}
        onClick={() => onTabChange("caddie")}
      >
        Caddie
      </button>
      
      <button
        className={cn(
          "flex-1 py-2 px-4 font-medium border-b-2",
          activeTab === "scorecard"
            ? "border-primary text-primary"
            : "border-transparent text-neutral-600"
        )}
        onClick={() => onTabChange("scorecard")}
      >
        Scorecard
      </button>
      
      <button
        className={cn(
          "flex-1 py-2 px-4 font-medium border-b-2",
          activeTab === "shots"
            ? "border-primary text-primary"
            : "border-transparent text-neutral-600"
        )}
        onClick={() => onTabChange("shots")}
      >
        Shot Tracker
      </button>
    </div>
  );
};

export default TabNavigation;
