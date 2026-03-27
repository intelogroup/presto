import { AppHeader } from "@/components/app-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Inject dark class on <html> so the entire viewport is dark, not just the content wrapper */}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add('dark');`,
        }}
      />
      <div className="flex min-h-screen flex-col bg-background">
        <AppHeader />
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
