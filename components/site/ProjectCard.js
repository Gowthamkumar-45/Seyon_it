'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
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
    ref.current.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-4px)`
  }
  const reset = () => { if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/work/${project.slug}`}>
        <div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          data-cursor
          className="group relative rounded-xl glass overflow-hidden h-full transition-transform duration-200 ease-out will-change-transform"
        >
          <span className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: color }} />
          <div className="relative aspect-[16/9] overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}1f, hsl(var(--surface)))` }}>
            <div className="absolute inset-0 grid-fade opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl font-bold" style={{ color }}>{project.name?.charAt(0)}</span>
            </div>
          </div>
          <div className="p-6">
            <span className="inline-block rounded-md px-2.5 py-1 text-xs font-medium mb-3" style={{ background: `${color}18`, color }}>{project.category}</span>
            <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary transition-colors">{project.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{project.client || project.industry}</p>
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{project.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">View details <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
