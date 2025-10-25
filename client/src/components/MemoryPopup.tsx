"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Slider from "react-slick"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"

import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import LightboxOverlay from "./LightboxOverlay"

const MemoryPopup = ({ memory, onClose }: { memory: any; onClose: () => void }) => {
  const [lightboxMedia, setLightboxMedia] = React.useState<string | null>(null)

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 3500,
  }

  return (
    <AnimatePresence>
      <motion.div
        key="popup"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[100vh] overflow-y-auto"
        >
          <Card className="bg-gradient-to-br from-indigo-100 via-purple-100 to-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-indigo-700"
            >
              <X size={26} />
            </button>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-2 text-center mt-8 sm:mt-4">
              {memory.title}
            </h2>

            {/* Date */}
            <p className="text-gray-500 text-center mb-8">
              📅 {new Date(memory.createdAt).toDateString()}
            </p>

            {/* Media Carousel */}
            <div className="rounded-xl overflow-hidden">
              <Slider {...sliderSettings}>
                {memory.photos.map((photo: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => setLightboxMedia(photo.url)} // 👈 open lightbox
                  >
                    <img
                      src={photo.url}
                      alt={`Photo ${index + 1}`}
                      className="w-full max-h-[420px] object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                ))}

                {memory.videos.map((video: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-center items-center cursor-pointer"
                    onClick={() => setLightboxMedia(video.url)} // 👈 open lightbox
                  >
                    <video
                      src={video.url}
                      controls
                      className="w-full max-h-[420px] object-contain rounded-xl hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Notes */}
            <p className="text-gray-800 text-[17px] mb-6 text-center leading-relaxed mt-8">
              {memory.notes || "No additional notes available."}
            </p>

          </Card>
        </motion.div>
        
        {/* ================= Lightbox Overlay(To show either pic or video on large view) ================= */}
         <LightboxOverlay mediaUrl={lightboxMedia} onClose={ () => setLightboxMedia(null)} />

      </motion.div>
    </AnimatePresence>
  )
}

export default MemoryPopup
