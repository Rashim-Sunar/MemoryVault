"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface LightboxOverlayProps {
  mediaUrl: string | null
  onClose: () => void
}

const LightboxOverlay: React.FC<LightboxOverlayProps> = ({ mediaUrl, onClose }) => {
  if (!mediaUrl) return null

  const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm")

  return (
    <AnimatePresence>
      {mediaUrl && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={onClose} // close on background click
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-indigo-300"
            >
              <X size={30} />
            </button>

            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                autoPlay
                className="w-full max-h-[90vh] rounded-2xl object-contain shadow-lg"
              />
            ) : (
              <img
                src={mediaUrl}
                alt="Enlarged view"
                className="w-full max-h-[90vh] rounded-2xl object-contain shadow-lg"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LightboxOverlay
