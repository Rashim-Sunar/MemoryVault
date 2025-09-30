"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { useMediaByDates } from "@/hooks/useMediaByDates"

const MiniCalendar = () => {
  const [dates, setDates] = React.useState<Date[] | undefined>([])

  // Format dates to YYYY-MM-DD for backend
  const formattedDates = React.useMemo(
    () => dates?.map(d => d.toISOString().split("T")[0]) ?? [],
    [dates]
  );

  const { data: memories, loading, error } = useMediaByDates(formattedDates);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col justify-center items-center w-full h-full p-4 gap-6"
    >
      <Card className="w-full max-w-lg p-6 rounded-2xl shadow-lg bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-indigo-100">
        <h2 className="text-lg font-semibold text-indigo-700 mb-4 text-center">
          Select Dates
        </h2>

        <div className="flex justify-center">
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={(val) => setDates(val ?? [])} // 👈 fallback to []
            required={false}
            className="rounded-md border shadow-sm w-full sm:w-[80%] md:w-[70%]"
            captionLayout="dropdown"
          />

        </div>
      </Card>

      {/* Results Section */}
      <div className="w-full max-w-2xl">
        {loading && <p className="text-center text-gray-500">Loading memories…</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && memories.length === 0 && (
          <p className="text-center text-gray-500">No memories found for these dates.</p>
        )}

        {memories.map((memory) => (
          <Card
            key={memory._id}
            className="p-4 mb-4 bg-white shadow-md rounded-xl border border-gray-100"
          >
            <h3 className="font-bold text-indigo-700">{memory.title}</h3>
            <p className="text-gray-600 text-sm">{new Date(memory.createdAt).toDateString()}</p>
            <p className="mt-2 text-gray-800">{memory.notes}</p>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}

export default MiniCalendar
