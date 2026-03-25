"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { MediaItem, PaginatedResponse } from "@/types/media";
import { toast } from "react-hot-toast";
import { useActivityStore } from "./ActivityStore";

interface DashboardStats {
  totalMemories: number;
  totalPhotos: number;
  totalVideos: number;
  currentMonthMemoriesLength: number;
  dailyStats: { _id: string; count: number }[];
}

interface MediaListApiResponse {
  success?: boolean;
  data: PaginatedResponse | MediaItem[];
}

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
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
  uploadMemory: (
    title: string,
    notes: string,
    files: File[],
    tags: string[],
    dateCaptured: string,
    onClose: () => void,
  ) => Promise<void>;
  dashboardStats: DashboardStats | null;
  fetchDashboardStats: () => Promise<void>;
  recentMemories: MediaItem[];
  fetchRecentMemories: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

const MediaStoreContext = createContext<MediaStoreContextType | undefined>(
  undefined,
);

export const MediaStoreProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();
  const [memories, setMemories] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [recentMemories, setRecentMemories] = useState<MediaItem[]>([]); // top 10 recent memories to be shown in dashboard

  const { logActivity } = useActivityStore();

  const parsePaginatedMediaResponse = (payload: unknown): PaginatedResponse => {
    const wrapped = payload as MediaListApiResponse;
    const direct = payload as PaginatedResponse;

    if (Array.isArray(direct?.data)) {
      return direct;
    }

    if (wrapped?.data && !Array.isArray(wrapped.data)) {
      return wrapped.data;
    }

    if (Array.isArray(wrapped?.data)) {
      return {
        page: 1,
        limit: wrapped.data.length,
        total: wrapped.data.length,
        totalPages: 1,
        data: wrapped.data,
      };
    }

    return { page: 1, limit: 0, total: 0, totalPages: 1, data: [] };
  };

  // ===============================
  // 📥 Fetch Media (Paginated)
  // ===============================
  const fetchPage = async (page: number, append = false) => {
    try {
      setLoading(true);
      setError(null);

      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/media?page=${page}&limit=3`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to fetch media: ${res.status} ${errText}`);
      }

      const payload = await res.json();
      const json = parsePaginatedMediaResponse(payload);

      // If append, add new items (avoid duplicates)
      setMemories((prev) =>
        append
          ? [
              ...prev,
              ...json.data.filter((d) => !prev.some((p) => p._id === d._id)),
            ]
          : json.data,
      );

      setPagination({
        page: json.page,
        totalPages: json.totalPages,
        total: json.total,
      });
      setCurrentPage(json.page);
    } catch (err: any) {
      setError(err.message || "Error fetching media");
    } finally {
      setLoading(false);
    }
  };

  // fetch recent memories for the dashboard..
  const fetchRecentMemories = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/media?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(
          `Failed to fetch recent media: ${res.status} ${errText}`,
        );
      }

      const payload = await res.json();
      const json = parsePaginatedMediaResponse(payload);
      setRecentMemories(Array.isArray(json.data) ? json.data : []);
    } catch (error: any) {
      console.log(error.message);
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

        // check if memory is in current month
        if (memoryToDelete.createdAt) {
          const createdDate = new Date(memoryToDelete.createdAt);
          const now = new Date();
          if (
            createdDate.getFullYear() === now.getFullYear() &&
            createdDate.getMonth() === now.getMonth()
          ) {
            updated.currentMonthMemoriesLength = Math.max(
              0,
              prev.currentMonthMemoriesLength - 1,
            );
          }
        }

        if (prev.dailyStats && memoryToDelete.createdAt) {
          const dateKey = memoryToDelete.createdAt.split("T")[0];
          updated.dailyStats = prev.dailyStats.map((d) =>
            d._id === dateKey ? { ...d, count: Math.max(0, d.count - 1) } : d,
          );
        }

        return updated;
      });

      await logActivity("DELETE_MEMORY", "", memoryToDelete.title);
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

      const resSummary = await fetch(
        `http://localhost:5000/api/media/stats/summary`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const summaryPayload = await resSummary.json();

      const resDaily = await fetch(
        `http://localhost:5000/api/media/stats/daily`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const dailyPayload = await resDaily.json();

      const summary = summaryPayload?.data ?? summaryPayload;
      const dailyStats = Array.isArray(dailyPayload?.data)
        ? dailyPayload.data
        : Array.isArray(dailyPayload)
          ? dailyPayload
          : [];

      setDashboardStats({
        totalMemories: Number(summary?.totalMemories ?? 0),
        totalPhotos: Number(summary?.totalPhotos ?? 0),
        totalVideos: Number(summary?.totalVideos ?? 0),
        currentMonthMemoriesLength: Number(
          summary?.currentMonthMemoriesLength ?? 0,
        ),
        dailyStats,
      });
    } catch (err) {
      console.error(err);
      setDashboardStats({
        totalMemories: 0,
        totalPhotos: 0,
        totalVideos: 0,
        currentMonthMemoriesLength: 0,
        dailyStats: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ===============================================================================================================
  //  Production-Grade Upload Pipeline
  // ================================================================================================================

  // ===============================
  // Upload Config
  // ===============================
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const MAX_CONCURRENT_UPLOADS = 3;
  const MAX_RETRIES = 2;

  // Allowed MIME types
  const ALLOWED_MIME_TYPES = new Set([
    // Images
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",

    // Videos
    "video/mp4",
    "video/quicktime", // .mov
    "video/x-msvideo", // .avi
    "video/webm",
  ]);

  // Allowed extensions (fallback safety)
  const ALLOWED_EXTENSIONS = new Set([
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "svg",
    "mp4",
    "mov",
    "avi",
    "webm",
  ]);

  // Helper to extract extension safely
  const getFileExtension = (filename: string): string => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  // Main file validation function
  const validateFiles = (files: File[]) => {
    if (!files.length) {
      throw new Error("No files selected");
    }

    for (const file of files) {
      const ext = getFileExtension(file.name);

      // 🔒 Validate type (MIME OR extension fallback)
      const isValidType =
        ALLOWED_MIME_TYPES.has(file.type) || ALLOWED_EXTENSIONS.has(ext);

      if (!isValidType) {
        throw new Error(
          `Unsupported file type: ${file.name}. Allowed: images (jpg, png, webp, gif, svg) and videos (mp4, mov, avi, webm)`,
        );
      }

      // 📦 Validate size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large: ${file.name} (max 10MB allowed)`);
      }
    }
  };
  // ===============================
  //  Upload with Progress (XHR)
  // ===============================
  const uploadWithProgress = (
    file: File,
    cloudName: string,
    apiKey: string,
    timestamp: number,
    signature: string,
    onProgress?: (progress: number) => void,
  ): Promise<CloudinaryUploadResult> => {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);

      xhr.send(formData);
    });
  };

  // ===============================
  //  Retry Wrapper
  // ===============================
  const uploadWithRetry = async (
    file: File,
    cloudName: string,
    apiKey: string,
    timestamp: number,
    signature: string,
    retries = MAX_RETRIES,
  ): Promise<CloudinaryUploadResult> => {
    try {
      return await uploadWithProgress(
        file,
        cloudName,
        apiKey,
        timestamp,
        signature,
      );
    } catch (err) {
      if (retries > 0) {
        console.warn(`Retrying: ${file.name}`);
        return uploadWithRetry(
          file,
          cloudName,
          apiKey,
          timestamp,
          signature,
          retries - 1,
        );
      }
      throw err;
    }
  };

  // ===============================
  // Concurrency Control
  // ===============================
  const runWithLimit = async <T,>(
    tasks: (() => Promise<T>)[],
    limit: number,
  ): Promise<T[]> => {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const p = task().then((res) => {
        results.push(res);
      });

      executing.push(p);

      if (executing.length >= limit) {
        await Promise.race(executing);
        executing.splice(0, executing.length - limit + 1);
      }
    }

    await Promise.all(executing);
    return results;
  };

  // ===============================
  // Upload Memory (Production Grade)
  // ===============================
  const uploadMemory = async (
    title: string,
    notes: string,
    files: File[],
    tags: string[],
    dateCaptured: string,
    onClose: () => void,
  ) => {
    setLoading(true);
    const uploadingMemory = toast.loading("Uploading your memory...");

    try {
      // ===============================
      // 1️. Validate Files
      // ===============================
      validateFiles(files);

      // ===============================
      // 2️. Get Token
      // ===============================
      let token = await getToken();
      if (!token) throw new Error("No auth token");

      // ===============================
      // 3️. Get Cloudinary Signature
      // ===============================
      const sigRes = await fetch("http://localhost:5000/api/sign-upload", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!sigRes.ok) throw new Error("Failed to fetch signature");

      const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

      // ===============================
      // 4️. Parallel Upload (Controlled)
      // ===============================
      const uploadTasks = files.map((file) => async () => {
        return uploadWithRetry(file, cloudName, apiKey, timestamp, signature);
      });

      const results = await runWithLimit(uploadTasks, MAX_CONCURRENT_UPLOADS);

      const uploadedFiles = results.map((data) => ({
        url: data.secure_url,
        publicId: data.public_id,
      }));

      // ===============================
      // 5️. Save Metadata
      // ===============================
      token = await getToken();

      const saveRes = await fetch("http://localhost:5000/api/media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          notes,
          tags,
          dateCaptured,
          photos: uploadedFiles.filter((f) =>
            f.url.match(/\.(jpg|jpeg|png|gif)$/i),
          ),
          videos: uploadedFiles.filter((f) => f.url.match(/\.(mp4|mov|avi)$/i)),
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save media");

      const data = await saveRes.json();

      // ===============================
      // 6️.Post Processing
      // ===============================
      toast.success("Memory uploaded successfully!", { id: uploadingMemory });

      await logActivity("UPLOAD_MEMORY", data._id, title);
      await refresh();
      await fetchDashboardStats();

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload media", { id: uploadingMemory });
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ❤️ Toggle Favorite Memory
  // ===============================
  const toggleFavorite = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/media/${id}/favorite`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to toggle favorite: ${res.status} ${text}`);
      }

      const updated = await res.json();

      // Update memory in local state
      setMemories((prev) =>
        prev.map((m) =>
          m._id === id ? { ...m, isFavorite: updated.memory.isFavorite } : m,
        ),
      );

      await logActivity(
        updated.memory.isFavorite
          ? "ADD_TO_FAVORITES"
          : "REMOVE_FROM_FAVORITES",
        id,
        updated.memory.title,
      );

      toast.success(
        updated.memory.isFavorite
          ? "Memory added to favorites ❤️"
          : "Memory removed from favorites 💔",
      );
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error toggling favorite");
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
        recentMemories,
        fetchRecentMemories,
        toggleFavorite,
      }}
    >
      {children}
    </MediaStoreContext.Provider>
  );
};

export const useMediaStore = () => {
  const context = useContext(MediaStoreContext);
  if (!context)
    throw new Error("useMediaStore must be used within MediaStoreProvider");
  return context;
};
