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
    if (!ACCEPTED.includes(f.type)) {
      setError("Unsupported file type. Use MP4, MOV, WebM, MP3, or M4A.");
      return;
    }
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-foreground">New Project</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload a video or audio file and pick a theme.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1: File upload */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">1</span>
            Upload file
          </h2>
          <div
            role="button"
            tabIndex={0}
            className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
              dragging
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : file
                ? "border-accent/40 bg-accent/5"
                : "border-border/60 hover:border-primary/40 hover:bg-primary/[0.02]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (e.key === " ") e.preventDefault();
                inputRef.current?.click();
              }
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(",")}
              className="hidden"
              onChange={handleChange}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/8 text-primary transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Drop a video or audio file here</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV, WebM, MP3, M4A — up to 500 MB</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Theme selection */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">2</span>
            Choose a theme
          </h2>
          <ThemeGrid value={theme} onChange={setTheme} />
        </section>

        {/* Section 3: Headshot (audio-only) */}
        {isAudio && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">3</span>
              Add a headshot
              <span className="font-normal text-muted-foreground">(optional)</span>
            </h2>
            <div className="rounded-xl border-2 border-dashed border-border/60 p-6 text-center transition-all">
              <p className="text-sm text-muted-foreground">
                Drop a photo here (JPEG/PNG, max 5 MB)
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                If skipped, we&apos;ll use your profile photo or a placeholder.
              </p>
            </div>
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          className="w-full rounded-xl shadow-lg shadow-primary/30 h-12 text-base font-semibold"
          size="lg"
          disabled={!file || uploading}
          onClick={handleSubmit}
        >
          {uploading ? (
            <>
              <svg className="mr-2 size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading...
            </>
          ) : (
            "Generate Presentation"
          )}
        </Button>
      </div>
    </div>
  );
}
