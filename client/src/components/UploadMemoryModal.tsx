"use client";
import { useState, ChangeEvent } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

interface UploadMemoryProps {
  onClose: () => void;
}

interface CloudinarySignature {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
}

interface UploadedFile {
  url: string;
  publicId: string;
}

export default function UploadMemoryModal({ onClose }: UploadMemoryProps) {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No auth token");

      // 1. Get signed upload params from backend
      const sigRes = await fetch("http://localhost:5000/api/sign-upload", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!sigRes.ok) throw new Error("Failed to fetch signature");

      const { timestamp, signature, apiKey, cloudName }: CloudinarySignature =
        await sigRes.json();

      // 2. Upload each file to Cloudinary
     const uploadedFiles: UploadedFile[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          { method: "POST", body: formData }
        );

        // console.log("uploadRes status: ",uploadRes.ok);
        if (!uploadRes.ok) throw new Error("Upload failed");
        const data: { secure_url: string; public_id: string } = await uploadRes.json();
         uploadedFiles.push({ url: data.secure_url, publicId: data.public_id });
      }

      // 3. Save metadata + URLs in MongoDB via backend
      const saveRes = await fetch("http://localhost:5000/api/media", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            notes,
            photos: uploadedFiles.filter((file) =>
            file.url.match(/\.(jpg|jpeg|png|gif)$/i)
            ),
            videos: uploadedFiles.filter((file) =>
            file.url.match(/\.(mp4|mov|avi)$/i)
            ),
        }),
      });


      if (!saveRes.ok) throw new Error("Failed to save media");

      alert("✅ Memory uploaded!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
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
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />

        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={loading}>
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
