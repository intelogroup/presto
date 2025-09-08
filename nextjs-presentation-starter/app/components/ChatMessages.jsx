'use client';

import { useRef, useEffect } from 'react';
import { ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/outline';

export default function ChatMessages({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px] max-h-[500px]">
      {messages.map((message, index) => (
        <div key={index} className="animate-fade-in">
          {message.role === 'user' ? (
            <div className="flex justify-end">
              <div className="message-user flex items-start gap-3 max-w-2xl">
                <div className="text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className="p-1 bg-white/20 rounded-full flex-shrink-0 mt-1">
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start">
              <div className={`flex items-start gap-3 max-w-2xl ${
                message.isError ? 'message-error' : 'message-assistant'
              }`}>
                <div className={`p-1 rounded-full flex-shrink-0 mt-1 ${
                  message.isError ? 'bg-red-100' : 'bg-blue-50'
                }`}>
                  <ChatBubbleLeftIcon className={`h-4 w-4 ${
                    message.isError ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                <div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.timestamp && (
                    <div className="text-xs text-gray-400 mt-2" suppressHydrationWarning>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start animate-fade-in">
          <div className="message-assistant flex items-start gap-3 max-w-2xl">
            <div className="p-1 bg-blue-50 rounded-full flex-shrink-0 mt-1">
              <ChatBubbleLeftIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce-subtle"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce-subtle" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce-subtle" style={{animationDelay: '0.4s'}}></div>
              </div>
              <span className="text-sm text-gray-500 ml-2">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
