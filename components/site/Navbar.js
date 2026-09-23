'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="container">
        <nav className={`flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all ${scrolled ? 'glass-strong shadow-lg' : ''}`}>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-display font-bold shadow-[0_0_24px_-4px_rgba(56,189,248,0.8)]">S</span>
            <span className="font-display text-lg font-semibold tracking-tight">Seyon<span className="text-accent">IT</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
              return (
                <Link key={l.href} href={l.href} className={`relative px-4 py-2 text-sm rounded-full transition-colors ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {active && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />}
                  <span className="relative z-10">{l.label}</span>
                </Link>
              )
            })}
            <Link href="/contact" className="ml-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_24px_-6px_rgba(56,189,248,0.8)]">Start a project</Link>
          </div>
          <button className="md:hidden p-2 text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="md:hidden mt-2 glass-strong rounded-2xl p-3 flex flex-col">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5">{l.label}</Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="mt-1 text-center rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-medium text-primary-foreground">Start a project</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
