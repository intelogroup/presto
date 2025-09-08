'use client';

import { useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function ChatInput({ 
  input, 
  setInput, 
  isLoading, 
  onSendMessage 
}) {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="bg-gradient-to-r from-surface/80 to-surface-secondary/80 backdrop-blur-xl shadow-xl border-t border-border/30 p-8 rounded-b-3xl">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card rounded-3xl shadow-2xl border border-border/20 p-6">
          <div className="flex gap-5 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-primary mb-3 tracking-wide">
                Describe your presentation
              </label>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what kind of presentation you'd like to create. Be specific about the topic, audience, and key points you want to cover..."
                className="w-full resize-none border-2 border-border/30 rounded-2xl px-6 py-4 focus:outline-none input-focus focus:border-primary/50 transition-all duration-300 text-text-primary placeholder-text-muted/60 bg-surface/50 backdrop-blur-sm font-medium leading-relaxed"
                rows={1}
                style={{ minHeight: '52px', maxHeight: '140px' }}
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-text-secondary font-medium tracking-wide">
                  Press Enter to send • Shift+Enter for new line
                </div>
                <div className={`text-xs font-semibold tracking-wide ${
                  input.length > 900 ? 'text-warning' : input.length > 1000 ? 'text-error' : 'text-text-secondary'
                }`}>
                  {input.length}/1000
                </div>
              </div>
            </div>

            <button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading || input.length > 1000}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform button-hover min-w-[140px] justify-center shadow-lg ${
                !input.trim() || isLoading || input.length > 1000
                  ? 'bg-surface-tertiary/50 text-text-muted cursor-not-allowed hover:scale-100'
                  : 'gradient-primary hover:shadow-primary/20 text-white animate-glow'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
    </div>
  );
}
