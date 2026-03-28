export default function StatusLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add('dark');`,
        }}
      />
      {children}
    </>
  );
}
