"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeGrid } from "@/components/theme-grid";

const ACCEPTED = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "audio/mpeg",
  "audio/mp4",
];
const AUDIO_TYPES = ["audio/mpeg", "audio/mp4"];
const MAX_SIZE_BYTES = 500 * 1024 * 1024;

export default function NewProjectPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [theme, setTheme] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAudio = file ? AUDIO_TYPES.includes(file.type) : false;

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

    try {
      const tokenRes = await fetch("/api/upload-token");
      const tokenData = await tokenRes.json();
      if (!tokenRes.ok)
        throw new Error(tokenData.error ?? "Could not get upload token");

      const body = new FormData();
      body.append("video", file);
      if (theme) body.append("themeOverride", theme);

      const uploadRes = await fetch(
        `${tokenData.uploadUrl}/pipeline/start`,
        {
          method: "POST",
          headers: { "x-upload-token": tokenData.token },
          body,
        }
      );
      const data = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(data.error ?? "Upload failed");
      router.push(`/app/project/${data.jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-xl font-semibold text-foreground">New Project</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload a video or audio file and pick a theme.
      </p>

      <div className="mt-8 space-y-8">
        {/* Section 1: File upload */}
        <section>
          <h2 className="text-sm font-medium text-foreground">
            1. Upload file
          </h2>
          <div
            className={`mt-3 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
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
              <p className="text-sm font-medium text-foreground">{file.name}</p>
            ) : (
              <div className="space-y-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="mx-auto size-8 text-muted-foreground"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                  />
                </svg>
                <p className="text-sm text-muted-foreground">
                  Drop a video or audio file here
                </p>
                <p className="text-xs text-muted-foreground/70">
                  MP4, MOV, WebM, MP3, M4A — up to 500 MB
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Theme selection */}
        <section>
          <h2 className="text-sm font-medium text-foreground">
            2. Choose a theme
          </h2>
          <div className="mt-3">
            <ThemeGrid value={theme} onChange={setTheme} />
          </div>
        </section>

        {/* Section 3: Headshot (audio-only) */}
        {isAudio && (
          <section>
            <h2 className="text-sm font-medium text-foreground">
              3. Add a headshot{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </h2>
            <div className="mt-3 cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-muted-foreground transition-colors">
              <p className="text-sm text-muted-foreground">
                Drop a photo here (JPEG/PNG, max 5 MB)
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                If skipped, we&apos;ll use your profile photo or a placeholder.
              </p>
            </div>
          </section>
        )}

        {/* Error */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Submit */}
        <Button
          className="w-full"
          size="lg"
          disabled={!file || uploading}
          onClick={handleSubmit}
        >
          {uploading ? "Uploading..." : "Generate Presentation"}
        </Button>
      </div>
    </div>
  );
}
