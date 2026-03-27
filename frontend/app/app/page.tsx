import { EmptyState } from "@/components/empty-state";
import { ProjectCard } from "@/components/project-card";

// Mock data — replaced with real API call when backend persistence lands
const MOCK_PROJECTS: {
  jobId: string;
  filename: string;
  status: "processing" | "ready" | "failed";
  theme?: string;
  createdAt: string;
}[] = [
  {
    jobId: "demo-1",
    filename: "quarterly-review.mp4",
    status: "ready",
    theme: "Dark Tech",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    jobId: "demo-2",
    filename: "product-launch-talk.mov",
    status: "processing",
    theme: "Dashboard / KPI",
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    jobId: "demo-3",
    filename: "team-standup-mar25.mp3",
    status: "failed",
    theme: "Academic",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function DashboardPage() {
  // Toggle between empty and populated states for development.
  // When backend persistence is added, fetch real projects here.
  const projects = MOCK_PROJECTS;

  if (projects.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <EmptyState
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          }
          title="No projects yet"
          description="Upload a video or audio file to create your first presentation."
          action={{ label: "New Project", href: "/app/new" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">{projects.length} total</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.jobId} {...p} />
        ))}
      </div>

      {/* CTA section */}
      <div className="mt-12 rounded-2xl border border-border/40 bg-card/50 p-8 text-center">
        <h2 className="text-lg font-bold text-foreground">Create your next presentation</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload a recording and let AI do the rest.</p>
        <a
          href="/app/new"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-6 h-10 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
        >
          New Project
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </a>
      </div>
    </div>
  );
}
