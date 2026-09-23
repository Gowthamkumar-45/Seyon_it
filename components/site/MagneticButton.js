'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function MagneticButton({ children, className = '', onClick, type = 'button', as = 'button', href }) {
  const ref = useRef(null)
  const handleMove = (e) => {
    const el = ref.current
    if (!el || window.matchMedia('(max-width: 768px)').matches) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'translate(0px,0px)' }
  const cls = `relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_-6px_rgba(56,189,248,0.7)] transition-shadow hover:shadow-[0_0_46px_-4px_rgba(34,211,238,0.9)] ${className}`
  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>
  if (as === 'a') {
    return (
      <a ref={ref} href={href} onMouseMove={handleMove} onMouseLeave={reset} className={cls} style={{ transition: 'transform 0.25s ease' }}>{inner}</a>
    )
  }
  return (
    <motion.button ref={ref} type={type} onClick={onClick} onMouseMove={handleMove} onMouseLeave={reset} className={cls} style={{ transition: 'transform 0.25s ease' }} whileTap={{ scale: 0.96 }}>{inner}</motion.button>
  )
}
