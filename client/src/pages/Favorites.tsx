"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Heart } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { useMediaStore } from "@/context/MediaStore";
import MemoryPopup from "@/components/MemoryPopup";

interface FavoriteMemoryProps {
  _id: string;
  title: string;
  notes: string;
  photos: { url: string }[];
  videos: { url: string }[];
  createdAt: string;
  isFavorite: boolean;
}

const Favorites = () => {
  const { getToken } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteMemoryProps[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite } = useMediaStore();
  const [ selectedMemory, setSelectedMemory ] = useState<any | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/media/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch favorite memories");
      const data = await res.json();
      setFavorites(data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle favorite (remove from favorites list)
  const handleToggleFavorite = async (id: string) => {
     try {
        await toggleFavorite(id);
        setFavorites((prev) => prev.filter((memory) => memory._id != id));
     } catch (error) {
         console.error("Favorites.tsx: Error removing favorite:", error);
     }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(
      new Date(date)
    );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
        />
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-indigo-800 to-sky-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-2 text-white">No Favorites Yet</h2>
          <p className="text-white/80">Add some memories to your favorites ❤️</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-indigo-500 via-indigo-800 to-sky-500">
      <h1 className="text-4xl font-extrabold text-slate-200 mb-8 text-center md:text-left">
        Your <span className="text-orange-400"> Favorite Memories</span> ❤️
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {favorites.map((memory) => {
            const allMedia = [
              ...memory.photos.map((p) => p.url),
              ...memory.videos.map((v) => v.url),
            ];
            const mediaUrl = allMedia[0];

            return (
              <motion.div
                key={memory._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-white/20 flex flex-col hover:scale-105 hover:shadow-2xl transition-transform duration-300"
                onClick={() => setSelectedMemory(memory)}
              >
                {mediaUrl && (
                  <img
                    src={mediaUrl}
                    alt={memory.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-slate-100">{memory.title}</h2>
                    <div className="flex items-center gap-2 text-white/80 text-sm my-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      {formatDate(memory.createdAt)}
                    </div>
                    <p className="text-white/90 flex-1 overflow-hidden line-clamp-3">
                      {memory.notes}
                    </p>
                  <div className="flex justify-between items-center mt-3 text-white/70 text-sm">
                    <div className="flex gap-4">
                      <span>📷 {memory.photos.length}</span>
                      <span>🎥 {memory.videos.length}</span>
                    </div>

                    {/* ❤️ Remove from favorites */}
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={(event) => {
                         event.stopPropagation();
                         handleToggleFavorite(memory._id)
                      }}
                      className="p-2 rounded-full hover:bg-slate-500 transition-colors"
                    >
                      <Heart className="text-red-400 fill-red-400 w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* popUp */}
      {selectedMemory &&
        <MemoryPopup memory={selectedMemory} onClose={() => setSelectedMemory(null)}/>
      }

    </div>
  );
};

export default Favorites;
