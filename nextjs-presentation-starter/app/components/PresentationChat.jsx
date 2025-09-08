'use client';

import { useState, useEffect } from 'react';
import { generatePPTX } from '../utils/pptx-generator';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import PresentationPreview from './PresentationPreview';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';

export default function PresentationChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m here to help you create an amazing presentation. Tell me about your topic, audience, and what you want to achieve.',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [presentationData, setPresentationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);



  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date().toISOString()
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message,
          timestamp: new Date().toISOString()
        }]);
        
        if (data.presentationData) {
          setPresentationData(data.presentationData);
          setDownloadStatus('ready');
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error.message.includes('quota') 
        ? 'API quota exceeded. Please check your OpenAI billing.'
        : error.message.includes('key')
        ? 'Invalid API key. Please check your configuration.'
        : 'Sorry, I encountered an error. Please try again.';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePresentation = async () => {
    if (!presentationData || isGenerating) return;
    
    setIsGenerating(true);
    setDownloadStatus('generating');
    
    try {
      const response = await fetch('/api/generate-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presentationData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${presentationData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presentation'}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setDownloadStatus('completed');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🎉 Your presentation has been generated and downloaded successfully! Check your Downloads folder.',
          timestamp: new Date().toISOString()
        }]);
        
        // Reset download status after 3 seconds
        setTimeout(() => setDownloadStatus('ready'), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate presentation');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setDownloadStatus('error');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Sorry, I couldn't generate the presentation: ${error.message}`,
        timestamp: new Date().toISOString(),
        isError: true
      }]);
      
      // Reset download status after 3 seconds
      setTimeout(() => setDownloadStatus('ready'), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hi! I\'m here to help you create an amazing presentation. Tell me about your topic, audience, and what you want to achieve.',
        timestamp: new Date().toISOString()
      }
    ]);
    setPresentationData(null);
    setDownloadStatus(null);
    setInput('');
  };

  const copyPresentationData = () => {
    if (presentationData) {
      navigator.clipboard.writeText(JSON.stringify(presentationData, null, 2));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '📋 Presentation data copied to clipboard!',
        timestamp: new Date().toISOString()
      }]);
    }
  };



  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <ChatHeader
        messages={messages}
        presentationData={presentationData}
        onClearChat={clearChat}
        onCopyPresentationData={copyPresentationData}
      />

      <ChatMessages messages={messages} isLoading={isLoading} />

      <PresentationPreview
         presentationData={presentationData}
         downloadStatus={downloadStatus}
         isGenerating={isGenerating}
         onGeneratePresentation={generatePresentation}
       />

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />

      {messages.length === 1 && !presentationData && (
         <QuickActions onQuickAction={setInput} isLoading={isLoading} />
       )}
     </div>
   );
}
