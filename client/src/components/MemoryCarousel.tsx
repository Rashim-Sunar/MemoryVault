import { useState } from "react";
import { SimpleMemoryDisplay } from "./SimpleMemoryDisplay";
import { useUserMedia } from "@/hooks/useUserMedia";

const MemoryCarousel = () => {
  const [page, setPage] = useState(1);
  const { data: memories, loading, error, pagination } = useUserMedia(page, 3);

  if (loading && page === 1) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading memories...
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[length:200%_200%] animate-[gradientShift_12s_ease_infinite] md:pl-10">
      <div className="h-full py-6 sm:p-8 flex flex-col">
        <SimpleMemoryDisplay
          memories={memories.map((m) => ({
            id: m._id,
            title: m.title,
            notes: m.notes,
            images: m.photos.map((p) => p.url),
            videos: m.videos.map((v) => v.url),
            createdAt: new Date(m.createdAt),
          }))}
        />

        {/* Load More / End Message */}
        <div className="flex justify-center mt-6">
          {loading && page > 1 ? (
            <span className="text-white">Loading more...</span>
          ) : pagination.page < pagination.totalPages ? (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition shadow-md"
            >
              Load More Memories
            </button>
          ) : (
            <span className="text-white/70">No more memories to show</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryCarousel;
