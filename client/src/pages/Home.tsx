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

export default function Home() {
  const [active, setActive] = useState("Dashboard");
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
    // bg-gradient-to-br from-gray-800 via-indigo-500 to-sky-600
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-800 to-sky-500
">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive}/>

      {/* Main Content */}
      <main className="flex-1 w-full h-full">
        {active === "Dashboard" && <WelcomeCard />}
        {active === "Memories" && <MemoryCarousel />}
        {active === "Calendar" && <MiniCalendar />}
        {active === "Quick Actions" && <QuickActions />}
        {active === "Activity" && <ActivityFeed />}
        {active === "Settings" && (
          <Card className="p-6 rounded-2xl shadow-md bg-gradient-to-r from-indigo-100 to-sky-200">
            <h3 className="font-semibold mb-2 text-indigo-700">⚙️ Settings</h3>
            <p className="text-sm text-indigo-600">Coming soon...</p>
          </Card>
        )}
      </main>
    </div>
  );
}
