import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Card } from "@/components/ui/card";
import { useMediaStore } from "@/context/MediaStore";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import MemoryPopup from "./MemoryPopup";

export default function RecentMemoriesCarousel() {
    // Slider settings
  const settings = {
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
    ],
  };

  const { recentMemories, fetchRecentMemories, loading } = useMediaStore();
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  const formatDate = (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(date));

  useEffect(() => {
    fetchRecentMemories();
  }, []);

  if (loading) return <div className="text-white">Loading your recent memories...</div>;
  if (recentMemories.length === 0) return <div className="text-white">No memories yet.</div>;

  return (
    // <div className="mt-8 ml-8 mr-6 md:w-[80vw] mb-12">
    <div className="mt-8 mx-4 lg:ml-12 md:w-[70vw] lg:w-[77vw] mb-12 overflow-x-hidden">
      <h3 className="text-xl font-semibold text-blue-100 mb-4">
        🌟Your<span className="text-orange-400 text-2xl"> Recent</span> Memories
      </h3>

      <Slider {...settings}>
        {recentMemories.map((m) => (
          <Card
            key={m._id}
            className="p-2 bg-indigo-900/50 backdrop-blur-md rounded-xl text-slate-200 shadow-md mx-2"
            onClick={ () => setSelectedMemory(m) }
          >
           <img
            src={
                typeof m.photos?.[0] === "string"
                ? m.photos[0]
                : m.photos?.[0]?.url || "/placeholder.png"
            }
            alt={m.title}
            className="h-32 w-full object-cover rounded-lg"
            />

            {/* Date with Calendar Icon */}
            <div className="flex items-center gap-2 text-blue-200 text-sm mt-2 pl-2">
            <Calendar className="w-4 h-4" />
            {formatDate(m.createdAt)}
            </div>
            <p className="mt-2 text-sm truncate pl-4">{m.title}</p>
          </Card>
        ))}
      </Slider>

      {/* ================== Popup ================== */}
      {selectedMemory && (
        <MemoryPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  );
}
