import React, { useEffect, useRef, useState } from 'react'
import { Target, Presentation, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle, Palette, FileText, ChevronRight, Image, Upload, X } from 'lucide-react'
import SlideDetails from './components/SlideDetails'

function Message({ role, content, isFormatted }) {
  const renderContent = () => {
    if (isFormatted) {
      return content
    }

    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((item, index) => {
            if (item.type === 'text') {
              return <div key={index} className="msg-block msg-text">{item.text}</div>
            } else if (item.type === 'image_url') {
              return (
                <div key={index} className="msg-block">
                  <img
                    src={item.image_url.url}
                    alt="User uploaded image"
                    className="msg-image"
                  />
                </div>
              )
            }
            return null
          })}
        </div>
      )
    }

    return <div className="msg-text">{content}</div>
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
        <div className="logo-shape">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="url(#gradient)" />
            <path d="M8 12h16v2H8v-2zm0 4h12v2H8v-2zm0 4h16v2H8v-2z" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-name">Presto</span>
          <span className="brand-tagline">slides</span>
        </div>
        <span className="ai-label">AI PowerPoint Generator</span>
      </div>
      <div className="top-actions">
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  )
}

function IntelligentAnalysis({ analysis }) {
  if (!analysis || !analysis.success) return null

  return (
    <div className="analysis-card">
      <div className="analysis-header">
        <Zap size={16} className="analysis-icon" />
        <strong className="analysis-title">AI Template Analysis</strong>
      </div>

      {analysis.analysis?.recommendedTemplate ? (
        <div>
          <div className="analysis-recommend">
            <span className="analysis-recommend-label">✨ Recommended: </span>
            {analysis.analysis.recommendedTemplate}
          </div>
          <div className="analysis-reason">{analysis.analysis.reasoning}</div>
          {analysis.analysis.detectedTopics?.length > 0 && (
            <div className="analysis-topics">
              <span className="analysis-topics-label">Topics: </span>
              {analysis.analysis.detectedTopics.map((topic, i) => (
                <span key={i} className="topic-chip">{topic}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="analysis-fallback">
          Using default generator for optimal reliability and general-purpose presentations.
        </div>
      )}
    </div>
  )
}

function PresentationOutline({ pptxData }) {
  const slideIcons = [FileText, Target, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle]

  return (
    <div className="outline">
      <div className="outline-header">
        <Target size={20} className="outline-icon" />
        <strong className="outline-title-text">{pptxData.title}</strong>
      </div>

      {pptxData.subtitle && (
        <div className="outline-subtitle">{pptxData.subtitle}</div>
      )}

      <div className="outline-section">
        <Presentation size={18} className="outline-icon" />
        <strong>Presentation Outline</strong>
        <span className="outline-count">({pptxData.slides?.length || 0} slides)</span>
      </div>

      <div className="outline-list">
        {pptxData.slides?.map((slide, index) => {
          const IconComponent = slideIcons[index] || FileText
          return (
            <div key={index} className="outline-item">
              <div className="outline-item-head">
                <IconComponent size={16} className="outline-icon" />
                <strong>Slide {index + 1}: {slide.title}</strong>
              </div>

              {slide.type === 'bullets' && slide.bullets ? (
                <div className="outline-bullets">
                  {slide.bullets.map((bullet, i) => (
                    <div key={i} className="outline-bullet-row">
                      <ChevronRight size={12} className="outline-bullet-icon" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              ) : slide.content ? (
                <div className="outline-content">
                  {slide.content.length > 80 ?
                    slide.content.substring(0, 80) + '...' :
                    slide.content}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="outline-theme-row">
        <Palette size={16} className="outline-icon" />
        <span>Theme: <strong>{pptxData.colorScheme || 'professional'}</strong></span>
      </div>

      <div className="outline-ready">
        <CheckCircle size={16} />
        <span>Please review this outline and confirm the details. I will generate the PowerPoint only after you confirm. ✅</span>
      </div>
      
      <div className="outline-cta">
        <button 
          className="primary"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('generatePresentation', { detail: pptxData }))
          }}
        >
          🚀 Generate Presentation
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const CHAT_HISTORY_KEY = 'presto_chat_history'
  const MAX_MESSAGES = 50
  
  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(-MAX_MESSAGES)
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e)
    }
    return [{ role: 'assistant', content: 'Hey there! 👋 I\'m your AI assistant. I\'m here to help with any questions or tasks you might have!' }]
  }
  
  const saveChatHistory = (messages) => {
    try {
      const messagesToSave = messages.slice(-MAX_MESSAGES)
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messagesToSave))
    } catch (e) {
      console.warn('Failed to save chat history:', e)
    }
  }
  
  const clearChatHistory = () => {
    try {
      localStorage.removeItem(CHAT_HISTORY_KEY)
      const defaultMessage = [{ role: 'assistant', content: 'Hey there! 👋 I\'m your AI assistant. I\'m here to help with any questions or tasks you might have!' }]
      setMessages(defaultMessage)
      setLastPptxData(null)
      setIntelligentAnalysis(null)
    } catch (e) {
      console.warn('Failed to clear chat history:', e)
    }
  }

  const [messages, setMessages] = useState(loadChatHistory())
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
  const [showPresentationOutline, setShowPresentationOutline] = useState(false)
  const [presentationData, setPresentationData] = useState(null)
  const [slideDetailsData, setSlideDetailsData] = useState(null)
  const [aiResponseComplete, setAiResponseComplete] = useState(true)
  const [pendingPptxData, setPendingPptxData] = useState(null)
  const [backendStatus, setBackendStatus] = useState('unknown') // 'online' | 'offline'
  const listRef = useRef(null)
  const fileInputRef = useRef(null)

  const canSend = (input.trim().length > 0 || selectedImages.length > 0) && !loading

  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
  const timedFetch = async (url, opts = {}, timeoutMs = 5000) => {
    const ctrl = new AbortController()
    const id = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      return await fetch(url, { ...opts, signal: ctrl.signal })
    } finally {
      clearTimeout(id)
    }
  }
  const apiFetch = async (path, opts = {}) => {
    const base = (API_BASE || '').replace(/\/$/, '')
    const absUrl = base ? base + path : null

    const logErrorDetail = (label, err) => {
      try {
        console.error(`[apiFetch] ${label}:`, err && (err.message || err))
      } catch (e) {}
    }

    // Try relative first
    try {
      const res = await fetch(path, opts)
      return res
    } catch (err) {
      logErrorDetail(`relative fetch failed (${path})`, err)
    }

    // Then absolute
    if (absUrl) {
      try {
        const res = await fetch(absUrl, { ...opts })
        return res
      } catch (err) {
        logErrorDetail(`absolute fetch failed (${absUrl})`, err)
      }
    }

    throw new Error(`Network request failed for ${absUrl || path}`)
  }
  const normalizePptxRequest = (data) => {
    const allowedTypes = new Set(['title', 'content', 'image', 'chart', 'table', 'conclusion'])
    const allowedLayouts = new Set(['standard', 'two-column', 'image-focus', 'chart-focus'])

    const theme = (data.colorScheme && ['professional', 'modern', 'minimal'].includes(data.colorScheme))
      ? data.colorScheme
      : (['professional', 'modern', 'minimal'].includes(data.theme) ? data.theme : 'professional')

    const slides = (data.slides || []).slice(0, 50).map((s) => {
      const hasBullets = Array.isArray(s.bullets) && s.bullets.length > 0
      const content = hasBullets ? s.bullets : (s.content ?? '')
      let type = s.type
      if (type === 'bullets') type = 'content'
      if (!allowedTypes.has(type)) type = 'content'

      let layout = s.layout
      if (!allowedLayouts.has(layout)) {
        if (type === 'image') layout = 'image-focus'
        else if (type === 'chart' || type === 'table') layout = 'chart-focus'
        else layout = 'standard'
      }

      return {
        title: s.title || 'Slide',
        content,
        type,
        layout
      }
    })

    return {
      title: data.title || 'AI Generated Presentation',
      slides,
      theme,
      template: data.template || undefined,
      userInput: data.userInput || undefined,
      options: data.options || undefined
    }
  }

  useEffect(() => {
    const handleGeneratePresentation = (event) => {
      if (backendStatus === 'offline') {
        setMessages(m => [...m, { role: 'assistant', content: 'Backend is unavailable right now. Please try again later.' }])
        return
      }
      const pptxData = event.detail
      setPptxLoading(true)

      const normalized = normalizePptxRequest(pptxData)

      apiFetch('/api/generate-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalized)
      })
      .then(res => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${normalized.title || 'presentation'}.pptx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        setMessages(m => [...m, { role: 'assistant', content: '🎉 Your presentation has been generated and downloaded! Feel free to ask if you need any modifications.' }])
        setShowPresentationOutline(false)
        setPresentationData(null)
      })
      .catch(err => {
        setMessages(m => [...m, { role: 'assistant', content: `❌ Sorry, there was an error generating your presentation: ${err.message}` }])
      })
      .finally(() => {
        setPptxLoading(false)
      })
    }

    window.addEventListener('generatePresentation', handleGeneratePresentation)
    return () => window.removeEventListener('generatePresentation', handleGeneratePresentation)
  }, [])

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
      const res = await apiFetch('/api/analyze-request', {
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
    saveChatHistory(messages)
  }, [messages])

  const getPlaceholderTemplates = () => {
    const svg = (t1, t2) => encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='100'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${t1}'/><stop offset='100%' stop-color='${t2}'/></linearGradient></defs><rect rx='8' width='160' height='100' fill='url(#g)'/><g fill='white' opacity='0.9'><rect x='18' y='22' width='84' height='10' rx='5'/><rect x='18' y='40' width='124' height='8' rx='4'/><rect x='18' y='56' width='98' height='8' rx='4'/></g></svg>`)
    return [
      { id: 'sleek-blue', name: 'Sleek Blue', thumbnail: `data:image/svg+xml;utf8,${svg('#0ea5e9','#0284c7')}` },
      { id: 'minimal-gray', name: 'Minimal Gray', thumbnail: `data:image/svg+xml;utf8,${svg('#64748b','#334155')}` },
      { id: 'vibrant-gradient', name: 'Vibrant', thumbnail: `data:image/svg+xml;utf8,${svg('#f43f5e','#f59e0b')}` },
      { id: 'emerald', name: 'Emerald', thumbnail: `data:image/svg+xml;utf8,${svg('#10b981','#059669')}` },
      { id: 'purple-haze', name: 'Purple Haze', thumbnail: `data:image/svg+xml;utf8,${svg('#8b5cf6','#6d28d9')}` }
    ]
  }

  const checkBackendAvailability = async () => {
    try {
      const base = (API_BASE || '').replace(/\/$/, '')
      const abs = base ? base + '/api/health' : null
      if (abs) {
        const resAbs = await timedFetch(abs, { method: 'GET' }, 4000)
        if (resAbs.ok) return true
      }
    } catch {}
    try {
      const resRel = await timedFetch('/api/health', { method: 'GET' }, 3000)
      if (resRel.ok) return true
    } catch {}
    return false
  }

  useEffect(() => {
    (async () => {
      const online = await checkBackendAvailability()
      setBackendStatus(online ? 'online' : 'offline')

      if (online) {
        try {
          const r = await apiFetch('/api/templates')
          const j = await r.json().catch(() => ({}))
          const items = j.templates || j.available?.themes?.map((t, i) => ({ id: `${t}-${i}`, name: t, thumbnail: getPlaceholderTemplates()[i%5].thumbnail })) || []
          setTemplates(items)
        } catch {
          setTemplates(getPlaceholderTemplates())
        }
      } else {
        setTemplates(getPlaceholderTemplates())
      }

      try {
        const saved = localStorage.getItem('presto_selected_template')
        if (saved) setSelectedTemplate(saved)
      } catch {}
    })()
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
      const basePayload = {
        ...presentationData,
        userInput: userContext || `Generate a presentation about ${presentationData.title}`,
        template: selectedTemplate
      }
      const requestBody = normalizePptxRequest(basePayload)

      console.log('🎯 Generating PPTX with intelligent routing:', requestBody)

      let res, isBackupUsed = false

      try {
        res = await apiFetch('/api/generate-pptx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        })

        if (!res.ok) {
          throw new Error(`Main server failed: ${res.status}`)
        }
      } catch (mainServerError) {
        console.warn('🛡️ Main server failed, trying backup server:', mainServerError.message)

        try {
          const backupBody = normalizePptxRequest(presentationData)
          res = await fetch('http://localhost:3005/generate-pptx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backupBody)
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            if (res.status === 429 || err.type === 'rate_limit') {
              let waitTimeMsg = 'You have reached the model rate limit. Please wait about 1 minute before trying again.'
              if (err.details && err.details.includes('15 minutes')) {
                waitTimeMsg = 'You have reached the model rate limit. Please wait about 15 minutes before trying again.'
              }
              throw new Error(err.error || waitTimeMsg)
            }
            if (res.status === 408 || err.type === 'timeout') {
              throw new Error(err.error || 'The model timed out. Please wait a few seconds and try again.')
            }
            if (res.status === 503 || err.type === 'service_unavailable') {
              throw new Error(err.error || 'I\'m having some technical difficulties right now. 🔧 But I\'ll be back soon!')
            }
            throw new Error(err.error || `Something went wrong! 😔 Let me try to help you anyway - what kind of presentation are you looking to create?`)
          }

          isBackupUsed = true
          console.log('✅ Backup server succeeded')
        } catch (backupError) {
          throw new Error(`Both servers failed. Main: ${mainServerError.message}, Backup: ${backupError.message}`)
        }
      }

      const templateUsed = res.headers.get('X-Presto-Template') || res.headers.get('X-Generator')
      const isValidated = res.headers.get('X-Presto-Validated')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${requestBody.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setLastPptxData(presentationData)

      let successMessage = `✅ PowerPoint generated successfully! "${requestBody.title}" has been downloaded.`

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

    let messageContent
    if (selectedImages.length > 0) {
      messageContent = []
      if (input.trim()) {
        messageContent.push({ type: 'text', text: input.trim() })
      }
      selectedImages.forEach(image => {
        messageContent.push({ type: 'image_url', image_url: { url: image.url } })
      })
    } else {
      messageContent = input
    }

    const userMessage = { role: 'user', content: messageContent }
    const next = [...messages, userMessage]
    setMessages(next)
    setInput('')
    setSelectedImages([])
    setLoading(true)
    setAiResponseComplete(false)
    
    if (showPresentationOutline) {
      setShowPresentationOutline(false)
      setPresentationData(null)
    }
    if (showSlideDetails) {
      setShowSlideDetails(false)
      setSlideDetailsData(null)
    }

    const inputText = typeof messageContent === 'string' ? messageContent.toLowerCase().trim() : 
      (Array.isArray(messageContent) ? messageContent.find(item => item.type === 'text')?.text?.toLowerCase().trim() || '' : '')
    
    const simpleGreetings = ['hi', 'hello', 'hey', 'sup', 'yo', 'howdy', 'greetings']
    const isSimpleGreeting = simpleGreetings.some(greeting => 
      inputText === greeting || inputText === greeting + '!' || inputText === greeting + '.'
    )

    if (isSimpleGreeting) {
      setLoading(false)
      const casualResponses = [
        'Hey! 😊 I\'m your friendly AI assistant. Ready to help with whatever you need?',
        'Hi there! 👋 I\'m an AI assistant here to help with questions, ideas, and conversations. What\'s on your mind?',
        'Hello! 🎯 I\'m your helpful AI companion. Whether you need information, advice, or just want to chat - I\'m here for you!',
        'Hey hey! ✨ I\'m your AI assistant. Feel free to ask me anything or just say hello!'
      ]
      const randomResponse = casualResponses[Math.floor(Math.random() * casualResponses.length)]
      setMessages(m => [...m, { role: 'assistant', content: randomResponse }])
      return
    }

    try {
      const enhancedMessages = next

      const res = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: enhancedMessages })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        if (res.status === 429 || err.type === 'rate_limit') {
          let waitTimeMsg = 'You have reached the model rate limit. Please wait about 1 minute before trying again.'
          if (err.details && err.details.includes('15 minutes')) {
            waitTimeMsg = 'You have reached the model rate limit. Please wait about 15 minutes before trying again.'
          }
          throw new Error(err.error || waitTimeMsg)
        }
        if (res.status === 408 || err.type === 'timeout') {
          throw new Error(err.error || 'The model timed out. Please wait a few seconds and try again.')
        }
        if (res.status === 503 || err.type === 'service_unavailable') {
          throw new Error(err.error || 'I\'m having some technical difficulties right now. 🔧 But I\'ll be back soon!')
        }
        throw new Error(err.error || `Something went wrong! 😔 Let me try to help you anyway - what kind of presentation are you looking to create?`)
      }

      const data = await res.json()
      const assistant = data?.response || 'No response.'
      const presentationState = data?.presentationState || null
      const canGeneratePPTX = data?.canGeneratePPTX || false

      if (presentationState && canGeneratePPTX) {
        const pptxData = {
          title: presentationState.title || 'AI Generated Presentation',
          subtitle: presentationState.subtitle || '',
          slides: presentationState.slides || [
            { title: 'Introduction', type: 'content', content: 'Welcome to our presentation' },
            { title: 'Main Content', type: 'bullets', bullets: ['Key point 1', 'Key point 2', 'Key point 3'] },
            { title: 'Conclusion', type: 'content', content: 'Thank you for your attention' }
          ],
          theme: presentationState.theme || 'professional',
          colorScheme: presentationState.colorScheme || 'professional'
        };
        
        setPendingPptxData(pptxData)
        setMessages(m => [...m, { role: 'assistant', content: assistant }])
        
        setTimeout(() => {
          setAiResponseComplete(true)
          setLastPptxData(pptxData)
          setPendingPptxData(null)
        }, 500)
        
        return
      }

      if (canGeneratePPTX && !presentationState) {
        try {
          const pptxData = JSON.parse(assistant)
          if (pptxData.title && pptxData.slides && pptxData.slides.length >= 1) {
            const friendlyMessage = "I've created your presentation! Click the button below to generate your PowerPoint file."
            setMessages(m => [...m, { role: 'assistant', content: friendlyMessage }])
            
            const formattedPptxData = {
              title: pptxData.title,
              subtitle: pptxData.subtitle || '',
              slides: pptxData.slides,
              theme: pptxData.theme || 'professional',
              colorScheme: pptxData.colorScheme || 'professional'
            }
            
            setTimeout(() => {
              setAiResponseComplete(true)
              setLastPptxData(formattedPptxData)
            }, 500)
            
            return
          }
        } catch (e) {
          console.warn('Failed to parse assistant response as JSON for PPTX:', e)
        }
      }

      if (assistant.includes('```SHOW_PRESENTATION_OUTLINE```')) {
        const parts = assistant.split('```SHOW_PRESENTATION_OUTLINE```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const pptxData = JSON.parse(jsonPart)
            if (pptxData.title && pptxData.slides) {
              setMessages(m => [...m, { role: 'assistant', content: messageContent }])
              setPresentationData(pptxData)
              setShowPresentationOutline(true)
              setTimeout(() => { setAiResponseComplete(true) }, 300)
              return
            }
          } catch (e) {
            console.warn('Failed to parse presentation outline JSON:', e)
          }
        }
      }

      if (assistant.includes('```GENERATE_POWERPOINT_READY```')) {
        const parts = assistant.split('```GENERATE_POWERPOINT_READY```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const pptxData = JSON.parse(jsonPart)
            if (pptxData.title && pptxData.slides && pptxData.slides.length >= 1) {
              setMessages(m => [...m, { role: 'assistant', content: messageContent }])
              const formattedPptxData = {
                title: pptxData.title,
                subtitle: pptxData.subtitle || '',
                slides: pptxData.slides,
                theme: pptxData.theme || 'professional',
                colorScheme: pptxData.colorScheme || 'professional'
              }
              setTimeout(() => {
                setAiResponseComplete(true)
                setLastPptxData(formattedPptxData)
              }, 500)
              return
            }
          } catch (e) {
            console.warn('Failed to parse PowerPoint ready JSON:', e)
          }
        }
      }

      if (assistant.includes('```SHOW_SLIDE_DETAILS```')) {
        const parts = assistant.split('```SHOW_SLIDE_DETAILS```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const slideDetailsJson = JSON.parse(jsonPart)
            setSlideDetailsData(slideDetailsJson)
            setShowSlideDetails(true)
            setMessages(m => [...m, { role: 'assistant', content: messageContent }])
            setTimeout(() => { setAiResponseComplete(true) }, 300)
            return
          } catch (e) {
            console.warn('Failed to parse slide details JSON:', e)
          }
        }
      }

      setMessages(m => [...m, { role: 'assistant', content: assistant }])
      setTimeout(() => { setAiResponseComplete(true) }, 300)
      
    } catch (e) {
      let errorMessage = e.message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Hmm, I\'m having trouble connecting right now. 🌐 Could you try again in a moment?'
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'The model timed out. Please wait a few seconds and try again.'
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'You have reached the model rate limit. Please wait about 1 minute before trying again.'
      }
      setMessages(m => [
        ...m,
        { role: 'assistant', content: errorMessage }
      ])
      setTimeout(() => { setAiResponseComplete(true) }, 300)
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

  const generateStatus = pptxLoading ? 'loading' : (lastPptxData && aiResponseComplete) ? 'ready' : 'disabled'

  return (
    <>
      <TopBar />
      <div className="app-wrap">
        <div className="container">
          <div className="card" role="group" aria-label="Chat">
          <div className="header">
            <div className="status-dot" />
            <div>
              <h1>AI Chat Assistant</h1>
              <div className="sub">Ask me anything - I'm here to help!</div>
            </div>
            <div className="header-actions">
              <button 
                onClick={clearChatHistory}
                className="clear-btn"
                title="Clear chat history"
              >
                Clear History
              </button>
              <div className="template-label">Template</div>
              <div className="template-list">
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
            <div className="pad-x">
              <IntelligentAnalysis analysis={intelligentAnalysis} />
            </div>
          )}

          {showPresentationOutline && presentationData && (
            <div className="outline-wrap">
              <PresentationOutline pptxData={presentationData} />
            </div>
          )}

          {showSlideDetails && slideDetailsData && (
            <div className="slide-details-wrap">
              <SlideDetails
                slideData={slideDetailsData}
                onGenerate={() => {
                  if (lastPptxData && aiResponseComplete) {
                    const userMessages = messages.filter(m => m.role === 'user').slice(-3)
                    const userContext = userMessages.map(m => m.content).join(' ')
                    generatePPTX({ ...lastPptxData, template: selectedTemplate }, userContext)
                  }
                }}
              />
            </div>
          )}

          <div className="template-selected-row">
            <div className="template-selected">Selected template: {selectedTemplate || 'Auto-detect'}</div>
          </div>

          {selectedImages.length > 0 && (
            <div className="selected-images">
              <div className="selected-images-grid">
                {selectedImages.map(image => (
                  <div key={image.id} className="image-chip">
                    <img src={image.url} alt={image.name} className="image-thumb" />
                    <button onClick={() => removeImage(image.id)} className="remove-image-btn" aria-label="Remove image">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showImageInput && (
            <div className="image-url-bar">
              <div className="image-url-inner">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addImageUrl()}
                  className="image-url-input"
                />
                <button onClick={addImageUrl} disabled={!imageUrl.trim()} className={`image-url-add-btn ${imageUrl.trim() ? 'enabled' : ''}`}>
                  Add
                </button>
                <button onClick={() => setShowImageInput(false)} className="icon-btn" aria-label="Close image URL bar">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="input-row">
            <div className="input-col">
              <textarea
                className="input"
                rows={1}
                placeholder="Describe your presentation or analyze images..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                aria-label="Message"
              />
              <div className="input-actions">
                <button onClick={() => fileInputRef.current?.click()} className="secondary-action-btn" title="Upload image">
                  <Upload size={14} />
                  Upload
                </button>
                <button onClick={() => setShowImageInput(!showImageInput)} className={`secondary-action-btn ${showImageInput ? 'is-active' : ''}`} title="Add image URL">
                  <Image size={14} />
                  URL
                </button>
              </div>
            </div>
            <button className="button" onClick={send} disabled={!canSend} aria-disabled={!canSend}>
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <div className="small pad-b">
            Tip: Press Enter to send, Shift+Enter for new line.
          </div>
        </div>

        <section className="pptx-area" aria-label="Presentation preview">
          <div className="pptx-ready">
            <div className="pptx-preview">
              {lastPptxData && aiResponseComplete ? (
                <>
                  <h3>📊 {lastPptxData.title}</h3>
                  {lastPptxData.subtitle && <p className="subtitle">{lastPptxData.subtitle}</p>}
                  <div className="slides-info">
                    {lastPptxData.slides?.length} slides • {lastPptxData.colorScheme || 'professional'} theme
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ color: '#9ca3af' }}>📊 Presentation Ready</h3>
                  <p className="subtitle" style={{ color: '#9ca3af' }}>Ask me to create a presentation and I'll help you generate a PowerPoint file!</p>
                </>
              )}
              
              <div className="generate-cta-wrap">
                <div className="generate-cta-inner">
                  <button 
                    className={`generate-cta ${generateStatus}`}
                    onClick={() => {
                      if (lastPptxData && aiResponseComplete) {
                        const userMessages = messages.filter(m => m.role === 'user').slice(-3)
                        const userContext = userMessages.map(m => m.content).join(' ')
                        generatePPTX({ ...lastPptxData, template: selectedTemplate }, userContext)
                      }
                    }} 
                    disabled={pptxLoading || !(lastPptxData && aiResponseComplete)}
                  >
                    {pptxLoading ? (
                      <span className="generate-loading">
                        <span className="spinner"></span>
                        Generating...
                      </span>
                    ) : (lastPptxData && aiResponseComplete) ? (
                      '🚀 Generate PowerPoint'
                    ) : (
                      '📋 Generate PowerPoint'
                    )}
                  </button>
                  {!(lastPptxData && aiResponseComplete) && !pptxLoading && (
                    <div className="generate-hint">
                      💡 Ask me to create a presentation and I'll prepare the content for you to generate!
                    </div>
                  )}
                  {lastPptxData && aiResponseComplete && (
                    <div className="generate-ready-note">
                      ✅ Ready to generate {lastPptxData.slides?.length || 0} slides
                    </div>
                  )}
                </div>
                {lastPptxData && aiResponseComplete && (
                  <button 
                    className="details-btn" 
                    onClick={() => setShowSlideDetails(s => !s)}
                  >
                    {showSlideDetails ? 'Hide details' : `Show ${lastPptxData.slides?.length || 0} slide details`}
                  </button>
                )}
              </div>

              {showSlideDetails && lastPptxData && aiResponseComplete && (
                <div className="slides-preview-list">
                  <h4>Slides preview</h4>
                  {lastPptxData.slides.map((s, idx) => (
                    <div key={idx} className="slide-preview-item">
                      <strong>{idx+1}. {s.title}</strong>
                      <div className="slide-preview-text">{s.type === 'bullets' ? s.bullets?.join('\n') : s.content}</div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
        </div>
      </div>
      
      <div className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">Trusted by thousands of professionals</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"Presto has revolutionized how I create presentations. What used to take hours now takes minutes!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">S</div>
                <div>
                  <div className="author-name">Sarah Chen</div>
                  <div className="author-title">Marketing Director</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"The AI understands exactly what I need. Professional presentations in seconds!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div>
                  <div className="author-name">Michael Rodriguez</div>
                  <div className="author-title">Sales Manager</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">★★★★★</div>
                <p>"Game-changer for our team. Beautiful slides with zero design experience needed."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">E</div>
                <div>
                  <div className="author-name">Emily Johnson</div>
                  <div className="author-title">Product Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
