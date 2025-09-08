import React, { useEffect, useRef, useState } from 'react'
import { Target, Presentation, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle, Palette, FileText, ChevronRight } from 'lucide-react'

function Message({ role, content, isFormatted }) {
  return (
    <div className={`msg ${role}`} aria-live={role === 'assistant' ? 'polite' : 'off'}>
      {isFormatted ? content : <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>}
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
  const listRef = useRef(null)

  const canSend = input.trim().length > 0 && !loading

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

      const res = await fetch('/api/generate-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `PPTX generation failed: ${res.status}`)
      }

      // Get analysis info from headers
      const templateUsed = res.headers.get('X-Presto-Template')
      const isValidated = res.headers.get('X-Presto-Validated')
      const analysisData = res.headers.get('X-Presto-Analysis')

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

      if (templateUsed && templateUsed !== 'presto_default') {
        successMessage += ` Using specialized template: ${templateUsed}.`
      }

      if (isValidated === 'true') {
        successMessage += ' Content validated and optimized for PowerPoint.'
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
    const next = [...messages, { role: 'user', content: input }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      // Enhanced prompt for PowerPoint generation
      const enhancedMessages = next.map(({ role, content }) => ({
        role,
        content: role === 'user' && next.length > 1 ?
          `${content}\n\nIf this is a request for a PowerPoint presentation, please structure your response as a JSON object with this format:
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle",
  "slides": [
    {"title": "Slide Title", "content": "Slide content"},
    {"title": "Slide Title", "type": "bullets", "bullets": ["Point 1", "Point 2"]}
  ],
  "colorScheme": "professional"
}` : content
      }))

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
                <button className="template-random" onClick={() => setSelectedTemplate(null)}>Random</button>
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

          <div className="input-row">
            <textarea
              className="input"
              rows={1}
              placeholder="Describe your presentation..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label="Message"
            />
            <button className="button" onClick={send} disabled={!canSend} aria-disabled={!canSend}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>
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
