import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const emotionTags = [
  "happy", "sad", "celebration", "adventure", "relaxed",
  "love", "peaceful", "family", "friends", "travel",
  "nostalgic", "romantic",
];

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose }) => {
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!tag) return;
    navigate(`/search-results?tag=${encodeURIComponent(tag)}`);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            🔍 Search Memories by Emotion
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 p-3 rounded-xl text-gray-700 dark:text-gray-200"
          >
            <option value="">Select an emotion...</option>
            {emotionTags.map((emotion) => (
              <option key={emotion} value={emotion}>
                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
              </option>
            ))}
          </select>

          <Button
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
          >
            Search
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchOverlay;
