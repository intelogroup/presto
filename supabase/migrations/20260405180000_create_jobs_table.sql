-- Create jobs table for pipeline job tracking
CREATE TABLE IF NOT EXISTS jobs (
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

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_jobs_job_id ON jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
