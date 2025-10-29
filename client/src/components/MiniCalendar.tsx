"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { useMediaByDates } from "@/hooks/useMediaByDates"
import { useMemoryDates } from "@/hooks/useMemoryDates"
import MemoryPopup from "./MemoryPopup" // 👈 Import popup component

// ✅ Helper function to get local date string (avoids UTC shift)
function formatLocalDate(date: Date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
}

const MiniCalendar = () => {
  const [dates, setDates] = React.useState<Date[] | undefined>([])
  const [selectedMemory, setSelectedMemory] = React.useState<any | null>(null) // 👈 Track selected memory

  // ✅ Use local date format instead of UTC-based ISO
  const formattedDates = React.useMemo(
    () => dates?.map(d => formatLocalDate(d)) ?? [],
    [dates]
  );

  const { data: memories, loading, error } = useMediaByDates(formattedDates);
  const { dates: memoryDates, loading: datesLoading } = useMemoryDates();

  // ✅ Compare with local date format
  const isMemoryDate = (date: Date) =>
    memoryDates.includes(formatLocalDate(date));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex w-full lg:h-screen p-6 gap-12 lg:gap-20 lg:pl-28 justify-around flex-col lg:flex-row"
    >
      {/* ================== Calendar Section ================== */}
      <Card 
        className="
          w-[90%] sm:w-[50vw] lg:w-[30vw] max-h-[540px] p-6 rounded-2xl shadow-lg 
          bg-gradient-to-br from-white/20 via-purple-200/30 to-indigo-200/30 
          backdrop-blur-xl border border-indigo-200/40 
          flex flex-col justify-start mx-auto lg:mx-0
        "
      >
        <h2 className="text-lg font-semibold text-slate-100 mb-4 text-center">
          Select Dates
        </h2>

        <div className="flex justify-center">
          <Calendar
              mode="multiple"
              selected={dates}
              onSelect={(val) => setDates(val ?? [])}
              required={false}
              captionLayout="dropdown"
              className="rounded-xl border shadow-sm w-full bg-white/60 backdrop-blur-md"
              modifiers={{
                // ✅ Use local date comparison
                hasMemory: (day: Date) => memoryDates.includes(formatLocalDate(day)),
              }}
              modifiersClassNames={{
                hasMemory: "bg-indigo-600 text-white font-semibold rounded-full",
              }}
          />
        </div>
      </Card>

      {/* ================== Memories Section ================== */}
      <div
        className="
          w-full lg:w-2/5 
          h-[60vh]
          lg:h-full 
          overflow-x-auto lg:overflow-y-auto 
          lg:pr-2
          pb-4
        "
      >
        {loading && <p className="text-center text-gray-300">Loading memories…</p>}
        {error && <p className="text-center text-red-400">{error}</p>}
        {!loading && memories.length === 0 && (
          <p className="text-center text-gray-300">No memories found for these dates.</p>
        )}

        <div className="flex gap-6 flex-row lg:flex-col lg:gap-8">
          {memories.map((memory, i) => (
            <motion.div
              key={memory._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="cursor-pointer flex-shrink-0 w-[85%] sm:w-[70%] md:w-[60%] lg:w-full"
              onClick={() => setSelectedMemory(memory)} // 👈 Open popup
            >
              <Card
                className="
                  p-6 flex flex-col
                  rounded-2xl shadow-md hover:shadow-2xl 
                  border border-indigo-200/50 transition-all duration-300
                  h-[320px] sm:h-[360px] md:h-[400px] lg:h-auto
                  bg-gradient-to-br from-sky-100 via-indigo-200 to-indigo-100
                "
              >
                <h3 className="font-bold text-indigo-700 text-xl mb-1">{memory.title}</h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                  📅 {new Date(memory.createdAt).toDateString()}
                </p>
                <p className="text-gray-800 text-base mb-4 line-clamp-3">
                  {memory.notes}
                </p>
                {memory.photos.length > 0 ? (
                  <img
                    src={memory.photos[0].url}
                    alt={memory.title}
                    className="w-full h-40 object-cover rounded-xl shadow-sm"
                  />
                ) : memory.videos.length > 0 ? (
                  <video
                    src={memory.videos[0].url}
                    className="w-full h-40 object-cover rounded-xl shadow-sm"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 font-semibold">
                    No Media
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================== Popup ================== */}
      {selectedMemory && (
        <MemoryPopup
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </motion.div>
  )
}  

export default MiniCalendar
