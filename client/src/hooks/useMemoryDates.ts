import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react";

export const useMemoryDates = () =>{
    const { getToken } = useAuth();
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String | null>(null);

    useEffect(() => {
        const fetchDates = async() => {
            try{
                setLoading(true);
                const token = await getToken();
                const res = await fetch("http://localhost:5000/api/memoryDates", {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if(!res.ok) throw new Error("Failed to fetch memory dates");
                const json = await res.json();
                setDates(json.dates);
            }catch(err: any){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        }

        fetchDates();
    }, [getToken]);

    return { dates, loading, error};
}