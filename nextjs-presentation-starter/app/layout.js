import './globals.css';

export const metadata = {
  title: 'AI Presentation Generator',
  description: 'Create amazing presentations with AI assistance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}