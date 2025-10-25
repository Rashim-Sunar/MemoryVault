"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/context/MediaStore";
import { Upload, X, ImageIcon, FileIcon } from "lucide-react";

export default function UploadMemoryModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadMemory, loading } = useMediaStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-white/90 to-indigo-100 p-6 rounded-3xl shadow-2xl w-[90%] max-w-md relative border border-indigo-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-indigo-600 transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center flex items-center justify-center gap-2">
          <Upload className="text-indigo-600" size={22} />
          Upload Memory
        </h2>

        {/* Inputs */}
        <input
          type="text"
          placeholder="Memory title..."
          className="border border-indigo-200 w-full mb-3 p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your notes here..."
          className="border border-indigo-200 w-full mb-3 p-2 rounded-lg h-40 resize-none focus:ring-2 focus:ring-indigo-400 outline-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Drag & Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-white/40"
          } flex flex-col items-center justify-center text-gray-500 cursor-pointer`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="mb-2 text-indigo-500" />
          <p className="text-sm text-center">
            Drag & drop files here, or <span className="text-indigo-600 font-semibold">browse</span>
          </p>
        </div>

        {/* File Previews */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-indigo-50 rounded-lg p-2 border border-indigo-100"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="text-indigo-500" size={18} />
                ) : (
                  <FileIcon className="text-indigo-500" size={18} />
                )}
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => uploadMemory(title, notes, files, onClose)}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
