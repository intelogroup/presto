import React, { useEffect, useRef, useState } from 'react'
import { Target, Presentation, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle, Palette, FileText, ChevronRight, Image, Upload, X } from 'lucide-react'

function Message({ role, content, isFormatted }) {
  const renderContent = () => {
    if (isFormatted) {
      return content
    }

    // Handle multi-modal content
    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((item, index) => {
            if (item.type === 'text') {
              return <div key={index} style={{ whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{item.text}</div>
            } else if (item.type === 'image_url') {
              return (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <img
                    src={item.image_url.url}
                    alt="User uploaded image"
                    style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }

    // Regular text content
    return <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
  }

  return (
    <div className={`msg ${role}`} aria-live={role === 'assistant' ? 'polite' : 'off'}>
      {renderContent()}
    </div>
  )
}

function TopBar() {
  return (
    <div className="topbar" role="banner">
      <div className="brand">
        <div className="dot" />
        <span>Presto Slides : Ai Powerpoint Generator</span>
      </div>
      <div className="top-actions">
        <a href="https://www.builder.io/c/docs/projects" target="_blank" rel="noreferrer" className="link">Docs</a>
        <a href="#" className="link">Contact</a>
      </div>
    </div>
  )
}

function IntelligentAnalysis({ analysis }) {
  if (!analysis || !analysis.success) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      border: '1px solid #0ea5e9',
      borderRadius: '12px',
      padding: '12px',
      margin: '8px 0',
      fontSize: '13px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
        <Zap size={16} style={{ color: '#0ea5e9' }} />
        <strong style={{ color: '#0ea5e9' }}>AI Template Analysis</strong>
      </div>

      {analysis.analysis?.recommendedTemplate ? (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ color: '#047857', fontWeight: '600' }}>✨ Recommended: </span>
            {analysis.analysis.recommendedTemplate}
          </div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>
            {analysis.analysis.reasoning}
          </div>
          {analysis.analysis.detectedTopics?.length > 0 && (
            <div style={{ marginTop: '6px' }}>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>Topics: </span>
              {analysis.analysis.detectedTopics.map((topic, i) => (
                <span key={i} style={{
                  background: '#e0f2fe',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  marginRight: '4px'
                }}>
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: '#6b7280' }}>
          Using default generator for optimal reliability and general-purpose presentations.
        </div>
      )}
    </div>
  )
}

function PresentationOutline({ pptxData }) {
  const slideIcons = [FileText, Target, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle]

  return (
    <div style={{ lineHeight: '1.6' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Target size={20} style={{ color: 'var(--primary)' }} />
        <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>{pptxData.title}</strong>
      </div>

      {pptxData.subtitle && (
        <div style={{ fontStyle: 'italic', marginBottom: '16px', color: 'var(--muted)' }}>
          {pptxData.subtitle}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Presentation size={18} style={{ color: 'var(--primary)' }} />
        <strong>Presentation Outline</strong>
        <span style={{ color: 'var(--muted)' }}>({pptxData.slides?.length || 0} slides)</span>
      </div>

      <div style={{ marginLeft: '16px' }}>
        {pptxData.slides?.map((slide, index) => {
          const IconComponent = slideIcons[index] || FileText
          return (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <IconComponent size={16} style={{ color: 'var(--primary)' }} />
                <strong>Slide {index + 1}: {slide.title}</strong>
              </div>

              {slide.type === 'bullets' && slide.bullets ? (
                <div style={{ marginLeft: '24px' }}>
                  {slide.bullets.map((bullet, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '2px' }}>
                      <ChevronRight size={12} style={{ marginTop: '4px', color: 'var(--muted)' }} />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              ) : slide.content ? (
                <div style={{ marginLeft: '24px', color: 'var(--muted)' }}>
                  {slide.content.length > 80 ?
                    slide.content.substring(0, 80) + '...' :
                    slide.content}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', marginBottom: '8px' }}>
        <Palette size={16} style={{ color: 'var(--primary)' }} />
        <span>Theme: <strong>{pptxData.colorScheme || 'professional'}</strong></span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '500' }}>
        <CheckCircle size={16} />
        <span>Your presentation is ready! Click "Generate PowerPoint" below to download it.</span>
      </div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m here to help you create amazing PowerPoint presentations. Just describe what you need and I\'ll generate it for you!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pptxLoading, setPptxLoading] = useState(false)
  const [lastPptxData, setLastPptxData] = useState(null)
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [showSlideDetails, setShowSlideDetails] = useState(false)
  const [intelligentAnalysis, setIntelligentAnalysis] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const listRef = useRef(null)
  const fileInputRef = useRef(null)

  const canSend = (input.trim().length > 0 || selectedImages.length > 0) && !loading

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newImage = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name,
            type: 'upload'
          }
          setSelectedImages(prev => [...prev, newImage])
        }
        reader.readAsDataURL(file)
      }
    })
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addImageUrl = () => {
    if (imageUrl.trim()) {
      const newImage = {
        id: Date.now(),
        url: imageUrl.trim(),
        name: 'Image URL',
        type: 'url'
      }
      setSelectedImages(prev => [...prev, newImage])
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  const removeImage = (imageId) => {
    setSelectedImages(prev => prev.filter(img => img.id !== imageId))
  }

  const analyzeRequest = async (userInput) => {
    try {
      const res = await fetch('/api/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput })
      })

      if (res.ok) {
        const analysis = await res.json()
        setIntelligentAnalysis(analysis)
        return analysis
      }
    } catch (e) {
      console.error('Request analysis failed:', e)
    }
    return null
  }

  const scrollToBottom = () => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // load templates
    fetch('/api/templates')
      .then(r => r.json())
      .then(j => setTemplates(j.templates || []))
      .catch(() => setTemplates([]))

    // restore selected template from localStorage
    try {
      const saved = localStorage.getItem('presto_selected_template')
      if (saved) setSelectedTemplate(saved)
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      if (selectedTemplate) localStorage.setItem('presto_selected_template', selectedTemplate)
      else localStorage.removeItem('presto_selected_template')
    } catch (e) {}
  }, [selectedTemplate])

  const generatePPTX = async (presentationData, userContext = null) => {
    setPptxLoading(true)

    try {
      // Prepare enhanced request with user context for intelligent routing
      const requestBody = {
        ...presentationData,
        userInput: userContext || `Generate a presentation about ${presentationData.title}`,
        template: selectedTemplate
      }

      console.log('🎯 Generating PPTX with intelligent routing:', requestBody)

      let res, isBackupUsed = false

      try {
        // Try main server first
        res = await fetch('/api/generate-pptx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        if (!res.ok) {
          throw new Error(`Main server failed: ${res.status}`)
        }
      } catch (mainServerError) {
        console.warn('🛡️ Main server failed, trying backup server:', mainServerError.message)

        // Fallback to backup server
        try {
          res = await fetch('http://localhost:3005/generate-pptx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(presentationData) // Backup server uses simpler format
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            throw new Error(err.error || `Backup server failed: ${res.status}`)
          }

          isBackupUsed = true
          console.log('✅ Backup server succeeded')
        } catch (backupError) {
          throw new Error(`Both servers failed. Main: ${mainServerError.message}, Backup: ${backupError.message}`)
        }
      }

      // Get analysis info from headers (main server only)
      const templateUsed = res.headers.get('X-Presto-Template') || res.headers.get('X-Generator')
      const isValidated = res.headers.get('X-Presto-Validated')

      // Create blob and download
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${presentationData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setLastPptxData(presentationData)

      let successMessage = `✅ PowerPoint generated successfully! "${presentationData.title}" has been downloaded.`

      if (isBackupUsed) {
        successMessage += ' (Generated using backup server for reliability)'
      } else {
        if (templateUsed && templateUsed !== 'presto_default') {
          successMessage += ` Using specialized template: ${templateUsed}.`
        }
        if (isValidated === 'true') {
          successMessage += ' Content validated and optimized for PowerPoint.'
        }
      }

      setMessages(m => [...m, {
        role: 'assistant',
        content: successMessage
      }])
    } catch (e) {
      setMessages(m => [...m, {
        role: 'assistant',
        content: `❌ PPTX generation failed: ${e.message}`
      }])
    } finally {
      setPptxLoading(false)
    }
  }

  const send = async () => {
    if (!canSend) return

    // Build multi-modal message content
    let messageContent
    if (selectedImages.length > 0) {
      // Multi-modal message with text and images
      messageContent = []

      // Add text if present
      if (input.trim()) {
        messageContent.push({
          type: 'text',
          text: input.trim()
        })
      }

      // Add images
      selectedImages.forEach(image => {
        messageContent.push({
          type: 'image_url',
          image_url: {
            url: image.url
          }
        })
      })
    } else {
      // Text-only message
      messageContent = input
    }

    const userMessage = { role: 'user', content: messageContent }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput('')
    setSelectedImages([])
    setLoading(true)

    try {
      // Enhanced prompt for PowerPoint generation
      const enhancedMessages = next.map(({ role, content }) => {
        if (role === 'user' && next.length > 1) {
          // Handle multi-modal content properly
          if (Array.isArray(content)) {
            // For multi-modal messages, add the enhancement as additional text content
            const enhancementText = "\n\nIf this is a request for a PowerPoint presentation, please structure your response as a JSON object with this format:\n{\n  \"title\": \"Presentation Title\",\n  \"subtitle\": \"Optional subtitle\",\n  \"slides\": [\n    {\"title\": \"Slide Title\", \"content\": \"Slide content\"},\n    {\"title\": \"Slide Title\", \"type\": \"bullets\", \"bullets\": [\"Point 1\", \"Point 2\"]}\n  ],\n  \"colorScheme\": \"professional\"\n}";

            // Find text content and enhance it
            const enhancedContent = content.map(item => {
              if (item.type === 'text') {
                return {
                  ...item,
                  text: item.text + enhancementText
                };
              }
              return item;
            });

            // If no text content, add the enhancement as new text
            if (!enhancedContent.some(item => item.type === 'text')) {
              enhancedContent.unshift({
                type: 'text',
                text: enhancementText
              });
            }

            return { role, content: enhancedContent };
          } else {
            // For text-only messages
            return {
              role,
              content: `${content}\n\nIf this is a request for a PowerPoint presentation, please structure your response as a JSON object with this format:
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle",
  "slides": [
    {"title": "Slide Title", "content": "Slide content"},
    {"title": "Slide Title", "type": "bullets", "bullets": ["Point 1", "Point 2"]}
  ],
  "colorScheme": "professional"
}`
            };
          }
        }
        return { role, content };
      })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: enhancedMessages })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed: ${res.status}`)
      }

      const data = await res.json()
      const assistant = data?.message?.content || 'No response.'

      // Check if this is a presentation request and analyze it
      const isPresentationRequest = input.toLowerCase().includes('presentation') ||
                                  input.toLowerCase().includes('powerpoint') ||
                                  input.toLowerCase().includes('pptx') ||
                                  input.toLowerCase().includes('slides')

      if (isPresentationRequest) {
        // Analyze the request for intelligent routing
        await analyzeRequest(input)
      }

      // Try to detect and parse JSON for PPTX generation
      const jsonMatch = assistant.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const pptxData = JSON.parse(jsonMatch[0])
          if (pptxData.title && pptxData.slides) {
            setLastPptxData(pptxData)
            // Create a nicely formatted response instead of showing raw JSON
            const formattedResponse = <PresentationOutline pptxData={pptxData} />
            setMessages(m => [...m, { role: 'assistant', content: formattedResponse, isFormatted: true }])
            return
          }
        } catch (e) {
          // Not valid JSON, ignore
        }
      }

      setMessages(m => [...m, { role: 'assistant', content: assistant }])
    } catch (e) {
      setMessages(m => [
        ...m,
        { role: 'assistant', content: `Error: ${e.message}` }
      ])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <TopBar />
      <div className="app-wrap">
        <div className="container">
          <div className="card" role="group" aria-label="Chat">
          <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'flex-end' }}>
            {!lastPptxData && (
              <button className="small" onClick={async () => {
                // Finalize: request structured JSON plan from the AI using current messages
                const messagesForAI = messages.map(({role, content})=>({role, content}));
                setPptxLoading(true);
                try {
                  const res = await fetch('/api/chat', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ messages: messagesForAI.concat([{ role: 'system', content: 'You are a presentation assistant. When asked, produce a JSON representation of the slides in the format: {"title":"","subtitle":"","slides":[{"title":"","type":"","content":"","bullets":[]}]}. Do not output any additional text. This output is for the application to consume.' }]) }) });
                  const data = await res.json();
                  const assistant = data?.message?.content || '';
                  const jsonMatch = assistant.match(/\{[\s\S]*\}/);
                  if (jsonMatch) {
                    try {
                      const pptxData = JSON.parse(jsonMatch[0]);
                      setLastPptxData(pptxData);
                      setMessages(m=>[...m, { role: 'assistant', content: 'Plan finalized. Click Generate to build the PowerPoint.' }]);
                    } catch(e) {
                      setMessages(m=>[...m, { role: 'assistant', content: 'Could not parse plan. Please refine.' }]);
                    }
                  } else {
                    setMessages(m=>[...m, { role: 'assistant', content: 'No plan returned. Please ask the assistant to provide a slide plan.' }]);
                  }
                } catch(e) {
                  setMessages(m=>[...m, { role: 'assistant', content: `Error finalizing plan: ${e.message}` }]);
                } finally { setPptxLoading(false) }
              }}>Finalize plan</button>
            )}
          </div>
          <div className="header">
            <div style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: 999 }} />
            <div>
              <h1>Create Presentation</h1>
              <div className="sub">Describe your PowerPoint and let AI build it</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Template</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {templates.slice(0,5).map(t => (
                  <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={"template-btn " + (selectedTemplate===t.id? 'active':'')} title={t.name}>
                    <img src={`${t.thumbnail}?v=${Date.now()}`} alt={t.name} loading="lazy" decoding="async" />
                  </button>
                ))}
                <button className="template-random" onClick={() => setSelectedTemplate(null)}>Auto-detect</button>
              </div>
            </div>
          </div>

          <div className="messages" ref={listRef}>
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} isFormatted={m.isFormatted} />
            ))}
          </div>

          {intelligentAnalysis && (
            <div style={{ padding: '0 16px' }}>
              <IntelligentAnalysis analysis={intelligentAnalysis} />
            </div>
          )}

          <div style={{ padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="small" onClick={() => setShowSlideDetails(s => !s)}>{showSlideDetails ? 'Hide slide details' : 'Show slide details'}</button>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
              Selected template: {selectedTemplate || 'Auto-detect'}
            </div>
          </div>

          {/* Selected Images Display */}
          {selectedImages.length > 0 && (
            <div style={{ padding: '8px 16px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedImages.map(image => (
                  <div key={image.id} style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={image.url}
                      alt={image.name}
                      style={{
                        width: '80px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        border: '2px solid var(--primary)'
                      }}
                    />
                    <button
                      onClick={() => removeImage(image.id)}
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image URL Input */}
          {showImageInput && (
            <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <button
                  onClick={addImageUrl}
                  disabled={!imageUrl.trim()}
                  style={{
                    padding: '8px 16px',
                    background: imageUrl.trim() ? 'var(--primary)' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: imageUrl.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '14px'
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setShowImageInput(false)}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="input-row">
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <textarea
                className="input"
                rows={1}
                placeholder="Describe your presentation or analyze images..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                aria-label="Message"
              />
              <div style={{ display: 'flex', gap: '8px', padding: '4px 0' }}>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--primary)',
                    borderRadius: '4px',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Upload image"
                >
                  <Upload size={14} />
                  Upload
                </button>
                <button
                  onClick={() => setShowImageInput(!showImageInput)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: showImageInput ? 'var(--primary)' : 'transparent',
                    border: '1px solid var(--primary)',
                    borderRadius: '4px',
                    color: showImageInput ? 'white' : 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Add image URL"
                >
                  <Image size={14} />
                  URL
                </button>
              </div>
            </div>
            <button className="button" onClick={send} disabled={!canSend} aria-disabled={!canSend}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <div className="small" style={{ padding: '0 12px 12px' }}>
            Tip: Press Enter to send, Shift+Enter for new line.
          </div>
        </div>

        <section className="pptx-area" aria-label="Presentation preview">
          {lastPptxData ? (
            <div className="pptx-ready">
              <div className="pptx-preview">
                <h3>📊 {lastPptxData.title}</h3>
                {lastPptxData.subtitle && <p className="subtitle">{lastPptxData.subtitle}</p>}
                <div className="slides-info">
                  {lastPptxData.slides?.length} slides • {lastPptxData.colorScheme || 'professional'} theme
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                  <button className="button generate-btn" onClick={() => {
                    // Get user context from recent messages
                    const userMessages = messages.filter(m => m.role === 'user').slice(-3)
                    const userContext = userMessages.map(m => m.content).join(' ')
                    generatePPTX({ ...lastPptxData, template: selectedTemplate }, userContext)
                  }} disabled={pptxLoading}>
                    {pptxLoading ? 'Generating...' : '⬇ Generate PowerPoint'}
                  </button>
                  <button className="button" onClick={() => setShowSlideDetails(s => !s)} style={{ background: '#eef2ff', color: 'var(--primary)' }}>
                    {showSlideDetails ? 'Hide details' : 'Show slide details'}
                  </button>
                </div>

                {showSlideDetails && (
                  <div style={{ textAlign: 'left', marginTop: 16 }}>
                    <h4>Slides preview</h4>
                    {lastPptxData.slides.map((s, idx) => (
                      <div key={idx} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                        <strong>{idx+1}. {s.title}</strong>
                        <div style={{ color: 'var(--muted)', marginTop: 6 }}>{s.type === 'bullets' ? s.bullets?.join('\n') : s.content}</div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="pptx-placeholder">
              Ask me to create a presentation and I'll help you generate a PowerPoint file!
            </div>
          )}
        </section>
        </div>
      </div>
    </>
  )
}
