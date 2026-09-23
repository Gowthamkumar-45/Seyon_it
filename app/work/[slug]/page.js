'use client'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Building2, MessageSquare } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import { Reveal } from '@/components/site/Reveal'
import MagneticButton from '@/components/site/MagneticButton'
import { apiGet, catColor } from '@/lib/api'

export default function Page() {
  const { slug } = useParams()
  const router = useRouter()
  const [all, setAll] = useState([])
  const [project, setProject] = useState(null)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    apiGet('/projects').then(setAll).catch(() => {})
  }, [])
  useEffect(() => {
    setProject(null)
    apiGet(`/projects/${slug}`).then((p) => { setProject(p); setSlide(0) }).catch(() => {})
  }, [slug])

  const idx = all.findIndex((p) => p.slug === slug)
  const prev = idx > 0 ? all[idx - 1] : all[all.length - 1]
  const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : all[0]

  if (!project) {
    return (
      <SiteShell>
        <div className="pt-40 pb-40 container"><div className="h-72 rounded-3xl glass animate-pulse" /></div>
      </SiteShell>
    )
  }

  const color = catColor(project.category)
  const gallery = [0, 1, 2]

  return (
    <SiteShell>
      <section className="relative pt-32 pb-10">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${color}22, transparent 70%)` }} />
        <div className="container relative">
          <button onClick={() => router.push('/work')} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"><ArrowLeft size={16} /> Back to all work</button>
          <AnimatePresence mode="wait">
            <motion.div key={slug} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{project.category}</span>
              <h1 className="font-display text-4xl md:text-6xl font-bold mt-4 max-w-4xl">{project.name}</h1>
              <p className="mt-4 text-lg text-accent">{project.tagline}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Building2 size={16} />{project.client || project.industry}</div>
              <p className="mt-6 max-w-3xl text-muted-foreground leading-relaxed">{project.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Gallery — 3D perspective slider */}
      <section className="relative py-10">
        <div className="container">
          <div className="relative h-[300px] md:h-[440px]" style={{ perspective: '1600px' }}>
            {gallery.map((g, i) => {
              const offset = i - slide
              return (
                <motion.div
                  key={i}
                  className="absolute left-1/2 top-1/2 w-[80%] md:w-[62%] h-[88%] rounded-3xl overflow-hidden border border-white/10"
                  animate={{
                    x: `calc(-50% + ${offset * 42}%)`,
                    y: '-50%',
                    rotateY: offset * -22,
                    scale: offset === 0 ? 1 : 0.82,
                    opacity: Math.abs(offset) > 1 ? 0 : 1,
                    zIndex: 10 - Math.abs(offset),
                  }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  style={{ background: `linear-gradient(135deg, ${color}22, rgba(5,7,15,0.85))` }}
                >
                  <div className="absolute inset-0 grid-fade opacity-40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <span className="font-display text-6xl font-bold" style={{ color }}>{project.name?.charAt(0)}</span>
                    <span className="text-xs text-muted-foreground">Screenshot placeholder {g + 1}</span>
                  </div>
                </motion.div>
              )
            })}
            <button onClick={() => setSlide((s) => Math.max(0, s - 1))} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-20 rounded-full glass-strong p-3 hover:text-accent"><ChevronLeft size={20} /></button>
            <button onClick={() => setSlide((s) => Math.min(gallery.length - 1, s + 1))} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-20 rounded-full glass-strong p-3 hover:text-accent"><ChevronRight size={20} /></button>
          </div>
        </div>
      </section>

      {/* Feature tiles */}
      <section className="relative py-16">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold mb-8">Key features</h2></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(project.features || []).map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08, duration: 0.5 }} className="glass rounded-2xl p-5 flex items-start gap-3" style={{ borderColor: `${color}22` }}>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}22`, color }}><Check size={16} /></span>
                <span className="text-sm text-foreground/90">{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + prev/next */}
      <section className="relative py-12">
        <div className="container">
          <div className="rounded-3xl glass-strong p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 50% 80% at 50% 0%, ${color}33, transparent 70%)` }} />
            <div className="relative">
              <h3 className="font-display text-2xl md:text-3xl font-bold">Want something like this for your department or business?</h3>
              <div className="mt-6 flex justify-center">
                <MagneticButton as="a" href="/contact"><MessageSquare size={18} /> Discuss a similar project</MagneticButton>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <Link href={`/work/${prev?.slug}`} className="group glass rounded-2xl p-5 flex items-center gap-3">
              <ArrowLeft size={18} className="text-muted-foreground group-hover:text-accent" />
              <div className="text-left min-w-0">
                <p className="text-xs text-muted-foreground">Previous</p>
                <p className="font-display font-semibold truncate">{prev?.name}</p>
              </div>
            </Link>
            <Link href={`/work/${next?.slug}`} className="group glass rounded-2xl p-5 flex items-center justify-end gap-3 text-right">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="font-display font-semibold truncate">{next?.name}</p>
              </div>
              <ArrowRight size={18} className="text-muted-foreground group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
