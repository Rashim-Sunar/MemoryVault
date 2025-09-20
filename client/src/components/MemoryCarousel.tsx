import React from "react";
import { useState} from "react";
import { SimpleMemoryDisplay } from "./SimpleMemoryDisplay";
import { useUserMedia } from "@/hooks/useUserMedia";

const MemoryCarousel = () => {
  const [page, setPage] = useState(1);
  const { data: memories, loading, error, pagination } = useUserMedia(page, 3);

  const hasMorePages = pagination.page < pagination.totalPages;
  const slides = hasMorePages ? [...memories, null] : memories;

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
          memories={slides}
          onLoadMore={() => setPage((prev) => prev + 1)}
        />
      </div>
    </div>
  );
};

export default React.memo(MemoryCarousel);
