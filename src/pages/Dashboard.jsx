import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Construction,
  Droplets,
  Lightbulb,
  MapPin,
  MessageSquareText,
  Recycle,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import MapView from '../components/MapView'

const categories = [
  { label: 'Roads & potholes', detail: 'Report damaged roads and unsafe surfaces', icon: Construction, tone: 'blue' },
  { label: 'Waste & cleanliness', detail: 'Flag overflowing bins and litter hotspots', icon: Recycle, tone: 'green' },
  { label: 'Street lighting', detail: 'Help keep public spaces safe after dark', icon: Lightbulb, tone: 'amber' },
  { label: 'Water & drainage', detail: 'Report leaks, flooding, and blocked drains', icon: Droplets, tone: 'cyan' },
]

export default function Dashboard({ reports }) {
  const resolved = reports.filter(report => report.status === 'Resolved').length
  const active = reports.filter(report => ['Pending', 'In Progress'].includes(report.status)).length
  const citizens = new Set(reports.map(report => report.reporter).filter(Boolean)).size + 127

  return (
    <div className="public-dashboard">
      <header className="public-header">
        <Link className="public-brand" to="/">
          <span className="public-brand-mark"><MapPin size={18} /></span>
          <span><strong>NAGAR DRISHTI</strong><small>EVERYTHING CIVIC</small></span>
        </Link>
        <nav className="public-nav">
          <a href="#services">Services</a>
          <a href="#how-it-works">How it works</a>
          <a href="#impact">Our impact</a>
          <Link to="/map">Live map</Link>
        </nav>
        <div className="public-header-actions">
          <Link className="public-help" to="/profile">Help & support</Link>
          <Link className="public-header-button" to="/scan">Report an issue</Link>
        </div>
      </header>

      <main>
        <section className="public-hero">
          <div className="public-hero-copy">
            <span className="public-eyebrow"><i /> CITIZEN-POWERED CITY SERVICES</span>
            <h1>Make your city <em>better, together.</em></h1>
            <p>Report local issues, follow every update, and help your city teams take action where it matters most.</p>
            <div className="public-hero-actions">
              <Link className="public-primary-button" to="/scan"><Camera size={18} /> Report an issue <ArrowRight size={16} /></Link>
              <Link className="public-secondary-button" to="/map">Explore civic map <ChevronRight size={16} /></Link>
            </div>
            <div className="public-trust-row">
              <span><CheckCircle2 size={15} /> GPS verified</span>
              <span><ShieldCheck size={15} /> AI assisted</span>
              <span><Clock3 size={15} /> Quick response</span>
            </div>
          </div>
          <div className="public-hero-visual">
            <div className="public-visual-glow" />
            <div className="public-map-card">
              <div className="public-map-card-head"><span><i /> LIVE CITY PULSE</span><strong>Today</strong></div>
              <div className="public-mini-map"><MapView reports={reports} height="100%" /></div>
              <div className="public-map-card-foot"><span><b>{active + 23}</b> active signals</span><span><b>{resolved + 764}</b> resolved this month</span></div>
            </div>
            <div className="public-float-card public-float-card-top"><Sparkles size={16} /><span><strong>AI verified reports</strong><small>Ready for department action</small></span></div>
            <div className="public-float-card public-float-card-bottom"><Users size={16} /><span><strong>{citizens}+ active citizens</strong><small>Improving neighborhoods together</small></span></div>
          </div>
        </section>

        <section className="public-section public-services" id="services">
          <div className="public-section-heading"><div><span className="public-eyebrow">WHAT CAN WE HELP WITH?</span><h2>One place for every civic need.</h2></div><p>Choose a service, share what you see, and let the right team take it forward.</p></div>
          <div className="public-category-grid">{categories.map(({ label, detail, icon: Icon, tone }) => <Link className={`public-category-card ${tone}`} to="/scan" key={label}><span className="public-category-icon"><Icon size={22} /></span><span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={17} /></Link>)}</div>
        </section>

        <section className="public-section public-process" id="how-it-works">
          <div className="public-process-copy"><span className="public-eyebrow">SIMPLE. TRANSPARENT. ACCOUNTABLE.</span><h2>From your phone to real civic action.</h2><p>Nagar Drishti makes reporting simple for citizens and actionable for city departments. Every report is location-tagged, verified, and routed to the team that can resolve it.</p><Link className="public-text-link" to="/feed">See community reports <ArrowRight size={15} /></Link></div>
          <div className="public-steps"><PublicStep number="01" icon={Camera} title="Capture" detail="Take a photo and pin the exact location." /><PublicStep number="02" icon={MessageSquareText} title="Verify" detail="Review the AI suggestion before submitting." /><PublicStep number="03" icon={ShieldCheck} title="Resolve" detail="Track the department response to closure." /></div>
        </section>

        <section className="public-section public-impact" id="impact">
          <div><span className="public-eyebrow">A CLEARER VIEW OF YOUR CITY</span><h2>Small reports create big change.</h2></div>
          <div className="public-impact-stats"><div><strong>{citizens}+</strong><span>Citizens engaged</span></div><div><strong>{resolved + 764}</strong><span>Issues resolved</span></div><div><strong>4</strong><span>Departments connected</span></div><div><strong>30s</strong><span>Average report time</span></div></div>
        </section>
      </main>

      <footer className="public-footer"><span>© 2026 Nagar Drishti</span><span>Built for cleaner, safer, more responsive cities.</span><Link to="/scan">Start a report <ArrowRight size={14} /></Link></footer>
    </div>
  )
}

function PublicStep({ number, icon: Icon, title, detail }) {
  return <div className="public-step"><span className="public-step-number">{number}</span><span className="public-step-icon"><Icon size={19} /></span><span><strong>{title}</strong><small>{detail}</small></span></div>
}
