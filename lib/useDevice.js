'use client'
import { useState, useEffect } from 'react'

export function useDevice() {
  const [state, setState] = useState({ ready: false, lowPower: false, reduceMotion: false, isMobile: false })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const cores = navigator.hardwareConcurrency || 8
    const mem = navigator.deviceMemory || 8
    const lowPower = isMobile || cores <= 4 || mem <= 4
    const update = () => setState({
      ready: true,
      reduceMotion: mq.matches,
      isMobile: window.matchMedia('(max-width: 768px)').matches,
      lowPower: window.matchMedia('(max-width: 768px)').matches || cores <= 4 || mem <= 4,
    })
    update()
    mq.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => { mq.removeEventListener('change', update); window.removeEventListener('resize', update) }
  }, [])
  return state
}
