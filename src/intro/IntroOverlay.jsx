import { useEffect, useRef, useState } from 'react'
import { ArrowRight, BrainCircuit, Map, ScanLine, ShieldCheck, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import './intro.css'

export default function IntroOverlay() {
  const navigate = useNavigate()
  const overlayRef = useRef(null)
  const uiRef = useRef(null)
  const [isEntering, setIsEntering] = useState(false)

  useEffect(() => {
    const elements = uiRef.current?.querySelectorAll('[data-intro-ui]')
    if (!elements?.length) return undefined
    gsap.fromTo(elements, { opacity: 0, y: 18 }, {
      opacity: 1,
      y: 0,
      duration: 0.65,
      stagger: 0.14,
      delay: 0.8,
      ease: 'power3.out',
    })
    return undefined
  }, [])

  const enter = () => {
    if (isEntering) return
    setIsEntering(true)
    const overlay = overlayRef.current
    const ui = uiRef.current?.querySelectorAll('[data-intro-ui]')
    if (!overlay || !ui) {
      navigate('/login')
      return
    }
    gsap.timeline({ onComplete: () => navigate('/login') })
      .to(ui, { duration: 0.25, opacity: 0, y: -14, stagger: 0.03, ease: 'power2.in' })
      .to(overlay, { duration: 0.65, opacity: 0, ease: 'power2.inOut' }, '-=0.05')
  }

  return (
    <main ref={overlayRef} className="intro-3d-page">
      <div className="intro-city-visual" aria-hidden="true">
        <img src="/intro-city.png" alt="" />
      </div>
      <div className="intro-3d-noise" aria-hidden="true" />
      <div className="intro-ai-field" aria-hidden="true">
        <div className="intro-ai-orbit intro-ai-orbit-one" />
        <div className="intro-ai-orbit intro-ai-orbit-two" />
        <div className="intro-ai-core"><BrainCircuit size={28} /></div>
        <span className="intro-ai-label intro-ai-label-top">DRISHTI AI / CORE ONLINE</span>
        <span className="intro-ai-label intro-ai-label-right">LIVE CIVIC SIGNALS</span>
        <span className="intro-ai-label intro-ai-label-bottom">ANALYZING YOUR CITY</span>
      </div>
      <nav className="intro-3d-nav" ref={uiRef}>
        <div className="intro-3d-brand" data-intro-ui><span>N</span><strong>NAGAR DRISHTI</strong></div>
        <span className="intro-3d-status" data-intro-ui><i /> DRISHTI AI ONLINE</span>
      </nav>
      <section className="intro-3d-content">
        <div className="intro-3d-copy">
          <span className="intro-3d-kicker" data-intro-ui><ScanLine size={14} /> INTELLIGENCE FOR EVERY STREET</span>
          <h1 data-intro-ui>See the city.<br /><em>Shape its future.</em></h1>
          <p data-intro-ui>A living civic intelligence platform that turns everyday observations into faster, clearer action for every neighborhood.</p>
          <div className="intro-3d-actions" data-intro-ui>
            <button type="button" className="intro-3d-enter" onClick={enter} disabled={isEntering}>
              Enter Nagar Drishti <ArrowRight size={17} />
            </button>
            <span className="intro-3d-note"><ShieldCheck size={14} /> Built for citizens and city teams</span>
          </div>
          <div className="intro-3d-features" data-intro-ui>
            <span><Map size={15} /> GPS-aware reports</span>
            <span><Sparkles size={15} /> AI-assisted verification</span>
          </div>
        </div>
      </section>
    </main>
  )
}
