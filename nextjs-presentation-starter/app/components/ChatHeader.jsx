'use client';

import { TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/solid';

export default function ChatHeader({ 
  messages, 
  presentationData, 
  onClearChat, 
  onCopyPresentationData 
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              AI Presentation Generator
            </h1>
            <p className="text-sm text-gray-600">Create presentations with AI assistance</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={onClearChat}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Clear chat"
            >
              <TrashIcon className="h-4 w-4" />
              Clear
            </button>
          )}

          {presentationData && (
            <button
              onClick={onCopyPresentationData}
              className="btn-secondary flex items-center gap-2 text-sm"
              title="Copy presentation data"
            >
              <ClipboardDocumentListIcon className="h-4 w-4" />
              Copy Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
