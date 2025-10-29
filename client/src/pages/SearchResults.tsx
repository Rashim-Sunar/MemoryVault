import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSearchMemoriesByTag } from "@/hooks/useSearchMemoriesByTag";
import { Calendar, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaStore } from "@/context/MediaStore";
import MemoryPopup from "@/components/MemoryPopup";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tag = queryParams.get("tag") || "";
  const { results, loading, error, searchByTag, setResults } = useSearchMemoriesByTag();
  const { toggleFavorite } = useMediaStore();
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  useEffect(() => {
    if (tag) searchByTag(tag);
  }, [tag]);

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id);
      setResults((prev) =>
        prev.map((memory) =>
          memory._id === id ? { ...memory, isFavorite: !memory.isFavorite } : memory
        )
      );
    } catch (error) {
      console.error("Favorites.tsx: Error removing favorite:", error);
    }
  };

  // ✅ Centralized click handler for opening popup
  const handleMemoryClick = (memory: any) => setSelectedMemory(memory);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center text-red-400 text-xl">
        ❌ {error}
      </div>
    );

  if (!results.length)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-purple-700 via-pink-600 to-indigo-600 text-white">
        <h2 className="text-3xl font-bold mb-2">No memories found for “{tag}” 😔</h2>
        <p className="text-white/80">Try another emotion tag</p>
      </div>
    );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-tr from-violet-600 via-blue-600 to-indigo-400">
      <h1 className="text-3xl font-bold text-slate-200 mb-8 text-center">
        Memories tagged with <span className="text-orange-400">“{tag}”</span> 💭
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((memory) => (
          <motion.div
            key={memory._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-black/20 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 flex flex-col hover:scale-105 hover:shadow-2xl transition-transform duration-300"
          >
            {/* ✅ Use one unified click handler */}
            <div onClick={() => handleMemoryClick(memory)} className="cursor-pointer">
              {memory.photos[0]?.url && (
                <img
                  src={memory.photos[0].url}
                  alt={memory.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold text-slate-100">{memory.title}</h2>

                <div className="flex items-center gap-2 text-white/80 text-sm my-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  {new Date(memory.createdAt).toLocaleDateString()}
                </div>

                <p className="text-white/90 flex-1 line-clamp-3">{memory.notes}</p>
              </div>
            </div>

            <div className="p-4 pt-0 flex justify-between items-center text-white/70 text-sm">
              <div className="flex gap-4">
                <span>📷 {memory.photos.length}</span>
                <span>🎥 {memory.videos.length}</span>
              </div>

              {/* ❤️ Remove from favorites */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleToggleFavorite(memory._id)}
                className="p-2 rounded-full hover:bg-slate-500 transition-colors"
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors",
                    memory.isFavorite ? "text-red-500 fill-red-500" : "text-white"
                  )}
                />
              </motion.button>
            </div>

            {/* <div className="mt-3 flex flex-wrap gap-2">
              {memory.tags.map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 bg-white/10 border border-white/20 text-xs text-white rounded-full"
                >
                  #{t}
                </span>
              ))}
            </div> */}
          </motion.div>
        ))}
      </div>

      {selectedMemory && (
        <MemoryPopup memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
      )}
    </div>
  );
};

export default SearchResults;
