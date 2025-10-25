import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MediaItem } from "@/types/media";


export const useSearchMemoriesByTag = () => {
  const { getToken } = useAuth();
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchByTag = async (tag: string) => {
    if (!tag.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/media/by-tag?tag=${encodeURIComponent(tag)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch memories by tag");

      const data = await res.json();
      setResults(data.data);
    } catch (err: any) {
        console.error("Error fetching memories by tag: ", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchByTag, setResults };
};

export default useSearchMemoriesByTag;
