import { UploadForm } from "@/components/upload-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Presto</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a video or audio file — get a synced slide presentation.
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <UploadForm />
        </div>
      </div>
    </main>
  );
}
