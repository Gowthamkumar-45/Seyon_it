'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { ArrowRight, Quote } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import Hero from '@/components/site/Hero'
import StatsBand from '@/components/site/StatsBand'
import ProjectCard from '@/components/site/ProjectCard'
import { Reveal } from '@/components/site/Reveal'
import MagneticButton from '@/components/site/MagneticButton'
import { apiGet } from '@/lib/api'

const partners = ['Coimbatore City Municipal Corporation', 'Ramanathapuram District Admin', 'District CSR Cell', 'SHG Magalir Initiative', 'Forestry Dept']

export default function Page() {
  const [stats, setStats] = useState([])
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    apiGet('/stats').then(setStats).catch(() => {})
    apiGet('/projects').then(setProjects).catch(() => {})
    apiGet('/services').then(setServices).catch(() => {})
    apiGet('/testimonials').then(setTestimonials).catch(() => {})
  }, [])

  const featured = projects.filter((p) => p.featured).slice(0, 6)

  return (
    <SiteShell>
      <Hero />
      <StatsBand stats={stats} />

      {/* Featured work */}
      <section className="relative py-20">
        <div className="container">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
              <div>
                <p className="text-accent text-sm font-medium tracking-widest uppercase">Selected work</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Platforms in production</h2>
              </div>
              <Link href="/work" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">View all projects <ArrowRight size={16} /></Link>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(featured.length ? featured : projects.slice(0, 6)).map((p, i) => (
              <ProjectCard key={p.id || p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section className="relative py-20">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-medium tracking-widest uppercase">What we do</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">Built for the public sector & beyond</h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => {
              const Icon = Icons[s.icon] || Icons.Sparkles
              return (
                <Reveal key={s.id} delay={(i % 3) * 0.08}>
                  <div className="glass rounded-3xl p-7 h-full group hover:border-accent/40 transition-colors" data-cursor>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 text-accent group-hover:scale-110 transition-transform">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partner logo band */}
      <section className="relative py-10 border-y border-border/50 overflow-hidden">
        <div className="container">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Trusted by departments & institutions</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partners.map((p) => (
              <span key={p} className="font-display text-sm sm:text-base text-muted-foreground/70">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20">
        <div className="container">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-medium tracking-widest uppercase">Voices</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold mt-2">What our clients say</h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.1}>
                <div className="glass rounded-3xl p-7 h-full relative">
                  <Quote className="text-accent mb-4" size={26} />
                  <p className="text-sm text-foreground/90 leading-relaxed">{t.quote}</p>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="font-display font-semibold text-sm">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] glass-strong p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,rgba(56,189,248,0.25),transparent_70%)]" />
            <div className="absolute inset-0 grid-fade opacity-50" />
            <div className="relative">
              <Reveal>
                <h2 className="font-display text-4xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">Have a project for your department or business?</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Let's build a platform that serves real people. Tell us what you need and we'll take it from there.</p>
              </Reveal>
              <div className="mt-9 flex justify-center">
                <MagneticButton as="a" href="/contact">Discuss your project <ArrowRight size={18} /></MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
