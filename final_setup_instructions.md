# 🚀 Final Supabase Setup (Manual)

## 1️⃣ Create Jobs Table

Go to: **https://app.supabase.com/project/iahclweybypbfhuwfqme/sql/new**

Copy and paste this SQL, then click **"Run"**:

```sql
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploading',
  step TEXT NOT NULL DEFAULT 'uploading',
  created_at BIGINT NOT NULL,
  last_progress_at BIGINT,
  video_path TEXT,
  trimmed_video_path TEXT,
  mp3_path TEXT,
  transcript_path TEXT,
  talking_head_public_path TEXT,
  output_filename TEXT,
  output_path TEXT,
  error TEXT,
  original_name TEXT,
  mime_type TEXT,
  theme_override TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON public.jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
```

## 2️⃣ Create Storage Bucket

Go to: **https://app.supabase.com/project/iahclweybypbfhuwfqme/storage/buckets**

1. Click **"Create a new bucket"**
2. Name: `talking-heads`
3. Visibility: **Private** (signed URLs only)
4. Click **"Create bucket"**

## 3️⃣ Deploy to Render

All env vars are already set. Just push:

```bash
git add -A
git commit -m "feat: migrate jobs from in-memory Map to Supabase"
git push origin main
```

Render auto-deploys on push.

## ✅ Verification

After setup, the backend will:
- ✅ Store job metadata in `jobs` table (Supabase PostgreSQL)
- ✅ Upload talking head videos to `talking-heads` bucket  
- ✅ Generate 1-hour signed URLs for download access
- ✅ Auto-cleanup stale jobs after 24 hours

---

**All code changes are complete.** Just need these two manual Supabase steps!
