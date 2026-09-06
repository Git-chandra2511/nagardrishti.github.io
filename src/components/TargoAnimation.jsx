import { useEffect, useRef, useState } from 'react'
import './TargoAnimation.css'

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4'
const ABOUT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4'

export function TargoVideo({ src, className }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const play = () => {
      video.muted = true
      video.defaultMuted = true
      const promise = video.play()
      if (promise && typeof promise.catch === 'function') promise.catch(() => {})
    }
    play()
    video.addEventListener('loadedmetadata', play)
    video.addEventListener('canplay', play)
    const timer = window.setInterval(play, 1000)
    document.addEventListener('click', play, { once: true, passive: true })
    document.addEventListener('touchstart', play, { once: true, passive: true })
    return () => {
      window.clearInterval(timer)
      video.removeEventListener('loadedmetadata', play)
      video.removeEventListener('canplay', play)
      document.removeEventListener('click', play)
      document.removeEventListener('touchstart', play)
    }
  }, [])

  return <video ref={videoRef} className={className} autoPlay muted loop playsInline preload="auto" aria-hidden="true"><source src={src} type="video/mp4" /></video>
}

export default function TargoAnimation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="targo-animation">
      <section className="targo-animation-hero" id="targo-animation-home">
        <TargoVideo src={HERO_VIDEO} className="targo-animation-hero-video" />
        <div className="targo-animation-scrim" />
        <nav className="targo-animation-nav">
          <a className="targo-animation-brand" href="#targo-animation-home" onClick={closeMenu}><span className="targo-animation-logo" /><span className="targo-animation-brand-name">targo</span></a>
          <div className={`targo-animation-links ${menuOpen ? 'is-open' : ''}`}>
            <a href="#targo-animation-home" onClick={closeMenu}>HOME</a>
            <a href="#targo-animation-about" onClick={closeMenu}>HOW IT WORKS</a>
            <a href="#targo-animation-about" onClick={closeMenu}>GET INVOLVED</a>
          </div>
          <a className="targo-animation-contact" href="#targo-animation-about">
            <svg viewBox="0 0 17 13" aria-hidden="true"><rect x=".7" y=".7" width="15.6" height="11.6" rx=".4" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M1.2 1.4 8.5 7l7.3-5.6" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            REPORT AN ISSUE
          </a>
          <button className="targo-animation-mobile-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}><span /><span /><span /></button>
        </nav>
        <div className="targo-animation-copy">
          <h1><span>MAKING</span><span>YOUR</span><span>CITY</span><span className="indent">VISIBLE</span><span className="indent">FOR</span><span className="indent accent">EVERYONE</span></h1>
          <a className="targo-animation-cta" href="#targo-animation-about">REPORT AN ISSUE <i /></a>
        </div>
      </section>
      <section className="targo-animation-about" id="targo-animation-about">
        <div className="targo-animation-about-copy">
          <h2><span>YOUR</span><span className="indent accent">CITY</span></h2>
          <p>Nagar Drishti connects citizens with the teams working to improve their neighborhoods. Report potholes, garbage, waterlogging, and streetlight issues in seconds, verify the details, and help turn local signals into visible action.</p>
          <a className="targo-animation-cta" href="#targo-animation-home">EXPLORE THE MAP <i /></a>
        </div>
        <div className="targo-animation-about-media">
          <TargoVideo src={ABOUT_VIDEO} className="targo-animation-about-video" />
          <div className="targo-animation-about-tint" />
        </div>
      </section>
    </div>
  )
}
