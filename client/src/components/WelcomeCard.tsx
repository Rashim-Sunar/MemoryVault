import { motion } from "framer-motion";
import { useMediaStore } from "@/context/MediaStore";

const WelcomeCard = () => {
  const { dashboardStats } = useMediaStore();
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="p-6 mx-4 text-white mt-2">
        <h2 className="text-2xl font-bold text-orange-400">Welcome back 👋</h2>
        <p className="mt-2 text-sm">
          You’ve stored <span className="font-semibold text-orange-400">{dashboardStats?.currentMonthMemoriesLength} memories</span> this month.
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomeCard;
