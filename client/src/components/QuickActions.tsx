"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UploadMemoryModal from "./UploadMemoryModal";

const QuickActions: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          onClick={() => setShowUpload(true)}
          className="rounded-2xl shadow-md bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
        >
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

      {showUpload && <UploadMemoryModal onClose={() => setShowUpload(false)} />}
    </>
  );
};

export default QuickActions;
