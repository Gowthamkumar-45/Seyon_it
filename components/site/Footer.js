'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiGet, apiSend } from '@/lib/api'
import { MapPin, Mail, Phone, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function Footer() {
  const [company, setCompany] = useState({})
  const [email, setEmail] = useState('')
  useEffect(() => { apiGet('/company').then(setCompany).catch(() => {}) }, [])
  const subscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try { await apiSend('/newsletter', 'POST', { email }); toast.success('Subscribed! Thanks for joining.'); setEmail('') }
    catch { toast.error('Could not subscribe') }
  }
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="absolute inset-0 grid-fade opacity-40 pointer-events-none" />
      <div className="container relative py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold">S</span>
              <span className="font-display text-lg font-semibold">{company.name || 'Seyon IT Solutions'}</span>
            </div>
            <p className="text-muted-foreground max-w-md">{company.tagline || 'Government platforms, municipal systems, and mobile apps that serve real people.'}</p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-sm items-center gap-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email for updates" className="flex-1 rounded-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <button className="rounded-full bg-gradient-to-r from-primary to-accent p-2.5 text-primary-foreground"><Send size={16} /></button>
            </form>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
              <li><Link href="/work" className="hover:text-foreground">Work</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-foreground">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Reach us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-accent" />{company.addressLine || 'Coimbatore, Tamil Nadu, India'}</li>
              <li className="flex items-center gap-2"><Mail size={16} className="text-accent" />{company.email || 'hello@seyonit.com'}</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-accent" />{company.phone || '+91 90000 00000'}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {company.name || 'Seyon IT Solutions Pvt Ltd'}. All rights reserved.</p>
          <p>Coimbatore, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  )
}
