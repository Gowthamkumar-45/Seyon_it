'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { apiSend } from '@/lib/api'

export default function AskAI() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hi! I'm Seyon AI. Ask me about our services, projects, or how we can help your department or business." }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight) }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next); setInput(''); setBusy(true)
    try {
      const payload = next.filter((m) => m.role === 'user' || m.role === 'assistant').slice(-10)
      const data = await apiSend('/ai/chat', 'POST', { messages: payload })
      setMessages([...next, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: e.message?.includes('not configured') ? 'The AI assistant is not switched on yet. Please use the contact form and our team will help.' : 'Sorry, I hit an error. Please try the contact form.' }])
    } finally { setBusy(false) }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} data-cursor className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_0_36px_-6px_rgba(56,189,248,0.9)] hover:scale-105 transition-transform" aria-label="Ask Seyon AI">
        <MessageCircle size={24} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.96 }} transition={{ type: 'spring', damping: 22 }} className="fixed bottom-6 right-6 z-[61] w-[min(92vw,380px)] h-[min(70vh,520px)] flex flex-col glass-strong rounded-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2"><Sparkles size={18} className="text-accent" /><span className="font-display font-semibold">Ask Seyon AI</span></div>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 noise-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground border border-border'}`}>{m.content}</div>
                </div>
              ))}
              {busy && <div className="text-xs text-muted-foreground px-1">Seyon AI is typing…</div>}
            </div>
            <div className="p-3 border-t border-white/10 flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type your question…" className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <button onClick={send} disabled={busy} className="rounded-full bg-gradient-to-r from-primary to-accent p-2.5 text-primary-foreground disabled:opacity-50"><Send size={16} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
