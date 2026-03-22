"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { useActivityStore } from "./ActivityStore";
const MediaStoreContext = createContext(undefined);
export const MediaStoreProvider = ({ children }) => {
    const { getToken } = useAuth();
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [recentMemories, setRecentMemories] = useState([]); // top 10 recent memories to be shown in dashboard
    const { logActivity } = useActivityStore();
    const parsePaginatedMediaResponse = (payload) => {
        const wrapped = payload;
        const direct = payload;
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
    const fetchPage = async (page, append = false) => {
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
            const payload = await res.json();
            const json = parsePaginatedMediaResponse(payload);
            // If append, add new items (avoid duplicates)
            setMemories((prev) => append ? [...prev, ...json.data.filter((d) => !prev.some((p) => p._id === d._id))] : json.data);
            setPagination({ page: json.page, totalPages: json.totalPages, total: json.total });
            setCurrentPage(json.page);
        }
        catch (err) {
            setError(err.message || "Error fetching media");
        }
        finally {
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
                throw new Error(`Failed to fetch recent media: ${res.status} ${errText}`);
            }
            const payload = await res.json();
            const json = parsePaginatedMediaResponse(payload);
            setRecentMemories(Array.isArray(json.data) ? json.data : []);
        }
        catch (error) {
            console.log(error.message);
        }
        finally {
            setLoading(false);
        }
    };
    // load specific page, append if page > 1
    const loadPage = async (page) => {
        await fetchPage(page, page > 1);
    };
    // load the next page
    const loadNext = async () => {
        const next = currentPage + 1;
        if (next > pagination.totalPages)
            return;
        await fetchPage(next, true);
    };
    // refresh first page
    const refresh = async () => {
        await fetchPage(1, false);
    };
    // ===============================
    // ❌ Delete Memory
    // ===============================
    const deleteMemory = async (id) => {
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
                if (!prev)
                    return prev;
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
                    if (createdDate.getFullYear() === now.getFullYear() &&
                        createdDate.getMonth() === now.getMonth()) {
                        updated.currentMonthMemoriesLength = Math.max(0, prev.currentMonthMemoriesLength - 1);
                    }
                }
                if (prev.dailyStats && memoryToDelete.createdAt) {
                    const dateKey = memoryToDelete.createdAt.split("T")[0];
                    updated.dailyStats = prev.dailyStats.map((d) => d._id === dateKey ? { ...d, count: Math.max(0, d.count - 1) } : d);
                }
                return updated;
            });
            await logActivity("DELETE_MEMORY", "", memoryToDelete.title);
        }
        catch (err) {
            setError(err.message || "Error deleting memory");
            throw err;
        }
        finally {
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
            const summaryPayload = await resSummary.json();
            const resDaily = await fetch(`http://localhost:5000/api/media/stats/daily`, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
                currentMonthMemoriesLength: Number(summary?.currentMonthMemoriesLength ?? 0),
                dailyStats,
            });
        }
        catch (err) {
            console.error(err);
            setDashboardStats({
                totalMemories: 0,
                totalPhotos: 0,
                totalVideos: 0,
                currentMonthMemoriesLength: 0,
                dailyStats: [],
            });
        }
        finally {
            setLoading(false);
        }
    };
    // ===============================
    // ☁️ Upload Memory (Moved from Modal)
    // ===============================
    const uploadMemory = async (title, notes, files, tags, dateCaptured, onClose) => {
        setLoading(true);
        const uploadingMemory = toast.loading("Uploading your memory. Please wait...");
        try {
            let token = await getToken();
            if (!token)
                throw new Error("No auth token");
            // 1️⃣ Get signed upload params from backend
            const sigRes = await fetch("http://localhost:5000/api/sign-upload", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!sigRes.ok)
                throw new Error("Failed to fetch signature");
            const { timestamp, signature, apiKey, cloudName } = await sigRes.json();
            // 2️⃣ Upload each file to Cloudinary
            const uploadedFiles = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", apiKey);
                formData.append("timestamp", timestamp.toString());
                formData.append("signature", signature);
                const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: "POST", body: formData });
                if (!uploadRes.ok)
                    throw new Error("Upload failed");
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
                    tags, // ✅ added
                    dateCaptured, // ✅ added
                    photos: uploadedFiles.filter((file) => file.url.match(/\.(jpg|jpeg|png|gif)$/i)),
                    videos: uploadedFiles.filter((file) => file.url.match(/\.(mp4|mov|avi)$/i)),
                }),
            });
            if (!saveRes.ok)
                throw new Error("Failed to save media");
            toast.success("Memory uploaded successfully!", { id: uploadingMemory });
            // ✅ LOG ACTIVITY ( save to activities )
            const data = await saveRes.json();
            await logActivity("UPLOAD_MEMORY", data._id, title);
            await refresh(); // refresh the global store
            await fetchDashboardStats(); // update dashboard
            onClose();
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to upload media", { id: uploadingMemory });
        }
        finally {
            setLoading(false);
        }
    };
    // ===============================
    // ❤️ Toggle Favorite Memory
    // ===============================
    const toggleFavorite = async (id) => {
        try {
            const token = await getToken();
            const res = await fetch(`http://localhost:5000/api/media/${id}/favorite`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Failed to toggle favorite: ${res.status} ${text}`);
            }
            const updated = await res.json();
            // Update memory in local state
            setMemories((prev) => prev.map((m) => (m._id === id ? { ...m, isFavorite: updated.memory.isFavorite } : m)));
            await logActivity(updated.memory.isFavorite ? "ADD_TO_FAVORITES" : "REMOVE_FROM_FAVORITES", id, updated.memory.title);
            toast.success(updated.memory.isFavorite ? "Memory added to favorites ❤️" : "Memory removed from favorites 💔");
        }
        catch (err) {
            console.error(err);
            toast.error(err.message || "Error toggling favorite");
        }
    };
    return (_jsx(MediaStoreContext.Provider, { value: {
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
        }, children: children }));
};
export const useMediaStore = () => {
    const context = useContext(MediaStoreContext);
    if (!context)
        throw new Error("useMediaStore must be used within MediaStoreProvider");
    return context;
};
