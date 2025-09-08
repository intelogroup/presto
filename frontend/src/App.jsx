import React, { useEffect, useRef, useState } from 'react'

function Message({ role, content }) {
  return (
    <div className={`msg ${role}`} aria-live={role === 'assistant' ? 'polite' : 'off'}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
    </div>
  )
}

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! Ask me anything.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  const canSend = input.trim().length > 0 && !loading

  const scrollToBottom = () => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const send = async () => {
    if (!canSend) return
    const next = [...messages, { role: 'user', content: input }]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Request failed: ${res.status}`)
      }

      const data = await res.json()
      const assistant = data?.message?.content || 'No response.'
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
    <div className="app-wrap">
      <div className="container">
        <div className="card" role="group" aria-label="Chat">
          <div className="header">
            <div style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: 999 }} />
            <div>
              <h1>Minimal Chat</h1>
              <div className="sub">Light UI • React + Vite</div>
            </div>
          </div>

          <div className="messages" ref={listRef}>
            {messages.map((m, i) => (
              <Message key={i} role={m.role} content={m.content} />
            ))}
          </div>

          <div className="input-row">
            <textarea
              className="input"
              rows={1}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              aria-label="Message"
            />
            <button className="button" onClick={send} disabled={!canSend} aria-disabled={!canSend}>
              {loading ? 'Sending���' : 'Send'}
            </button>
          </div>
          <div className="small" style={{ padding: '0 12px 12px' }}>
            Tip: Press Enter to send, Shift+Enter for new line.
          </div>
        </div>
      </div>
    </div>
  )
}
