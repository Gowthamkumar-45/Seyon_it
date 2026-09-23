'use client'
import { useRef, useEffect, useState } from 'react'
import { useInView } from 'framer-motion'

function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf; const start = performance.now(); const dur = 1600
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  return <span ref={ref}>{n}{suffix}</span>
}

export default function StatsBand({ stats = [] }) {
  return (
    <section className="relative py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="glass rounded-3xl p-7 text-center relative overflow-hidden group">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative font-display text-4xl md:text-5xl font-bold gradient-text">
                <Counter value={s.value} suffix={s.suffix || ''} />
              </div>
              <div className="relative mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
