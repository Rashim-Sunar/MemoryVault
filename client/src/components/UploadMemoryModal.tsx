import { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/context/MediaStore";

export default function UploadMemoryModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const { uploadMemory, loading } = useMediaStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">📤 Upload Memory</h2>
        <input
          type="text"
          placeholder="Title"
          className="border w-full mb-2 p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Notes"
          className="border w-full mb-2 p-2 rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <input type="file" multiple onChange={handleFileChange} className="mb-4" />

        <div className="flex gap-2">
          <Button onClick={() => uploadMemory(title, notes, files, onClose)} disabled={loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
