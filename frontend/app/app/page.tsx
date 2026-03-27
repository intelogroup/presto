import { EmptyState } from "@/components/empty-state";

export default function DashboardPage() {
  // TODO: Fetch projects from backend when persistence is added
  const projects: unknown[] = [];

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

  return null;
}
