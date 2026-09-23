'use client'
import { useEffect, useState } from 'react'
import * as Icons from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import { Reveal, WordReveal } from '@/components/site/Reveal'
import MagneticButton from '@/components/site/MagneticButton'
import { apiGet } from '@/lib/api'

const process = [
  { step: '01', title: 'Discover', text: 'We understand your department or business, the people, and the problem.' },
  { step: '02', title: 'Design', text: 'We map flows and design accessible, trustworthy interfaces.' },
  { step: '03', title: 'Build', text: 'We develop, integrate, and test the platform end to end.' },
  { step: '04', title: 'Deliver & Support', text: 'We launch, train your team, and provide ongoing support.' },
]
const techs = ['React', 'Next.js', 'Node.js', 'React Native', 'MongoDB', 'PostgreSQL', 'Tailwind', 'Three.js', 'GSAP', 'AWS', 'Docker', 'REST APIs']

export default function Page() {
  const [services, setServices] = useState([])
  useEffect(() => { apiGet('/services').then(setServices).catch(() => {}) }, [])
  return (
    <SiteShell>
      <section className="relative pt-36 pb-14">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(56,189,248,0.2),transparent_70%)]" />
        <div className="container relative">
          <p className="text-accent text-sm font-medium tracking-widest uppercase">Services</p>
          <h1 className="font-display text-4xl md:text-7xl font-bold mt-3 max-w-4xl leading-tight"><WordReveal text="What we build" /></h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg">From large government platforms to field-ready mobile apps — built for the public sector and mission-driven businesses.</p>
        </div>
      </section>

      <section className="relative py-12">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Sparkles
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.08}>
                <div className="glass rounded-3xl p-8 h-full group hover:border-accent/40 transition-colors relative overflow-hidden" data-cursor>
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 blur-2xl group-hover:bg-accent/20 transition-colors" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 text-accent mb-5 group-hover:scale-110 transition-transform"><Icon size={26} /></span>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="relative py-16">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-14">Our process</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative glass rounded-3xl p-7 h-full">
                  <span className="font-display text-5xl font-bold gradient-text">{p.step}</span>
                  <h3 className="font-display text-lg font-semibold mt-3">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
                  {i < process.length - 1 && <ArrowRight className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 text-accent/50" size={22} />}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-10">Tech we love</h2></Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {techs.map((t, i) => (
              <Reveal key={t} delay={i * 0.03}><span className="rounded-full glass px-5 py-2.5 text-sm hover:border-accent/50 hover:text-accent transition-colors" data-cursor>{t}</span></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="container">
          <div className="rounded-[2rem] glass-strong p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_0%,rgba(56,189,248,0.25),transparent_70%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl md:text-5xl font-bold">Ready to build together?</h2>
              <div className="mt-8 flex justify-center"><MagneticButton as="a" href="/contact">Start a project <ArrowRight size={18} /></MagneticButton></div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
