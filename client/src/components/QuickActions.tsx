"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Sparkles, Heart } from "lucide-react";

import UploadMemoryModal from "./UploadMemoryModal";
import SearchOverlay from "./SearchOverlay";
import MemoryPopup from "./MemoryPopup";

const QuickActions: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMemoryPopup, setShowMemoryPopup] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const navigate = useNavigate();

  // ✨ Fetch a random memory from backend
  const handleRandomMemory = async () => {
    try {
      const res = await fetch("/api/memories/random");
      const data = await res.json();
      setSelectedMemory(data);
      setShowMemoryPopup(true);
    } catch (err) {
      console.error("Error fetching random memory:", err);
    }
  };

  // 🎨 Quick action buttons
  const actions = [
    {
      label: "Upload Memory",
      icon: <PlusCircle size={20} />,
      color: "from-indigo-500 to-violet-600",
      onClick: () => setShowUpload(true),
    },
    {
      label: "Search Memories",
      icon: <Search size={20} />,
      color: "from-pink-500 to-rose-600",
      onClick: () => setShowSearch(true),
    },
    {
      label: "Random Memory",
      icon: <Sparkles size={20} />,
      color: "from-emerald-500 to-teal-600",
      onClick: handleRandomMemory,
    },
    {
      label: "Favorite Memories",
      icon: <Heart size={20} />,
      color: "from-yellow-500 to-orange-600",
      onClick: () => navigate("/favorites"),
    },
  ];

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10 mx-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {actions.map(({ label, icon, color, onClick }, i) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button
              onClick={onClick}
              className={`w-full py-6 text-base font-medium flex items-center justify-center gap-2 rounded-2xl shadow-md text-white bg-gradient-to-r ${color}`}
            >
              {icon}
              <span>{label}</span>
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Popups / Overlays */}
      {showUpload && <UploadMemoryModal onClose={() => setShowUpload(false)} />}
      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
      {showMemoryPopup && (
        <MemoryPopup
          memory={selectedMemory}
          onClose={() => setShowMemoryPopup(false)}
        />
      )}
    </>
  );
};

export default QuickActions;
