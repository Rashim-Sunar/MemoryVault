// MemoryCarousel.tsx
import { useEffect } from "react";
import { useMediaStore } from "@/context/MediaStore";
import { SimpleMemoryDisplay } from "./SimpleMemoryDisplay";

const MemoryCarousel = () => {
  const { memories, loading, error, pagination, currentPage, loadPage, loadNext } = useMediaStore();

  // initial load once
  useEffect(() => {
    if (memories.length === 0) {
      loadPage(1);
    }
  }, []); // run once

  const hasMorePages = pagination.page < pagination.totalPages;
  const slides = hasMorePages ? [...memories, null] : memories;

  const handleLoadMore = async () => {
    if (pagination.page >= pagination.totalPages) return;
    await loadNext();
  };

  if (loading && memories.length === 0) return <div>Loading memories...</div>;
  if (error && memories.length === 0) return <div className="text-red-500">{error}</div>;

  return <SimpleMemoryDisplay memories={slides} onLoadMore={handleLoadMore} />;
};

export default MemoryCarousel;
