import { SimpleMemoryDisplay } from "./SimpleMemoryDisplay";

const sampleMemories = [
  {
    id: "1",
    title: "Trip to the Mountains",
    notes: "It was such a peaceful trip. The view was breathtaking 🌄",
    images: [
      "https://picsum.photos/800/450?random=1",
      "https://picsum.photos/800/450?random=2",
    ],
    videos: [
      "https://www.w3schools.com/html/mov_bbb.mp4",
    ],
    createdAt: new Date("2023-07-15"),
  },
  {
    id: "2",
    title: "Beach Day",
    notes: "Sunny weather, sandcastles, and a lot of fun by the sea 🏖️",
    images: [
      "https://picsum.photos/800/450?random=3",
      "https://picsum.photos/800/450?random=4",
      "https://picsum.photos/800/450?random=5",
    ],
    videos: [],
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    title: "Graduation Ceremony",
    notes: "One of the most memorable days of my life 🎓",
    images: [
      "https://picsum.photos/800/450?random=6",
    ],
    videos: [
      "https://www.w3schools.com/html/movie.mp4",
    ],
    createdAt: new Date("2024-05-20"),
  },
];

const MemoryCarousel = () => {
  return (
    //  bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-300
    <div className="h-screen w-full overflow-hidden   bg-[length:200%_200%] animate-[gradientShift_12s_ease_infinite] md:pl-10">
      <div className="h-full py-6 sm:p-8">
        <SimpleMemoryDisplay memories={sampleMemories} />
      </div>
    </div>
  );
};

export default MemoryCarousel;