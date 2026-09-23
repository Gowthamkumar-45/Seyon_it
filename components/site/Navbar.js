'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

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
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-background/85 backdrop-blur-md border-border shadow-sm' : 'bg-transparent border-transparent'}`}>
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-display font-bold">S</span>
            <span className="font-display text-lg font-bold tracking-tight">Seyon <span className="text-primary">IT</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
              return (
                <Link key={l.href} href={l.href} className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  {l.label}
                  {active && <motion.span layoutId="navunderline" className="absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </div>
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">Start a project <ArrowRight size={15} /></Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </nav>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden bg-background border-t border-border">
            <div className="container py-3 flex flex-col">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-2 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b border-border/60 last:border-0">{l.label}</Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="mt-3 text-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">Start a project</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
