'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children, className = '', onClick, type = 'button', as = 'button', href, variant = 'primary' }) {
  const ref = useRef(null)
  const handleMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(max-width: 768px)').matches) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0px,0px)' }
  const base = 'relative inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all'
  const styles = variant === 'primary'
    ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
    : 'border border-border bg-background/60 text-foreground hover:border-foreground/30'
  const cls = `${base} ${styles} ${className}`
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>
  if (as === 'a') {
    return <a ref={ref} href={href} onMouseMove={handleMove} onMouseLeave={reset} className={cls} style={{ transition: 'transform 0.25s ease' }}>{inner}</a>
  }
  return <motion.button ref={ref} type={type} onClick={onClick} onMouseMove={handleMove} onMouseLeave={reset} className={cls} style={{ transition: 'transform 0.25s ease' }} whileTap={{ scale: 0.97 }}>{inner}</motion.button>
}
