import { useEffect, useRef } from 'react'
import './TargoAnimation.css'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4'

const ABOUT_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4'

function TargoVideo({ src, className }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.muted = true
      video.defaultMuted = true
      const promise = video.play()
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {})
      }
    }

    play()
    video.addEventListener('loadedmetadata', play)
    video.addEventListener('canplay', play)

    const timer = window.setInterval(play, 1000)

    const unlock = () => play()
    document.addEventListener('click', unlock, { once: true, passive: true })
    document.addEventListener('touchstart', unlock, { once: true, passive: true })

    return () => {
      window.clearInterval(timer)
      video.removeEventListener('loadedmetadata', play)
      video.removeEventListener('canplay', play)
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}

export default function TargoAnimation() {
  return (
    <div className="targo-animation">
      <section className="targo-animation-hero" id="targo-animation-home">
        <TargoVideo
          src={HERO_VIDEO}
          className="targo-animation-hero-video"
        />

        <div className="targo-animation-scrim" />

        <nav className="targo-animation-nav">
          <a className="targo-animation-brand" href="#targo-animation-home">
            <span className="targo-animation-logo" />
            <span className="targo-animation-brand-name">targo</span>
          </a>

          <div className="targo-animation-links">
            <a href="#targo-animation-home">HOME</a>
            <a href="#targo-animation-about">ABOUT</a>
            <a href="#targo-animation-about">CONTACT US</a>
          </div>

          <a className="targo-animation-contact" href="#targo-animation-about">
            <svg viewBox="0 0 17 13" aria-hidden="true">
              <rect
                x="0.7"
                y="0.7"
                width="15.6"
                height="11.6"
                rx="0.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M1.2 1.4L8.5 7L15.8 1.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
            </svg>
            CONTACT US
          </a>

          <a
            className="targo-animation-mobile-button"
            href="#targo-animation-about"
            aria-label="Open Targo navigation"
          >
            <span />
            <span />
            <span />
          </a>
        </nav>

        <div className="targo-animation-copy">
          <h1>
            <span>SCALING</span>
            <span>THE</span>
            <span>PLATFORM</span>
            <span className="indent">FOR</span>
            <span className="indent">YOUR</span>
            <span className="indent accent">BUSINESS</span>
          </h1>

          <a
            className="targo-animation-cta"
            href="#targo-animation-about"
          >
            GET STARTED
            <i />
          </a>
        </div>
      </section>

      <section
        className="targo-animation-about"
        id="targo-animation-about"
      >
        <div className="targo-animation-about-copy">
          <h2>
            <span>ABOUT</span>
            <span className="indent accent">BUSINESS</span>
          </h2>

          <p>
            Targo builds the testing infrastructure modern teams rely on.
            From automated pipelines to full-scale QA audits, we make sure
            your software ships fast and breaks nothing. Hundreds of releases,
            zero surprises.
          </p>

          <a
            className="targo-animation-cta"
            href="#targo-animation-home"
          >
            LEARN MORE
            <i />
          </a>
        </div>

        <div className="targo-animation-about-media">
          <TargoVideo
            src={ABOUT_VIDEO}
            className="targo-animation-about-video"
          />
          <div className="targo-animation-about-tint" />
        </div>
      </section>
    </div>
  )
}
