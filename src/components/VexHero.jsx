import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4'
const HEADING_LINES = ['Make your city', 'visible, together.']
const CHAR_DELAY = 30

function FadeIn({ children, delay, duration = 1000, className = '' }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`vex-fade-in ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  )
}

function AnimatedHeading() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 200)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <h1 className="vex-heading" style={{ letterSpacing: '-0.04em' }}>
      {HEADING_LINES.map((line, lineIndex) => (
        <span className="vex-heading-line" key={line}>
          {[...line].map((character, charIndex) => (
            <span
              className={`vex-heading-character ${visible ? 'is-visible' : ''}`}
              key={`${line}-${charIndex}`}
              style={{
                transitionDelay: `${(lineIndex * line.length * CHAR_DELAY) + (charIndex * CHAR_DELAY)}ms`,
              }}
            >
              {character === ' ' ? '\u00A0' : character}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export default function VexHero() {
  return (
    <section className="vex-hero">
      <video
        className="vex-video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <nav className="vex-nav">
        <Link className="vex-logo" to="/">NAGAR DRISHTI</Link>
        <div className="vex-links">
          <a href="#vex-story">How it works</a>
          <a href="#vex-investing">Report an issue</a>
          <a href="#vex-building">Explore the map</a>
          <a href="#vex-advisory">Community</a>
        </div>
        <Link className="vex-chat" to="/scan">Report an Issue</Link>
      </nav>

      <div className="vex-content">
        <div className="vex-main">
          <AnimatedHeading />
          <FadeIn delay={800} className="vex-subheading">
            Spot a civic issue, report it in seconds, and help your community build a cleaner, safer city.
          </FadeIn>
          <FadeIn delay={1200} className="vex-actions">
            <Link className="vex-chat vex-action" to="/scan">Report an Issue</Link>
            <Link className="vex-explore" to="/map">Explore the Map</Link>
          </FadeIn>
        </div>
        <FadeIn delay={1400} className="vex-tag">
          Report. Verify. Resolve.
        </FadeIn>
      </div>
    </section>
  )
}
