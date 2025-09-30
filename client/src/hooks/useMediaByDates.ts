import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import type { MediaItem } from "@/types/media";

export function useMediaByDates(dates?: string[]) {
  const { getToken } = useAuth();
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (!dates || dates.length === 0) {
        setData([]);
        return;
    }

    const fetchMedia = async () => {
        try {
        setLoading(true);
        setError(null);

        const token = await getToken();

        const query = new URLSearchParams({
            dates: JSON.stringify(dates),
        }).toString();

        const res = await fetch(`http://localhost:5000/api/mediaByDates?${query}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Failed to fetch media by dates: ${res.status}`);

        const json = await res.json();
        if (isMounted) setData(json.data || []);
        } catch (err: any) {
        if (isMounted) setError(err.message || "Error fetching media by dates");
        } finally {
        if (isMounted) setLoading(false);
        }
    };

    fetchMedia();

    return () => { isMounted = false };
    }, [JSON.stringify(dates)]); // ✅ compare by value

  return { data, loading, error };
}
