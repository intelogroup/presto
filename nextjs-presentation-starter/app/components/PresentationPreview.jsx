'use client';

import { DocumentArrowDownIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

export default function PresentationPreview({ 
  presentationData, 
  downloadStatus, 
  isGenerating, 
  onGeneratePresentation 
}) {
  if (!presentationData) return null;

  return (
    <div className="border-t bg-gradient-to-br from-neutral-50 to-primary-50 p-6 animate-slide-up">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg hover:scale-110 transition-transform duration-200">
              <SparklesIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Presentation Preview</h3>
              <p className="text-sm text-secondary">Ready to download your presentation</p>
            </div>
          </div>
        
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              downloadStatus === 'ready' ? 'bg-green-100 text-green-800' :
              downloadStatus === 'generating' ? 'bg-yellow-100 text-yellow-800' :
              downloadStatus === 'completed' ? 'bg-primary-100 text-primary-800' :
              downloadStatus === 'error' ? 'bg-red-100 text-red-800' :
              'bg-neutral-100 text-neutral-800'
            }`}>
              {downloadStatus === 'ready' && '✓ Ready'}
              {downloadStatus === 'generating' && '⏳ Generating...'}
              {downloadStatus === 'completed' && '✅ Downloaded'}
              {downloadStatus === 'error' && '❌ Error'}
              {!downloadStatus && 'Ready'}
            </div>
            
            <button
              onClick={onGeneratePresentation}
              disabled={isGenerating}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
                  Generating...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="h-5 w-5" />
                  Download PPTX
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-neutral-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 gradient-primary rounded-xl">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-2xl font-bold text-primary mb-2">{presentationData.title}</h4>
              <p className="text-secondary leading-relaxed">{presentationData.description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-lg font-semibold text-primary flex items-center gap-2">
                <ClipboardDocumentListIcon className="h-5 w-5 text-primary-600" />
                Slides ({presentationData.slides?.length || 0})
              </h5>
              <div className="text-sm text-secondary">
                Theme: {presentationData.theme || 'Default'}
              </div>
            </div>
            
            <div className="grid gap-4">
              {presentationData.slides?.map((slide, index) => (
                <div key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="border-l-4 border-primary-500 bg-gradient-to-r from-primary-50 to-accent-50 rounded-r-lg p-4 hover:from-primary-100 hover:to-accent-100 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform duration-200">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h6 className="font-semibold text-primary mb-2 group-hover:text-primary-700 transition-colors">
                          {slide.title}
                        </h6>
                        <p className="text-secondary text-sm leading-relaxed">{slide.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}