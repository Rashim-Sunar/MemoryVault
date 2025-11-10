"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useActivityStore } from "@/context/ActivityStore";
import {
  Heart,
  Trash2,
  PlusCircle,
  Star,
  FileEdit,
} from "lucide-react";

const ActivityFeed = () => {
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case "UPLOAD_MEMORY":
        return <PlusCircle size={20} className="text-green-600" />;
      case "DELETE_MEMORY":
        return <Trash2 size={20} className="text-red-600" />;
      case "EDIT_MEMORY":
        return <FileEdit size={20} className="text-blue-600" />;
      case "ADD_TO_FAVORITES":
        return <Heart size={20} className="text-pink-600" />;
      case "REMOVE_FROM_FAVORITES":
        return <Star size={20} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const timeAgo = (t: string) => {
    const diff = (Date.now() - new Date(t).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[100vh] flex justify-center px-4 sm:px-8 pt-6 overflow-hidden"
    >
      {/* SCROLL THIS CARD ONLY */}
      <Card className="w-full max-w-3xl rounded-3xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-[0_8px_25px_rgba(0,0,0,0.15)] p-6 overflow-y-auto">
        <h3 className="font-semibold text-lg sm:text-xl text-white mb-5">
          <span className="text-orange-400"> Recent</span> Activity
        </h3>

        {activities.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No activity recorded yet.</p>
        ) : (
          <div className="relative pl-4">
            {/* Timeline vertical line */}
            <div className="absolute left-1 top-0 w-[3px] h-full rounded-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-70"></div>

            <ul className="space-y-5 pb-6">
              {activities.slice(0, 30).map((a, i) => (
                <motion.li
                  key={a._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  {/* Dot on timeline */}
                  <div className="min-w-[12px] min-h-[12px] rounded-full bg-purple-600 border-[3px] border-white/70 z-10"></div>

                  {/* Activity item */}
                  <div className="flex justify-between items-center w-full bg-white/40 p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.015] transition-all border border-white/60">
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-800">
                      {getIcon(a.actionType)}
                      <span>
                        {a.actionType === "UPLOAD_MEMORY" && "Uploaded memory"}
                        {a.actionType === "DELETE_MEMORY" && "Deleted memory"}
                        {a.actionType === "EDIT_MEMORY" && "Edited memory"}
                        {a.actionType === "ADD_TO_FAVORITES" && "Added to favorites"}
                        {a.actionType === "REMOVE_FROM_FAVORITES" && "Removed from favorites"}{" "}
                        <strong className="font-semibold">
                          "{a.mediaTitle}"
                        </strong>
                      </span>
                    </div>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {timeAgo(a.createdAt)}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;
