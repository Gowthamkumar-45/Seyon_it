'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { catColor } from '@/lib/api'

export default function ProjectCard({ project, index = 0, tilt = true }) {
  const ref = useRef(null)
  const color = catColor(project.category)
  const handleMove = (e) => {
    if (!tilt || !ref.current) return
    if (window.matchMedia('(max-width: 768px)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    const rx = (0.5 - py) * 14
    const ry = (px - 0.5) * 16
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`
    ref.current.style.setProperty('--mx', `${px * 100}%`)
    ref.current.style.setProperty('--my', `${py * 100}%`)
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, z: -60 }}
      whileInView={{ opacity: 1, y: 0, z: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        data-cursor
        className="relative rounded-3xl glass p-6 h-full transition-transform duration-200 ease-out will-change-transform overflow-hidden"
        style={{ boxShadow: `0 0 0 1px ${color}22`, borderColor: `${color}33` }}
      >
        {/* glossy reflection */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(400px circle at var(--mx,50%) var(--my,0%), ${color}22, transparent 60%)` }} />
        <div className="pointer-events-none absolute -inset-px rounded-3xl" style={{ boxShadow: `inset 0 0 40px -20px ${color}` }} />

        {/* thumbnail placeholder */}
        <div className="relative mb-5 aspect-[16/10] rounded-2xl overflow-hidden border border-white/10" style={{ background: `linear-gradient(135deg, ${color}22, rgba(5,7,15,0.6))` }}>
          <div className="absolute inset-0 grid-fade opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-5xl font-bold" style={{ color: `${color}` }}>{project.name?.charAt(0)}</span>
          </div>
          <span className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{project.category}</span>
        </div>

        <div className="relative">
          <h3 className="font-display text-xl font-semibold">{project.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{project.client || project.industry}</p>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
          <Link href={`/work/${project.slug}`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color }}>
            View Details <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
