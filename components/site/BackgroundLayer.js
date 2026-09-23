'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useDevice } from '@/lib/useDevice'

const SceneBackground = dynamic(() => import('./SceneBackground'), { ssr: false, loading: () => null })

export default function BackgroundLayer() {
  const device = useDevice()
  const { resolvedTheme } = useTheme()
  const scrollRef = useRef(0)
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const dark = resolvedTheme === 'dark'

  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; scrollRef.current = max > 0 ? window.scrollY / max : 0 }
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!device.ready || device.reduceMotion) return
    const t = setTimeout(() => setShow(true), 120); return () => clearTimeout(t)
  }, [device.ready, device.reduceMotion])

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_35%,hsl(var(--primary)/0.10),transparent_72%)] dark:bg-[radial-gradient(ellipse_60%_55%_at_50%_38%,rgba(30,64,175,0.4),transparent_72%)]" />
      </div>
      {mounted && show && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SceneBackground key={dark ? 'd' : 'l'} lowPower={device.lowPower} dark={dark} scrollRef={scrollRef} />
        </div>
      )}
      {/* readability veil */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/70 via-background/45 to-background/80 dark:from-background/60 dark:via-background/35 dark:to-background/75" />
    </>
  )
}
