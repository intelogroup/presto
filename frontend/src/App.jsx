import React, { useEffect, useRef, useState } from 'react'
import { Target, Presentation, BookOpen, Users, Star, Lightbulb, Zap, Sparkles, Rocket, CheckCircle, Palette, FileText, ChevronRight, Image, Upload, X } from 'lucide-react'
import SlideDetails from './components/SlideDetails'

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
        <span>Please review this outline and confirm the details. I will generate the PowerPoint only after you confirm. ✅</span>
      </div>
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button 
          className="primary"
          onClick={() => {
            // This will be handled by the parent component
            window.dispatchEvent(new CustomEvent('generatePresentation', { detail: pptxData }))
          }}
          style={{ padding: '12px 24px', fontSize: '16px' }}
        >
          🚀 Generate Presentation
        </button>
      </div>
    </div>
  )
}

export default function App() {
  // Chat history management
  const CHAT_HISTORY_KEY = 'presto_chat_history'
  const MAX_MESSAGES = 50 // Limit to prevent localStorage from growing too large
  
  const loadChatHistory = () => {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(-MAX_MESSAGES) // Keep only recent messages
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history:', e)
    }
    // Return default welcome message if no history
    return [{ role: 'assistant', content: 'Hey there! 👋 I\'m your AI assistant. I\'m here to help with any questions or tasks you might have!' }]
  }
  
  const saveChatHistory = (messages) => {
    try {
      // Only save the last MAX_MESSAGES to prevent localStorage bloat
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
  const listRef = useRef(null)
  const fileInputRef = useRef(null)

  const canSend = (input.trim().length > 0 || selectedImages.length > 0) && !loading

  // Helper: normalize slides to backend schema
  // API base helper - uses VITE_API_BASE_URL when set in environment
  const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
  const apiFetch = (path, opts = {}) => {
    try {
      const base = API_BASE.replace(/\/$/, '')
      const url = base ? base + path : path
      return fetch(url, opts)
    } catch (e) {
      return Promise.reject(e)
    }
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

  // Handle generate presentation event
  useEffect(() => {
    const handleGeneratePresentation = (event) => {
      const pptxData = event.detail
      setPptxLoading(true)

      const normalized = normalizePptxRequest(pptxData)

      // Generate the actual presentation
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
    // Save chat history whenever messages change
    saveChatHistory(messages)
  }, [messages])

  useEffect(() => {
    // load templates
    apiFetch('/api/templates')
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
      const basePayload = {
        ...presentationData,
        userInput: userContext || `Generate a presentation about ${presentationData.title}`,
        template: selectedTemplate
      }
      const requestBody = normalizePptxRequest(basePayload)

      console.log('🎯 Generating PPTX with intelligent routing:', requestBody)

      let res, isBackupUsed = false

      try {
        // Try main server first
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

        // Fallback to backup server
        try {
          const backupBody = normalizePptxRequest(presentationData)
          res = await fetch('http://localhost:3005/generate-pptx', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(backupBody)
          })

          if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            // Handle specific error types with conversational responses
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

      // Get analysis info from headers (main server only)
      const templateUsed = res.headers.get('X-Presto-Template') || res.headers.get('X-Generator')
      const isValidated = res.headers.get('X-Presto-Validated')

      // Create blob and download
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
    setAiResponseComplete(false) // Mark AI response as incomplete when starting new request
    
    // Hide presentation outline and slide details when user sends a new message
    if (showPresentationOutline) {
      setShowPresentationOutline(false)
      setPresentationData(null)
    }
    if (showSlideDetails) {
      setShowSlideDetails(false)
      setSlideDetailsData(null)
    }

    // Check for simple greetings and respond casually
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
      // Enhanced prompt for PowerPoint generation
      const enhancedMessages = next; // Remove JSON-format injection to avoid premature structure generation

      const res = await apiFetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: enhancedMessages })
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        // Handle specific error types with conversational responses
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

      // Handle presentation state and generate button visibility
      if (presentationState && canGeneratePPTX) {
        // User has completed all steps and agreed to generate - prepare data for PPTX generation
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
        
        // Store pending data but don't show generate button until AI response is complete
          setPendingPptxData(pptxData)
          setMessages(m => [...m, { role: 'assistant', content: assistant }])
          
          // Mark AI response as complete and show generate button
          setTimeout(() => {
            setAiResponseComplete(true)
            setLastPptxData(pptxData)
            setPendingPptxData(null)
          }, 500) // Small delay to ensure message is fully rendered
        
        return
      }

      // Handle canGeneratePPTX flag when no presentationState (direct JSON response)
      if (canGeneratePPTX && !presentationState) {
        // Try to parse the assistant response as JSON for presentation data
        try {
          const pptxData = JSON.parse(assistant)
          if (pptxData.title && pptxData.slides && pptxData.slides.length >= 1) {
            // Add a user-friendly message
            const friendlyMessage = "I've created your presentation! Click the button below to generate your PowerPoint file."
            setMessages(m => [...m, { role: 'assistant', content: friendlyMessage }])
            
            // Set up PPTX data for generation
            const formattedPptxData = {
              title: pptxData.title,
              subtitle: pptxData.subtitle || '',
              slides: pptxData.slides,
              theme: pptxData.theme || 'professional',
              colorScheme: pptxData.colorScheme || 'professional'
            }
            
            // Mark AI response as complete and show generate button
            setTimeout(() => {
              setAiResponseComplete(true)
              setLastPptxData(formattedPptxData)
            }, 500)
            
            return
          }
        } catch (e) {
          console.warn('Failed to parse assistant response as JSON for PPTX:', e)
          // Fall through to normal message handling
        }
      }

      // Check for presentation outline marker (legacy support)
      if (assistant.includes('```SHOW_PRESENTATION_OUTLINE```')) {
        const parts = assistant.split('```SHOW_PRESENTATION_OUTLINE```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const pptxData = JSON.parse(jsonPart)
            if (pptxData.title && pptxData.slides) {
              // Show the message content first
            setMessages(m => [...m, { role: 'assistant', content: messageContent }])
            
            // Then show the presentation outline
            setPresentationData(pptxData)
            setShowPresentationOutline(true)
            
            // Mark AI response as complete
            setTimeout(() => {
              setAiResponseComplete(true)
            }, 300)
            
            return
            }
          } catch (e) {
            console.warn('Failed to parse presentation outline JSON:', e)
          }
        }
      }

      // Check for PowerPoint ready marker (NEW - primary detection)
      if (assistant.includes('```GENERATE_POWERPOINT_READY```')) {
        const parts = assistant.split('```GENERATE_POWERPOINT_READY```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const pptxData = JSON.parse(jsonPart)
            if (pptxData.title && pptxData.slides && pptxData.slides.length >= 1) {
              // Add the message content first
              setMessages(m => [...m, { role: 'assistant', content: messageContent }])
              
              // Set up PPTX data for generation
              const formattedPptxData = {
                title: pptxData.title,
                subtitle: pptxData.subtitle || '',
                slides: pptxData.slides,
                theme: pptxData.theme || 'professional',
                colorScheme: pptxData.colorScheme || 'professional'
              }
              
              // Mark AI response as complete and show generate button
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

      // Check for slide details marker (legacy support)
      if (assistant.includes('```SHOW_SLIDE_DETAILS```')) {
        const parts = assistant.split('```SHOW_SLIDE_DETAILS```')
        const messageContent = parts[0].trim()
        const jsonPart = parts[1]?.trim()
        
        if (jsonPart) {
          try {
            const slideDetailsJson = JSON.parse(jsonPart)
            setSlideDetailsData(slideDetailsJson)
            setShowSlideDetails(true)
            
            // Add only the message content (without the JSON)
            setMessages(m => [...m, { role: 'assistant', content: messageContent }])
            
            // Mark AI response as complete
            setTimeout(() => {
              setAiResponseComplete(true)
            }, 300)
            
            return
          } catch (e) {
            console.warn('Failed to parse slide details JSON:', e)
          }
        }
      }

      setMessages(m => [...m, { role: 'assistant', content: assistant }])
      
      // Mark AI response as complete
      setTimeout(() => {
        setAiResponseComplete(true)
      }, 300)
      
    } catch (e) {
      // Provide conversational error responses
      let errorMessage = e.message
      // If it's a generic error message, make it more conversational
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
      
      // Mark AI response as complete even for errors
      setTimeout(() => {
        setAiResponseComplete(true)
      }, 300)
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
          {/* Generate button will be shown only when lastPptxData exists */}
          <div className="header">
            <div style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: 999 }} />
            <div>
              <h1>AI Chat Assistant</h1>
              <div className="sub">Ask me anything - I'm here to help!</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <button 
                onClick={clearChatHistory}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: '4px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f3f4f6'
                  e.target.style.color = '#374151'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.color = '#6b7280'
                }}
                title="Clear chat history"
              >
                Clear History
              </button>
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

          {showPresentationOutline && presentationData && (
            <div style={{ padding: '16px', background: '#f8fafc', margin: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <PresentationOutline pptxData={presentationData} />
            </div>
          )}

          {showSlideDetails && slideDetailsData && (
            <div style={{ margin: '20px 0' }}>
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

          <div style={{ padding: '8px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 12 }}>
                {/* Always visible Generate PowerPoint button with clear visual states */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <button 
                    className="button generate-btn" 
                    onClick={() => {
                      if (lastPptxData && aiResponseComplete) {
                        // Get user context from recent messages
                        const userMessages = messages.filter(m => m.role === 'user').slice(-3)
                        const userContext = userMessages.map(m => m.content).join(' ')
                        generatePPTX({ ...lastPptxData, template: selectedTemplate }, userContext)
                      }
                    }} 
                    disabled={pptxLoading || !(lastPptxData && aiResponseComplete)}
                    style={{
                      background: pptxLoading ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 
                                 (lastPptxData && aiResponseComplete) ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 
                                 'linear-gradient(135deg, #6b7280, #4b5563)',
                      cursor: (lastPptxData && aiResponseComplete && !pptxLoading) ? 'pointer' : 'not-allowed',
                      opacity: 1,
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      boxShadow: (lastPptxData && aiResponseComplete && !pptxLoading) ? 
                                '0 4px 12px rgba(34, 197, 94, 0.3)' : 
                                pptxLoading ? '0 4px 12px rgba(245, 158, 11, 0.3)' :
                                '0 2px 8px rgba(107, 114, 128, 0.2)',
                      transform: (lastPptxData && aiResponseComplete && !pptxLoading) ? 'translateY(0)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {pptxLoading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '16px', 
                          height: '16px', 
                          border: '2px solid transparent',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></span>
                        Generating...
                      </span>
                    ) : (lastPptxData && aiResponseComplete) ? (
                      '🚀 Generate PowerPoint'
                    ) : (
                      '📋 Generate PowerPoint'
                    )}
                  </button>
                  
                  {/* User expectation messaging */}
                  {!(lastPptxData && aiResponseComplete) && !pptxLoading && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#6b7280', 
                      textAlign: 'center',
                      maxWidth: '280px',
                      lineHeight: '1.4'
                    }}>
                      💡 Ask me to create a presentation and I'll prepare the content for you to generate!
                    </div>
                  )}
                  
                  {/* Slide count and status when data is available */}
                  {lastPptxData && aiResponseComplete && (
                    <div style={{ 
                      fontSize: '13px', 
                      color: '#059669', 
                      textAlign: 'center',
                      fontWeight: '500'
                    }}>
                      ✅ Ready to generate {lastPptxData.slides?.length || 0} slides
                    </div>
                  )}
                </div>
                
                {/* Conditional Show Details button - only when data is available */}
                {lastPptxData && aiResponseComplete && (
                  <button 
                    className="button" 
                    onClick={() => setShowSlideDetails(s => !s)} 
                    style={{ 
                      background: '#eef2ff', 
                      color: 'var(--primary)',
                      border: '1px solid #e0e7ff',
                      fontSize: '14px'
                    }}
                  >
                    {showSlideDetails ? 'Hide details' : `Show ${lastPptxData.slides?.length || 0} slide details`}
                  </button>
                )}
              </div>

              {showSlideDetails && lastPptxData && aiResponseComplete && (
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
        </section>
        </div>
      </div>
      
      {/* Testimonials Section */}
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
