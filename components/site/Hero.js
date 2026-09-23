'use client'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { WordReveal } from './Reveal'
import MagneticButton from './MagneticButton'
import { useDevice } from '@/lib/useDevice'

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false, loading: () => null })

export default function Hero() {
  const ref = useRef(null)
  const device = useDevice()
  const [show3d, setShow3d] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.6])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    if (!device.ready) return
    if (device.reduceMotion) return
    const t = setTimeout(() => setShow3d(true), 150)
    return () => clearTimeout(t)
  }, [device.ready, device.reduceMotion])

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* gradient fallback / base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(30,64,175,0.5),transparent_70%)] bg-background" />
      <motion.div style={{ opacity: sceneOpacity, scale: sceneScale }} className="absolute inset-0">
        {show3d ? <HeroScene lowPower={device.lowPower} /> : (
          <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#05070f,#0b1638,#0e2a4d,#06121f,#05070f)] animate-pulse" />
        )}
      </motion.div>
      <div className="absolute inset-0 grid-fade opacity-60 pointer-events-none" />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs sm:text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Coimbatore, Tamil Nadu · Digital platform studio
        </motion.div>
        <h1 className="font-display font-bold leading-[1.05] text-4xl sm:text-6xl md:text-7xl max-w-5xl">
          <WordReveal text="Building Digital Platforms" className="block gradient-text" delay={0.2} />
          <WordReveal text="for Tamil Nadu" className="block text-foreground text-glow" delay={0.7} />
        </h1>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }} className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Seyon IT Solutions — government platforms, municipal systems, and mobile apps that serve real people.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45, duration: 0.8 }} className="mt-9 flex flex-col sm:flex-row items-center gap-4">
          <MagneticButton as="a" href="/work">View our work <ArrowRight size={18} /></MagneticButton>
          <Link href="/contact" data-cursor className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-foreground hover:bg-white/5 transition-colors">Start a project</Link>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: contentOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ChevronDown size={20} /></motion.div>
      </motion.div>
    </section>
  )
}
