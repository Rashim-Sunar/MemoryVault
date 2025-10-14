"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { MediaItem, PaginatedResponse } from "@/types/media";
import { toast } from "react-hot-toast";

interface DashboardStats {
  totalMemories: number;
  totalPhotos: number;
  totalVideos: number;
  dailyStats?: { _id: string; count: number }[];
}

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
  uploadMemory: (title: string, notes: string, files: File[], onClose: () => void) => Promise<void>;
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
}

const MediaStoreContext = createContext<MediaStoreContextType | undefined>(undefined);

export const MediaStoreProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [memories, setMemories] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  // ===============================
  // 📥 Fetch Media (Paginated)
  // ===============================
  const fetchPage = async (page: number, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/media?page=${page}&limit=3`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch media: ${res.status} ${errText}`);
      }

      const json: PaginatedResponse = await res.json();

      // If append, add new items (avoid duplicates)
      setMemories((prev) =>
        append ? [...prev, ...json.data.filter((d) => !prev.some((p) => p._id === d._id))] : json.data
      );

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

  // load the next page
  const loadNext = async () => {
    const next = currentPage + 1;
    if (next > pagination.totalPages) return;
    await fetchPage(next, true);
  };

  // refresh first page
  const refresh = async () => {
    await fetchPage(1, false);
  };

  // ===============================
  // ❌ Delete Memory
  // ===============================
  const deleteMemory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Find the memory being deleted in local state
      const memoryToDelete = memories.find((m) => m._id === id);
      if (!memoryToDelete) {
        throw new Error("Memory not found in local state");
      }

      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/media/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete memory: ${res.status} ${text}`);
      }

      await fetchPage(1, false);

      // 4️⃣ Update dashboard stats based on deleted memory content
      setDashboardStats((prev) => {
        if (!prev) return prev;

        const updated = { ...prev };
        updated.totalMemories = Math.max(0, prev.totalMemories - 1);

        const photoCount = memoryToDelete.photos?.length || 0;
        const videoCount = memoryToDelete.videos?.length || 0;
        updated.totalPhotos = Math.max(0, prev.totalPhotos - photoCount);
        updated.totalVideos = Math.max(0, prev.totalVideos - videoCount);

        if (prev.dailyStats && memoryToDelete.createdAt) {
          const dateKey = memoryToDelete.createdAt.split("T")[0];
          updated.dailyStats = prev.dailyStats.map((d) =>
            d._id === dateKey ? { ...d, count: Math.max(0, d.count - 1) } : d
          );
        }

        return updated;
      });
    } catch (err: any) {
      setError(err.message || "Error deleting memory");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // 📊 Fetch Dashboard Stats
  // ===============================
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const resSummary = await fetch(`http://localhost:5000/api/media/stats/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const summary = await resSummary.json();

      const resDaily = await fetch(`http://localhost:5000/api/media/stats/daily`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dailyStats = await resDaily.json();

      setDashboardStats({ ...summary, dailyStats });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ☁️ Upload Memory (Moved from Modal)
  // ===============================
  const uploadMemory = async (title: string, notes: string, files: File[], onClose: () => void) => {
    setLoading(true);
    const uploadingMemory = toast.loading("Uploading your memory. Please wait...");
    try {
      let token = await getToken();
      if (!token) throw new Error("No auth token");

      // 1️⃣ Get signed upload params from backend
      const sigRes = await fetch("http://localhost:5000/api/sign-upload", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!sigRes.ok) throw new Error("Failed to fetch signature");

      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      // 2️⃣ Upload each file to Cloudinary
      const uploadedFiles: { url: string; publicId: string }[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Upload failed");
        const data = await uploadRes.json();
        uploadedFiles.push({ url: data.secure_url, publicId: data.public_id });
      }

      token = await getToken();

      // 3️⃣ Save metadata + URLs in MongoDB via backend
      const saveRes = await fetch("http://localhost:5000/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          notes,
          photos: uploadedFiles.filter((file) => file.url.match(/\.(jpg|jpeg|png|gif)$/i)),
          videos: uploadedFiles.filter((file) => file.url.match(/\.(mp4|mov|avi)$/i)),
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save media");

      toast.success("Memory uploaded successfully!", { id: uploadingMemory });
      await refresh(); // refresh the global store
      await fetchDashboardStats(); // update dashboard
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload media", { id: uploadingMemory });
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
        uploadMemory,
        dashboardStats,
        fetchDashboardStats,
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
