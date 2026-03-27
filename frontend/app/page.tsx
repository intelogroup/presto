import { UploadForm } from "@/components/upload-form";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Presto</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a video or audio file — get a synced slide presentation.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <UploadForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
