'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { catColor } from '@/lib/api'

export default function CarouselRing({ projects = [] }) {
  const [angle, setAngle] = useState(0)
  const dragging = useRef(false)
  const last = useRef(0)
  const count = projects.length || 1
  const step = 360 / count
  const radius = Math.round((260 / Math.tan(Math.PI / Math.max(count, 3))) )

  useEffect(() => {
    let raf
    const auto = () => { if (!dragging.current) setAngle((a) => a + 0.08); raf = requestAnimationFrame(auto) }
    raf = requestAnimationFrame(auto)
    return () => cancelAnimationFrame(raf)
  }, [])

  const onDown = (e) => { dragging.current = true; last.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0 }
  const onMove = (e) => {
    if (!dragging.current) return
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    setAngle((a) => a + (x - last.current) * 0.3)
    last.current = x
  }
  const onUp = () => { dragging.current = false }
  const onWheel = (e) => { setAngle((a) => a + e.deltaY * 0.12) }

  return (
    <div
      className="relative h-[560px] w-full select-none"
      style={{ perspective: '1400px' }}
      onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
      onWheel={onWheel}
      data-cursor
    >
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[300px]" style={{ transformStyle: 'preserve-3d', transform: `translate(-50%, -50%) rotateY(${angle}deg)` }}>
        {projects.map((p, i) => {
          const color = catColor(p.category)
          return (
            <div key={p.id || i} className="absolute inset-0" style={{ transform: `rotateY(${i * step}deg) translateZ(${radius}px)` }}>
              <div className="h-full w-full rounded-3xl glass-strong p-6 flex flex-col" style={{ boxShadow: `0 0 40px -12px ${color}` , borderColor: `${color}55`}}>
                <div className="aspect-video rounded-2xl mb-4 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}33, rgba(5,7,15,0.7))` }}>
                  <span className="font-display text-4xl font-bold" style={{ color }}>{p.name?.charAt(0)}</span>
                </div>
                <span className="self-start rounded-full px-3 py-1 text-xs" style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>{p.category}</span>
                <h3 className="font-display text-lg font-semibold mt-3">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.tagline}</p>
                <Link href={`/work/${p.slug}`} className="mt-auto text-sm font-medium" style={{ color }}>View Details →</Link>
              </div>
            </div>
          )
        })}
      </div>
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">Drag or scroll to spin the ring</p>
    </div>
  )
}
