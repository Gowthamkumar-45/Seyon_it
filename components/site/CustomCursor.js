'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf
    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (dot.current) dot.current.style.transform = `translate(${mx - 3.5}px, ${my - 3.5}px)`
    }
    const over = (e) => {
      const t = e.target.closest('a, button, [data-cursor]')
      if (ring.current) ring.current.classList.toggle('hovering', !!t)
      if (dot.current) dot.current.classList.toggle('hovering', !!t)
    }
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18
      if (ring.current) ring.current.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    raf = requestAnimationFrame(loop)
    document.body.style.cursor = 'none'
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      cancelAnimationFrame(raf)
      document.body.style.cursor = ''
    }
  }, [])
  return (
    <>
      <div ref={dot} className="cursor-dot hidden md:block" />
      <div ref={ring} className="cursor-ring hidden md:block" />
    </>
  )
}
