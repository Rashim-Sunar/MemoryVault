import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Calendar,Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/media";
import {DropdownMenu}  from "./DropdownMenu"
import LightboxOverlay from "./LightboxOverlay";
import { useMediaStore } from "@/context/MediaStore";

interface SimpleMemoryDisplayProps {
  memories: (MediaItem | null)[]; // null is the Load More slide
  onLoadMore: () => void;
}

export const SimpleMemoryDisplay = ({
  memories,
  onLoadMore,
}: SimpleMemoryDisplayProps) => {
  const [currentIndex, setCurrentIndex] = useState(0); // current slide index
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0); // current media (image/video) index
  const [ mediaURL, setMediaURL ] = useState<any | null>(null);

  const currentMemory = memories[currentIndex]; // null if Load More slide

    const { toggleFavorite } = useMediaStore(); // ✅ access from store


  // Combine images and videos for navigation
  const allMedia = currentMemory
    ? [...currentMemory.photos.map(p => p.url), ...currentMemory.videos.map(v => v.url)]
    : [];

  const currentMediaItem = allMedia[currentMediaIndex];
  const isVideo = currentMemory
    ? currentMemory.videos.map(v => v.url).includes(currentMediaItem)
    : false;

  const nextSlide = () => {
    if (currentIndex < memories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentMediaIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentMediaIndex(0);
    }
  };

  const nextMedia = () => {
    if (currentMediaIndex < allMedia.length - 1) setCurrentMediaIndex(currentMediaIndex + 1);
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) setCurrentMediaIndex(currentMediaIndex - 1);
  };

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));

  console.log("Simple memory display",{ currentIndex, currentMemory, allMedia });


  if (!memories || memories.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">No Memories Yet</h2>
          <p className="text-white/80">Add some memories to get started!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
    <div className="h-[88vh] w-full flex flex-col mt-8">
      {/* Outer Navigation */}
      <div className="flex justify-between items-center px-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg",
            currentIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/30"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          disabled={currentIndex === memories.length - 1}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg",
            currentIndex === memories.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-white/30"
          )}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
      
      
      {/* Dropdown to perform actions (delete memory, add more pictures, edit not) */}
      <div className="flex items-center justify-end mr-6">{ currentMemory && (
        <>
           {/* ❤️ Favorite button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleFavorite(currentMemory._id)}
                className="p-2 rounded-full bg-white/20 backdrop-blur-md shadow-lg hover:bg-white/30 transition"
              >
                <Heart
                  className={cn(
                    "w-6 h-6 transition-colors",
                    currentMemory.isFavorite ? "text-red-500 fill-red-500" : "text-white"
                  )}
                />
                
              </motion.button>
          <DropdownMenu memoryId={currentMemory._id}/>
        </>
      )}</div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory ? currentMemory._id : "load-more-slide"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 w-full max-w-6xl items-center"
          >
            {/* Load More Slide */}
            {!currentMemory && (
              <div className="w-full h-[60vh] flex items-center justify-center border border-white/20 rounded-2xl bg-black/30 text-white text-xl font-bold shadow-lg">
                <button
                  onClick={onLoadMore}
                  className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl transition"
                >
                  Load More Memories
                </button>
              </div>
            )}

            {/* Memory Slide */}
            {currentMemory && (
              <>
                {/* Media Section */}
                {allMedia.length > 0 && (
                  <div className="relative w-full h-[60vh] rounded-2xl overflow-hidden border border-white/20 bg-black/30 backdrop-blur-sm shadow-xl">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentMediaIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full"
                      >
                        {isVideo ? (
                          <video
                            src={currentMediaItem}
                            className="w-full h-full object-cover"
                            controls
                            poster={currentMemory.photos[0]?.url || ""}
                            onClick={() => setMediaURL(currentMediaItem)}
                          />
                        ) : (
                          <img
                            src={currentMediaItem}
                            alt={currentMemory.title}
                            className="w-full h-full object-cover"
                            onClick={ () => setMediaURL(currentMediaItem)}
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Inner Media Navigation */}
                    {allMedia.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          disabled={currentMediaIndex === 0}
                          className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center",
                            currentMediaIndex === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-black/70"
                          )}
                        >
                          <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button
                          onClick={nextMedia}
                          disabled={currentMediaIndex === allMedia.length - 1}
                          className={cn(
                            "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center",
                            currentMediaIndex === allMedia.length - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-black/70"
                          )}
                        >
                          <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Text Section */}
                <div className="flex flex-col gap-4 text-white">
                  {/* Title */}
                  <h2 className="text-3xl font-extrabold">{currentMemory.title}</h2>

                  {/* Date with Calendar Icon */}
                  <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(currentMemory.createdAt)}
                  </div>

                  {/* Notes */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-white/90 shadow-lg sm:h-[20vw] overflow-y-auto">
                    {currentMemory.notes}
                  </div>

                  {/* Media Stats */}
                  <div className="flex gap-6 mt-2 text-sm text-white/70">
                    <span>📷 {currentMemory.photos.length} Photos</span>
                    <span>🎥 {currentMemory.videos.length} Videos</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
    <LightboxOverlay mediaUrl={mediaURL} onClose={() => setMediaURL(null)}/>
    </>
  );
};
