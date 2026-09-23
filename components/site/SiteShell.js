'use client'
import SmoothScroll from './SmoothScroll'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import Footer from './Footer'
import AskAI from './AskAI'

export default function SiteShell({ children }) {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <Navbar />
      <main className="relative min-h-screen">{children}</main>
      <Footer />
      <AskAI />
    </>
  )
}
