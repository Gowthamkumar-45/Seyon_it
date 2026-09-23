'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutGrid, Orbit } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import ProjectCard from '@/components/site/ProjectCard'
import CarouselRing from '@/components/site/CarouselRing'
import { Reveal } from '@/components/site/Reveal'
import { apiGet } from '@/lib/api'

const CATS = ['All', 'Government', 'Healthcare', 'E-commerce', 'Mobile Apps']

export default function Page() {
  const [projects, setProjects] = useState([])
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const [view, setView] = useState('grid')

  useEffect(() => { apiGet('/projects').then(setProjects).catch(() => {}) }, [])

  const matchCat = (p) => cat === 'All' || p.category === cat || (cat === 'Mobile Apps' && (p.category === 'Mobile App' || p.category === 'Mobile Apps'))
  const filtered = projects.filter((p) => matchCat(p) && (p.name?.toLowerCase().includes(q.toLowerCase()) || p.tagline?.toLowerCase().includes(q.toLowerCase()) || p.client?.toLowerCase().includes(q.toLowerCase())))

  return (
    <SiteShell>
      <section className="relative pt-36 pb-16">
        <div className="absolute inset-0 grid-fade opacity-40 pointer-events-none" />
        <div className="container relative">
          <Reveal>
            <p className="text-accent text-sm font-medium tracking-widest uppercase">Portfolio</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold mt-2">Our <span className="gradient-text">Work</span></h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">Platforms and apps we have built for governments, municipalities, and businesses across Tamil Nadu.</p>
          </Reveal>

          <div className="mt-10 flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="flex flex-wrap gap-2">
              {CATS.map((c) => (
                <button key={c} onClick={() => setCat(c)} data-cursor className={`relative rounded-full px-4 py-2 text-sm transition-colors ${cat === c ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground border border-white/10'}`}>
                  {cat === c && <motion.span layoutId="catpill" className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent" />}
                  <span className="relative z-10">{c}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="rounded-full bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-sm outline-none focus:border-accent w-full sm:w-56" />
              </div>
              <div className="hidden md:flex items-center rounded-full border border-white/10 p-1">
                <button onClick={() => setView('grid')} className={`rounded-full p-2 ${view === 'grid' ? 'bg-white/10 text-accent' : 'text-muted-foreground'}`}><LayoutGrid size={16} /></button>
                <button onClick={() => setView('ring')} className={`rounded-full p-2 ${view === 'ring' ? 'bg-white/10 text-accent' : 'text-muted-foreground'}`}><Orbit size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="container">
          {view === 'ring' ? (
            <CarouselRing projects={filtered} />
          ) : (
            <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, i) => (
                  <motion.div key={p.id || p.slug} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                    <ProjectCard project={p} index={i} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-20">No projects match your filter.</p>}
        </div>
      </section>
    </SiteShell>
  )
}
