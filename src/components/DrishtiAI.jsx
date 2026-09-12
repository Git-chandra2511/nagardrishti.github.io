import { useEffect, useRef, useState } from 'react'
import { LoaderCircle, MessageCircle, Send, Sparkles, X } from 'lucide-react'

const quickPrompts = [
  'How do I report a pothole?',
  'What issues can I scan?',
  'How does GPS tagging work?',
]

function apiBaseUrl() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, '')
  return ''
}

export default function DrishtiAI() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Drishti AI. I can help you report and understand civic issues.' },
  ])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(event, preset) {
    event?.preventDefault()
    const message = (preset || input).trim()
    if (!message || loading) return
    setInput('')
    setMessages(current => [...current, { role: 'user', text: message }])
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl()}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: messages.slice(-6).map(item => ({ role: item.role, text: item.text })),
        }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) throw new Error(payload.error?.message || 'Chat service unavailable.')
      setMessages(current => [...current, { role: 'assistant', text: payload.data.reply }])
    } catch (error) {
      setMessages(current => [...current, {
        role: 'assistant',
        text: error.message || 'I could not connect right now. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`drishti-ai ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="drishti-chat-panel" role="dialog" aria-modal="false" aria-label="Drishti AI chat">
          <header className="drishti-chat-header">
            <div className="drishti-chat-brand"><div><Sparkles size={17} /></div><span><strong>Drishti AI</strong><small>Civic help assistant</small></span></div>
            <button className="drishti-close" onClick={() => setOpen(false)} aria-label="Close Drishti AI"><X size={18} /></button>
          </header>
          <div className="drishti-chat-messages">
            {messages.map((message, index) => <div className={`drishti-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}
            {loading && <div className="drishti-message assistant"><LoaderCircle className="spin" size={15} /> Thinking…</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="drishti-quick-prompts">
            {quickPrompts.map(prompt => <button type="button" key={prompt} onClick={() => sendMessage(null, prompt)} disabled={loading}>{prompt}</button>)}
          </div>
          <form className="drishti-chat-form" onSubmit={sendMessage}>
            <input value={input} onChange={event => setInput(event.target.value)} placeholder="Ask Drishti AI…" aria-label="Message Drishti AI" />
            <button type="submit" aria-label="Send message" disabled={loading || !input.trim()}><Send size={16} /></button>
          </form>
        </section>
      )}
      <button className="drishti-ai-trigger" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close Drishti AI' : 'Open Drishti AI'}>
        {open ? <X size={21} /> : <MessageCircle size={21} />}
        <span>Drishti AI</span>
      </button>
    </div>
  )
}
