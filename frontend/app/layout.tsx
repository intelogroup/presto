import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/sonner";

// Fallback: skip Google Fonts when network is unavailable (e.g. CI / sandboxed builds).
// Restore the imports below when fonts.googleapis.com is reachable:
//   import { Geist, Geist_Mono } from "next/font/google";
//   const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
//   const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const geistSans = { variable: "--font-geist-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: "Presto",
  description:
    "Turn any talk into a synced presentation video. Upload a video or audio file — AI generates themed slides automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
