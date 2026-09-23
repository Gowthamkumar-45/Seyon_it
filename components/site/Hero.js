'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { WordReveal } from './Reveal'
import MagneticButton from './MagneticButton'

const trust = ['Coimbatore City Municipal Corporation', 'Ramanathapuram District', 'District CSR Cell']

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen w-full flex items-center overflow-hidden pt-24 pb-16">
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container relative z-10">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary" /> Coimbatore, Tamil Nadu &middot; Digital platform studio
          </motion.div>
          <h1 className="font-display font-extrabold leading-[1.06] text-4xl sm:text-6xl md:text-7xl mt-6">
            <WordReveal text="Building Digital Platforms" className="block text-foreground" delay={0.15} />
            <WordReveal text="for Tamil Nadu" className="block gradient-text" delay={0.6} />
          </h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }} className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Seyon IT Solutions builds government platforms, municipal systems, and mobile apps that serve real people &mdash; trusted, transparent, and built to last.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.7 }} className="mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <MagneticButton as="a" href="/work">Explore our work <ArrowRight size={17} /></MagneticButton>
            <MagneticButton as="a" href="/contact" variant="secondary">Start a project</MagneticButton>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }} className="mt-14 border-t border-border pt-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3"><ShieldCheck size={14} className="text-primary" /> Trusted by</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {trust.map((t) => <span key={t} className="font-display text-sm font-semibold text-foreground/70">{t}</span>)}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
