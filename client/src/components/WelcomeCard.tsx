import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const WelcomeCard = () => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 rounded-2xl shadow-md bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 text-white">
        <h2 className="text-2xl font-bold">Welcome back, Rashim 👋</h2>
        <p className="mt-2 text-sm">
          You’ve stored <span className="font-semibold">42 memories</span> this month.
        </p>
      </Card>
    </motion.div>
  );
};

export default WelcomeCard;
