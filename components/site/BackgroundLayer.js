'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDevice } from '@/lib/useDevice'

const SceneBackground = dynamic(() => import('./SceneBackground'), { ssr: false, loading: () => null })

export default function BackgroundLayer() {
  const device = useDevice()
  const scrollRef = useRef(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!device.ready || device.reduceMotion) return
    const t = setTimeout(() => setShow(true), 120)
    return () => clearTimeout(t)
  }, [device.ready, device.reduceMotion])

  return (
    <>
      {/* base gradient + static fallback (always present, sits at the very back) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_38%,rgba(30,64,175,0.45),transparent_72%)]" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_45%,#05070f,#0a1430,#0d2647,#06121f,#05070f)] opacity-70" />
      </div>
      {/* live 3D scene */}
      {show && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SceneBackground lowPower={device.lowPower} scrollRef={scrollRef} />
        </div>
      )}
      {/* readability veil so text stays crisp over the 3D on every section */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/55 via-background/35 to-background/70" />
      <div className="fixed inset-0 z-[1] pointer-events-none grid-fade opacity-30" />
    </>
  )
}
