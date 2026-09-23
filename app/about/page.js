'use client'
import { motion } from 'framer-motion'
import { Target, Eye, Heart, ShieldCheck, Zap, Users, MapPin } from 'lucide-react'
import SiteShell from '@/components/site/SiteShell'
import { Reveal, WordReveal } from '@/components/site/Reveal'

const values = [
  { icon: ShieldCheck, title: 'Trust & Transparency', text: 'We build systems that officials and citizens can rely on, with clear records and accountability.' },
  { icon: Zap, title: 'Real Impact', text: 'Every platform is built to solve a real problem — no paper registers, no guesswork.' },
  { icon: Heart, title: 'People First', text: 'Accessible, simple interfaces designed for the people who actually use them.' },
]
const timeline = [
  { year: '2019', title: 'Founded in Coimbatore', text: 'Started with a mission to digitise public services in Tamil Nadu.' },
  { year: '2020', title: 'First municipal platform', text: 'Delivered our first system for the Coimbatore City Municipal Corporation.' },
  { year: '2022', title: 'District-scale systems', text: 'Expanded to district administrations with water-body and CSR platforms.' },
  { year: '2024', title: 'Mobile-first field apps', text: 'Launched field apps for plantation and timber industries.' },
]
const team = [
  { name: 'Leadership', role: 'Strategy & delivery' },
  { name: 'Engineering', role: 'Web & mobile builds' },
  { name: 'Design', role: 'UI/UX & accessibility' },
  { name: 'Support', role: 'Training & maintenance' },
]

export default function Page() {
  return (
    <SiteShell>
      <section className="relative pt-36 pb-16">
        <div className="absolute inset-0 grid-fade opacity-40 pointer-events-none" />
        <div className="container relative">
          <p className="text-accent text-sm font-medium tracking-widest uppercase">About us</p>
          <h1 className="font-display text-4xl md:text-7xl font-bold mt-3 max-w-4xl leading-tight"><WordReveal text="Digital platforms with a public purpose" /></h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-lg">Seyon IT Solutions Pvt Ltd is a Coimbatore-based studio building government platforms, municipal systems, e-commerce, and mobile apps that serve real people across Tamil Nadu.</p>
        </div>
      </section>

      <section className="relative py-14">
        <div className="container grid gap-6 md:grid-cols-2">
          <Reveal><div className="glass rounded-3xl p-8 h-full"><Target className="text-accent mb-4" size={26} /><h3 className="font-display text-2xl font-bold">Our Mission</h3><p className="mt-3 text-muted-foreground">To digitise public services and businesses with reliable, transparent, and easy-to-use platforms that make everyday work simpler.</p></div></Reveal>
          <Reveal delay={0.1}><div className="glass rounded-3xl p-8 h-full"><Eye className="text-accent mb-4" size={26} /><h3 className="font-display text-2xl font-bold">Our Vision</h3><p className="mt-3 text-muted-foreground">To be Tamil Nadu's most trusted technology partner for governments, municipalities, and mission-driven businesses.</p></div></Reveal>
        </div>
      </section>

      <section className="relative py-14">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">What we value</h2></Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={i} delay={i * 0.1}><div className="glass rounded-3xl p-7 h-full"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 text-accent mb-4"><v.icon size={22} /></span><h3 className="font-display text-lg font-semibold">{v.title}</h3><p className="mt-2 text-sm text-muted-foreground">{v.text}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold mb-12">Our journey</h2></Reveal>
          <div className="relative border-l border-white/10 ml-3 space-y-10">
            {timeline.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="relative pl-8">
                <span className="absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_16px_rgba(56,189,248,0.9)]" />
                <span className="font-display text-accent text-sm font-semibold">{t.year}</span>
                <h3 className="font-display text-xl font-semibold mt-1">{t.title}</h3>
                <p className="text-muted-foreground text-sm mt-1 max-w-xl">{t.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="container">
          <Reveal><h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Our team</h2></Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <Reveal key={i} delay={i * 0.08}><div className="glass rounded-3xl p-7 text-center"><span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-accent mb-4"><Users size={26} /></span><h3 className="font-display font-semibold">{m.name}</h3><p className="text-xs text-muted-foreground mt-1">{m.role}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-14">
        <div className="container">
          <div className="glass-strong rounded-3xl p-8 md:p-10 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <p className="text-accent text-sm font-medium tracking-widest uppercase">Where we are</p>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-2">Coimbatore, Tamil Nadu</h3>
              <p className="mt-3 text-muted-foreground flex items-center gap-2"><MapPin size={18} className="text-accent" /> Serving departments & businesses across the state.</p>
            </div>
            <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.2),transparent_60%)]">
              <div className="absolute inset-0 grid-fade opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center"><MapPin size={44} className="text-accent animate-pulse" /></div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  )
}
