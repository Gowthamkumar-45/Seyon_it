'use client'
import SmoothScroll from './SmoothScroll'
import CustomCursor from './CustomCursor'
import BackgroundLayer from './BackgroundLayer'
import Navbar from './Navbar'
import Footer from './Footer'
import AskAI from './AskAI'

export default function SiteShell({ children }) {
  return (
    <>
      <SmoothScroll />
      <CustomCursor />
      <BackgroundLayer />
      <Navbar />
      <div className="relative z-10">
        <main className="relative min-h-screen">{children}</main>
        <Footer />
      </div>
      <AskAI />
    </>
  )
}
