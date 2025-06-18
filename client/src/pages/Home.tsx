import { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import CourseHeader from "@/components/CourseHeader";
import TabNavigation from "@/components/TabNavigation";
import CaddieTab from "@/components/CaddieTab";
import ScorecardTab from "@/components/ScorecardTab";
import ShotTrackerTab from "@/components/ShotTrackerTab";
import { useQuery } from "@tanstack/react-query";
import { useGolfRound } from "@/hooks/useGolfRound";

type Tab = "caddie" | "scorecard" | "shots";

const Home = () => {
  const [activeTab, setActiveTab] = useState<Tab>("caddie");
  const { isLoading } = useGolfRound();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["/api/courses"],
  });

  if (isLoadingCourses || isLoading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center">
        <p>Loading golf course data...</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-4">
        <p className="text-center mb-4">No golf courses available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      <Header />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-4">
          <CourseHeader />
          
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab as Tab)}
          />
          
          {activeTab === "caddie" && <CaddieTab />}
          {activeTab === "scorecard" && <ScorecardTab />}
          {activeTab === "shots" && <ShotTrackerTab />}
        </div>
      </main>
      
      <BottomNavigation activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as Tab)} />
    </div>
  );
};

export default Home;
