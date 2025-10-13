// context/MediaStore.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { MediaItem, PaginatedResponse } from "@/types/media";

interface MediaStoreContextType {
  memories: MediaItem[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; totalPages: number; total?: number };
  currentPage: number;
  loadPage: (page: number) => Promise<void>;
  loadNext: () => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const MediaStoreContext = createContext<MediaStoreContextType | undefined>(undefined);

export const MediaStoreProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [memories, setMemories] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  // core fetch. If append === true, append to existing memories.
  const fetchPage = async (page: number, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/media?page=${page}&limit=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        // try to surface backend message
        const errText = await res.text();
        throw new Error(`Failed to fetch media: ${res.status} ${errText}`);
      }

      const json: PaginatedResponse = await res.json();

      // If append, add new items (avoid duplicates)
      setMemories((prev) =>
        append ? [...prev, ...json.data.filter((d) => !prev.some((p) => p._id === d._id))] : json.data
      );

      // update pagination and page
      setPagination({ page: json.page, totalPages: json.totalPages, total: json.total });
      setCurrentPage(json.page);
    } catch (err: any) {
      setError(err.message || "Error fetching media");
    } finally {
      setLoading(false);
    }
  };

  // load specific page, append if page > 1
  const loadPage = async (page: number) => {
    await fetchPage(page, page > 1);
  };

  // convenience to load the next page based on currentPage
  const loadNext = async () => {
    const next = currentPage + 1;
    if (next > pagination.totalPages) return; // nothing to load
    await fetchPage(next, true);
  };

  // refresh: fetch first page and reset
  const refresh = async () => {
    await fetchPage(1, false);
  };

  // delete: call backend then re-fetch sensible page
  const deleteMemory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete memory: ${res.status} ${text}`);
      }

      // After successful delete, re-fetch current page.
      // But if deletion causes current page to be empty and currentPage > 1,
      // we should fetch the previous page (currentPage - 1) or last page.
      // So, fetch page 1 for simplicity and correctness (keeps newest-first UX).
      // Optionally you could fetch currentPage and if empty fetch page-1.
      await fetchPage(1, false);
    } catch (err: any) {
      setError(err.message || "Error deleting memory");
      throw err; // rethrow so callers (UI) can show toasts/errors
    } finally {
      setLoading(false);
    }
  };

  return (
    <MediaStoreContext.Provider
      value={{
        memories,
        loading,
        error,
        pagination,
        currentPage,
        loadPage,
        loadNext,
        deleteMemory,
        refresh,
      }}
    >
      {children}
    </MediaStoreContext.Provider>
  );
};

export const useMediaStore = () => {
  const context = useContext(MediaStoreContext);
  if (!context) throw new Error("useMediaStore must be used within MediaStoreProvider");
  return context;
};
