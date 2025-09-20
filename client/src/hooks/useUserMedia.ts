// hooks/useUserMedia.ts
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { MediaItem, PaginatedResponse } from "@/types/media";

export function useUserMedia(page: number, limit: number = 3) {
  const { getToken } = useAuth();
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ page: number; totalPages: number }>({
    page: 1,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = await getToken();
        const res = await fetch(
          `http://localhost:5000/api/media?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch media: ${res.status}`);
        }

        const json: PaginatedResponse = await res.json();

        // Append instead of replacing
        setData((prev) => (page === 1 ? json.data : [...prev, ...json.data]));
        setPagination({ page: json.page, totalPages: json.totalPages });
      } catch (err: any) {
        setError(err.message || "Error fetching media");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [page, limit, getToken]);

  return { data, loading, error, pagination };
}
