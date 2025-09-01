import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const MemoryCarousel = () => {
  const memories = ["Trip to Manali", "Birthday Party", "Graduation Day", "Concert Night"];

  return (
    <div className="overflow-x-auto flex space-x-4 py-4">
      {memories.map((m, i) => (
        <motion.div key={i} whileHover={{ scale: 1.05 }}>
          <Card className="min-w-[200px] p-4 rounded-2xl shadow-md bg-gradient-to-r from-violet-300 to-sky-300">
            <h3 className="font-semibold text-gray-800">{m}</h3>
            <p className="text-sm text-gray-600">A special moment ✨</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default MemoryCarousel;
