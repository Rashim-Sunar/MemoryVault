import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Button className="rounded-2xl shadow-md bg-gradient-to-r from-indigo-500 to-violet-600 text-white">
        📤 Upload Memory
      </Button>
      <Button
        variant="secondary"
        className="rounded-2xl shadow-md bg-gradient-to-r from-sky-400 to-indigo-500 text-white"
      >
        📅 Full Calendar
      </Button>
      <Button
        variant="outline"
        className="rounded-2xl shadow-md bg-gradient-to-r from-violet-400 to-sky-500 text-white"
      >
        ✨ Memory Recap
      </Button>
      <Button className="rounded-2xl shadow-md bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        ⚡ Quick Note
      </Button>
    </motion.div>
  );
};

export default QuickActions;
