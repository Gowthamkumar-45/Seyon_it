'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send, Mail, Phone, MapPin, Loader2 } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import { Reveal, WordReveal } from '@/components/site/Reveal'
import { apiSend } from '@/lib/api'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  { q: 'Do you work with government departments?', a: 'Yes. Most of our work is for municipal corporations and district administrations across Tamil Nadu, including audit, healthcare, and water-body management platforms.' },
  { q: 'Can you build mobile apps?', a: 'Absolutely — we build field-ready Android and iOS apps, such as our Wooden Calculator and Plantation Management apps.' },
  { q: 'How do we start a project?', a: 'Send us a message using this form with a short brief. Our team will reach out to understand your requirements and propose a plan.' },
  { q: 'Where are you based?', a: 'We are based in Coimbatore, Tamil Nadu, and work with clients across the state.' },
]

export default function Page() {
  const [form, setForm] = useState({ name: '', organisation: '', phone: '', email: '', message: '' })
  const [busy, setBusy] = useState(false)
  const [polishing, setPolishing] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill name, email and message'); return }
    setBusy(true)
    try { await apiSend('/contact', 'POST', form); toast.success('Thank you! Your message has been sent.'); setForm({ name: '', organisation: '', phone: '', email: '', message: '' }) }
    catch { toast.error('Could not send. Please try again.') }
    finally { setBusy(false) }
  }

  const polish = async () => {
    if (!form.message.trim()) { toast.error('Write a rough message first'); return }
    setPolishing(true)
    try { const d = await apiSend('/ai/polish', 'POST', { text: form.message }); setForm((f) => ({ ...f, message: d.reply })); toast.success('Polished with AI') }
    catch (e) { toast.error(e.message?.includes('not configured') ? 'AI assist is not switched on yet.' : 'AI could not polish') }
    finally { setPolishing(false) }
  }

  return (
    <SiteShell>
      <section className="relative pt-36 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.22),transparent_70%)]" />
        <div className="container relative">
          <p className="text-accent text-sm font-medium tracking-widest uppercase">Contact</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mt-3 max-w-4xl leading-tight">
            <WordReveal text="Have a project for your department or business?" />
          </h1>
          <p className="mt-5 max-w-xl text-muted-foreground">Tell us what you need. We usually reply within a couple of working days.</p>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="container grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <form onSubmit={submit} className="glass-strong rounded-3xl p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Name *"><input value={form.name} onChange={set('name')} className="inp" placeholder="Your name" /></Field>
                <Field label="Organisation"><input value={form.organisation} onChange={set('organisation')} className="inp" placeholder="Department / company" /></Field>
                <Field label="Phone"><input value={form.phone} onChange={set('phone')} className="inp" placeholder="+91…" /></Field>
                <Field label="Email *"><input value={form.email} onChange={set('email')} type="email" className="inp" placeholder="you@example.com" /></Field>
              </div>
              <Field label="Message *">
                <div className="relative">
                  <textarea value={form.message} onChange={set('message')} rows={5} className="inp resize-none" placeholder="Describe your project…" />
                  <button type="button" onClick={polish} disabled={polishing} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs hover:border-accent disabled:opacity-50">
                    {polishing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-accent" />} Polish with AI
                  </button>
                </div>
              </Field>
              <motion.button type="submit" disabled={busy} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full rounded-full bg-gradient-to-r from-primary to-accent px-7 py-4 font-medium text-primary-foreground shadow-[0_0_36px_-8px_rgba(56,189,248,0.9)] hover:shadow-[0_0_50px_-6px_rgba(34,211,238,1)] transition-shadow inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Send message
              </motion.button>
            </form>
          </Reveal>

          <div className="lg:col-span-2 space-y-4">
            <Reveal delay={0.1}>
              <div className="glass rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent"><MapPin size={18} /></span> Coimbatore, Tamil Nadu, India</div>
                <div className="flex items-center gap-3 text-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent"><Mail size={18} /></span> hello@seyonit.com</div>
                <div className="flex items-center gap-3 text-sm"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent"><Phone size={18} /></span> +91 90000 00000</div>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="glass rounded-3xl p-6">
                <h3 className="font-display font-semibold mb-2">FAQ</h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((f, i) => (
                    <AccordionItem key={i} value={`i${i}`} className="border-white/10">
                      <AccordionTrigger className="text-sm text-left hover:no-underline">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      <style jsx global>{`.inp{width:100%;border-radius:0.75rem;background:hsl(var(--surface));border:1px solid hsl(var(--input));padding:0.75rem 1rem;font-size:0.9rem;outline:none;color:inherit}.inp:focus{border-color:hsl(var(--primary))}`}</style>
    </SiteShell>
  )
}

function Field({ label, children }) {
  return (<label className="block"><span className="mb-1.5 block text-xs text-muted-foreground">{label}</span>{children}</label>)
}
