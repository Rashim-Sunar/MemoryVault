import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const ActivityFeed = () => {
  const feed = [
    { action: "Uploaded a memory", time: "2h ago" },
    { action: "Viewed calendar", time: "5h ago" },
    { action: "Generated recap", time: "1d ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="p-4 rounded-2xl shadow-md bg-gradient-to-r from-indigo-100 to-sky-200">
        <h3 className="font-semibold mb-3 text-indigo-700">Recent Activity</h3>
        <ul className="space-y-2">
          {feed.map((f, i) => (
            <li key={i} className="flex justify-between text-sm text-indigo-900">
              <span>{f.action}</span>
              <span className="text-indigo-500">{f.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;
