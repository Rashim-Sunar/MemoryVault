"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useActivityStore } from "@/context/ActivityStore";
import { Heart, Trash2, PlusCircle, Star, FileEdit } from "lucide-react";

// Group activities by date (Today / Yesterday / Earlier)
function groupByDate(
  activities: { createdAt: string; actionType: string; mediaTitle: string; _id: string }[]
): Record<"Today" | "Yesterday" | "Earlier", typeof activities> {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: any = { Today: [], Yesterday: [], Earlier: [] };

  activities.forEach((act) => {
    const dateString = new Date(act.createdAt).toDateString();
    if (dateString === today) groups.Today.push(act);
    else if (dateString === yesterday) groups.Yesterday.push(act);
    else groups.Earlier.push(act);
  });

  return groups;
}

const ActivityFeed = () => {
  const { activities, fetchActivities } = useActivityStore();

  useEffect(() => {
    fetchActivities();
  }, []);

  const iconMap: Record<string, React.ReactNode> = {
    UPLOAD_MEMORY: <PlusCircle size={20} className="text-emerald-500" />,
    DELETE_MEMORY: <Trash2 size={20} className="text-red-500" />,
    EDIT_MEMORY: <FileEdit size={20} className="text-blue-500" />,
    ADD_TO_FAVORITES: <Heart size={20} className="text-pink-500" />,
    REMOVE_FROM_FAVORITES: <Star size={20} className="text-yellow-400" />,
  };


  const timeAgo = (t: string) => {
    const diff = (Date.now() - new Date(t).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const grouped = groupByDate(activities);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 h-screen overflow-hidden"
    >
      <Card className="w-full h-full rounded-none bg-white/15 backdrop-blur-xl border-l border-white/20 shadow-xl flex flex-col">

        {/* FIXED HEADER */}
        <div className="px-8 py-6 flex-shrink-0 border-b border-white/20">
          <h3 className="text-2xl font-semibold text-white tracking-wide">
            <span className="text-orange-300">Recent</span> Activity
          </h3>
        </div>

        {/* Only list scrolls */}
        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-10 custom-scrollbar">

          {Object.entries(grouped).map(([label, group]) =>
            group.length > 0 ? (
              <div key={label}>
                {/* Group Title */}
                <h4 className="text-lg font-semibold text-gray-200 mb-3 pl-6">{label}</h4>

                {/* Timeline group */}
                <div className="relative pl-10">
                  <div className="absolute left-[18px] top-0 w-[2px] h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-60 rounded-full"></div>

                  <ul className="space-y-5">
                    {group.map((a: any, i: number) => (
                      <motion.li
                        key={a._id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-4"
                      >
                        <div className="min-w-[12px] min-h-[12px] rounded-full bg-purple-500 border-[3px] border-white/70 z-10"></div>

                        {/* Activity Card */}
                        <div className="flex justify-between items-center w-full bg-white/30 p-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all border border-white/50 backdrop-blur-sm">
                          <div className="flex items-center gap-3 text-gray-900 font-medium">
                            {iconMap[a.actionType]}
                            <span>
                              {a.actionType === "UPLOAD_MEMORY" && "Uploaded memory"}
                              {a.actionType === "DELETE_MEMORY" && "Deleted memory"}
                              {a.actionType === "EDIT_MEMORY" && "Edited memory"}
                              {a.actionType === "ADD_TO_FAVORITES" && "Added to favorites"}
                              {a.actionType === "REMOVE_FROM_FAVORITES" && "Removed from favorites"}{" "}
                              <strong>"{a.mediaTitle}"</strong>
                            </span>
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {timeAgo(a.createdAt)}
                          </span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null
          )}
        </div>
      </Card>

      {/* Scrollbar Styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.35);
          border-radius: 50px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.55);
        }
      `}</style>
    </motion.div>
  );
};

export default ActivityFeed;
