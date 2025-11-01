"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import WelcomeCard from "@/components/WelcomeCard";
import MemoryCarousel from "@/components/MemoryCarousel";
import MiniCalendar from "@/components/MiniCalendar";
import QuickActions from "@/components/QuickActions";
import ActivityFeed from "@/components/ActivityFeed";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@clerk/clerk-react";
import DashboardStats from "@/components/DashboardStats";
import RecentMemoriesCarousel from "@/components/RecentMemoriesCorousel";
import { useHomeStore } from "@/store/useHomeStore";

export default function Home() {
  // const [active, setActive] = useState("Dashboard");
  const { active, setActive } = useHomeStore();
  const { getToken, isSignedIn } = useAuth();

  // Only for testing purpose...
  useEffect(() => {
    const fetchToken = async () => {
      if (isSignedIn) {
        const token = await getToken();
        console.log("Authorization token:", token);
      } else {
        console.log("User is not signed in.");
      }
    };
    fetchToken();
  }, [getToken, isSignedIn]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-800 to-sky-500">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main className="flex-1 w-full h-full relative">
        {/* Dashboard */}
        <div className={active === "Dashboard" ? "block" : "hidden"}>
          <div className="h-screen overflow-y-auto">
             <WelcomeCard />
             <DashboardStats /> {/* Charts & stats */}
             <RecentMemoriesCarousel/>
          </div>
        </div>

        {/* Memories (always mounted) */}
        <div className={active === "Memories" ? "block" : "hidden"}>
          <MemoryCarousel />
        </div>

        {/* Calendar */}
        <div className={active === "Calendar" ? "block" : "hidden"}>
          <MiniCalendar />
        </div>

        {/* Quick Actions */}
        <div className={active === "Quick Actions" ? "block" : "hidden"}>
          <QuickActions />
        </div>

        {/* Activity */}
        <div className={active === "Activity" ? "block" : "hidden"}>
          <ActivityFeed />
        </div>

        {/* Settings */}
        <div className={active === "Settings" ? "block" : "hidden"}>
          <Card className="p-6 rounded-2xl shadow-md bg-gradient-to-r from-indigo-100 to-sky-200">
            <h3 className="font-semibold mb-2 text-indigo-700">⚙️ Settings</h3>
            <p className="text-sm text-indigo-600">Coming soon...</p>
          </Card>
        </div>
      </main>
    </div>
  );
}
