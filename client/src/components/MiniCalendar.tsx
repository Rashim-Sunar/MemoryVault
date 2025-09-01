"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"

const MiniCalendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-center items-center w-full h-full p-4"
    >
      <Card className="w-full max-w-lg p-6 rounded-2xl shadow-lg bg-gradient-to-br from-sky-50 via-white to-indigo-50 border border-indigo-100">
        <h2 className="text-lg font-semibold text-indigo-700 mb-4 text-center">
          Your Calendar
        </h2>

        <div className=" flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm w-full sm:w-[80%] md:w-[70%]"
            captionLayout="dropdown"
          />
        </div>

        {date && (
          <p className="text-center text-sm mt-4 text-gray-600">
            Selected Date:{" "}
            <span className="font-medium text-indigo-600">
              {date.toDateString()}
            </span>
          </p>
        )}
      </Card>
    </motion.div>
  )
}

export default MiniCalendar
