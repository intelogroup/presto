"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const THEMES = [
  { id: "P1", label: "Dark Tech" },
  { id: "P3", label: "Dashboard / KPI" },
  { id: "P17", label: "Academic" },
];

const ACCEPTED = ["video/mp4", "video/quicktime", "video/webm", "audio/mpeg", "audio/mp4"];
const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export function UploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<string>("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function pickFile(f: File) {
    if (f.size > MAX_SIZE_BYTES) {
      setError("File too large — maximum size is 500 MB");
      return;
    }
    setError(null);
    setFile(f);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) pickFile(dropped);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) pickFile(picked);
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setError(null);

    const body = new FormData();
    body.append("video", file);
    if (theme) body.append("themeOverride", theme);

    try {
      const res = await fetch("/api/start", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      router.push(`/status/${data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={handleChange}
        />
        {file ? (
          <p className="text-sm font-medium text-gray-700">{file.name}</p>
        ) : (
          <div className="space-y-1">
            <p className="text-sm text-gray-600">Drop a video or audio file here</p>
            <p className="text-xs text-gray-400">MP4, MOV, WebM, MP3, M4A — up to 500MB</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Auto-select theme" />
          </SelectTrigger>
          <SelectContent>
            {THEMES.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={!file || uploading}>
          {uploading ? "Uploading…" : "Generate slides"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
