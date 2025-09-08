import PresentationChat from './components/PresentationChat.jsx';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <PresentationChat />
      </div>
    </main>
  );
}

export const metadata = {
  title: 'AI Presentation Generator',
  description: 'Create amazing presentations with AI assistance',
};
