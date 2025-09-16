// SimpleMemoryDisplay.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Memory {
  id: string;
  title: string;
  notes: string;
  images: string[];
  videos: string[];
  createdAt: Date;
}

interface SimpleMemoryDisplayProps {
  memories: Memory[];
}

export const SimpleMemoryDisplay = ({ memories }: SimpleMemoryDisplayProps) => {
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (!memories || memories.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">No Memories Yet</h2>
          <p className="text-white/80">Add some memories to get started!</p>
        </motion.div>
      </div>
    );
  }

  const currentMemory = memories[currentMemoryIndex];
  const allMedia = [...currentMemory.images, ...currentMemory.videos];
  const currentMediaItem = allMedia[currentMediaIndex];
  const isVideo = currentMemory.videos.includes(currentMediaItem);

  const nextMemory = () => {
    if (currentMemoryIndex < memories.length - 1) {
      setCurrentMemoryIndex(currentMemoryIndex + 1);
      setCurrentMediaIndex(0);
    }
  };

  const prevMemory = () => {
    if (currentMemoryIndex > 0) {
      setCurrentMemoryIndex(currentMemoryIndex - 1);
      setCurrentMediaIndex(0);
    }
  };

  const nextMedia = () => {
    if (currentMediaIndex < allMedia.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

  return (
    <div className="h-[88vh] w-full flex flex-col">
      {/* Outer Navigation */}
      <div className="flex justify-between items-center px-4 mb-4">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevMemory}
          disabled={currentMemoryIndex === 0}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg",
            currentMemoryIndex === 0
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-white/30"
          )}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMemory}
          disabled={currentMemoryIndex === memories.length - 1}
          className={cn(
            "w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg",
            currentMemoryIndex === memories.length - 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-white/30"
          )}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMemory.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 w-full max-w-6xl items-center"
          >
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
                      <div className="relative w-full h-full">
                        <video
                          src={currentMediaItem}
                          className="w-full h-full object-cover"
                          controls
                          poster={currentMemory.images[0] || ""}
                        />
                        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-sm flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          Video
                        </div>
                      </div>
                    ) : (
                      <motion.img
                        src={currentMediaItem}
                        alt={currentMemory.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
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
                        currentMediaIndex === 0
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-black/70"
                      )}
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>

                    <button
                      onClick={nextMedia}
                      disabled={currentMediaIndex === allMedia.length - 1}
                      className={cn(
                        "absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center",
                        currentMediaIndex === allMedia.length - 1
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-black/70"
                      )}
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allMedia.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentMediaIndex(index)}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all",
                            index === currentMediaIndex
                              ? "bg-white scale-125"
                              : "bg-white/50 hover:bg-white/80"
                          )}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Text Section */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-4 text-white"
            >
              <div>
                <h2 className="text-3xl font-extrabold drop-shadow-lg">
                  {currentMemory.title}
                </h2>
                <div className="flex items-center gap-2 text-white/70 text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(currentMemory.createdAt)}</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-white/90 shadow-lg"
              >
                {currentMemory.notes}
              </motion.div>

              <div className="flex gap-6 mt-2 text-white/80 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {currentMemory.images.length}
                  </div>
                  <div>Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {currentMemory.videos.length}
                  </div>
                  <div>Videos</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
