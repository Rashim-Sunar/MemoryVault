"use client";
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

interface Activity {
  _id: string;
  actionType: string;
  mediaTitle: string;
  createdAt: string;
}

interface ActivityStoreType {
  activities: Activity[];
  fetchActivities: () => Promise<void>;
  logActivity: (actionType: string, media?: string, mediaTitle?: string) => Promise<void>;
}

const ActivityStoreContext = createContext<ActivityStoreType | undefined>(undefined);

export const ActivityStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  // ✅ SAVE ACTIVITY
  const logActivity = async (actionType: string, media?: string, mediaTitle?: string) => {
    try {
      const token = await getToken();

      const res = await fetch("http://localhost:5000/api/activity/addActivity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ actionType, media, mediaTitle }),
      });

      if (!res.ok) throw new Error("Failed to record activity");
    } catch (err) {
      console.error("Activity Log failed:", err);
    }
  };

  // ✅ GET ALL USER ACTIVITIES
  const fetchActivities = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:5000/api/activity/getActivities", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setActivities(json.activities);
  };

  return (
    <ActivityStoreContext.Provider value={{ activities, logActivity, fetchActivities }}>
      {children}
    </ActivityStoreContext.Provider>
  );
};

export const useActivityStore = () => {
  const ctx = useContext(ActivityStoreContext);
  if (!ctx) throw new Error("useActivityStore must be used inside provider");
  return ctx;
};
