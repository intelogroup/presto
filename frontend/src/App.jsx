import React, { useEffect, useRef, useState } from 'react'

function Message({ role, content }) {
  return (
    <div className={`msg ${role}`} aria-live={role === 'assistant' ? 'polite' : 'off'}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
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
  const listRef = useRef(null)

  const canSend = input.trim().length > 0 && !loading

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
  }, [])

  const generatePPTX = async (presentationData) => {
    setPptxLoading(true)
    try {
      const res = await fetch('/api/generate-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(presentationData)
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `PPTX generation failed: ${res.status}`)
      }

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
      setMessages(m => [...m, {
        role: 'assistant',
        content: `✅ PowerPoint generated successfully! "${presentationData.title}" has been downloaded.`
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
      setMessages(m => [...m, { role: 'assistant', content: assistant }])

      // Try to detect and parse JSON for PPTX generation
      const jsonMatch = assistant.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          const pptxData = JSON.parse(jsonMatch[0])
          if (pptxData.title && pptxData.slides) {
            setLastPptxData(pptxData)
          }
        } catch (e) {
          // Not valid JSON, ignore
        }
      }
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
                    <img src={t.thumbnail} alt={t.name} style={{ width: 56, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                  </button>
                ))}
                <button className="template-random" onClick={() => setSelectedTemplate(null)}>Random</button>
              </div>
            </div>
          </div>

          <div className="messages" ref={listRef}>
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
          </div>

          <div style={{ padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="small" onClick={() => setShowSlideDetails(s => !s)}>{showSlideDetails ? 'Hide slide details' : 'Show slide details'}</button>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>
              Selected template: {selectedTemplate || 'Random'}
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
                <button
                  className="button generate-btn"
                  onClick={() => generatePPTX({ ...lastPptxData, template: selectedTemplate })}
                  disabled={pptxLoading}
                >
                  {pptxLoading ? 'Generating...' : '⬇ Generate PowerPoint'}
                </button>

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
