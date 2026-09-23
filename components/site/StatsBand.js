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
    <section className="relative py-6">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl glass overflow-hidden divide-x divide-y md:divide-y-0 divide-border">
          {stats.map((s, i) => (
            <div key={i} className="p-8 text-center">
              <div className="font-display text-4xl md:text-5xl font-extrabold text-primary">
                <Counter value={s.value} suffix={s.suffix || ''} />
              </div>
              <div className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
