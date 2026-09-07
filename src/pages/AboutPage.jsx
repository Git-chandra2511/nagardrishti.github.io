import { ArrowRight, Eye, MapPinned, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  return <div className="page narrow-page"><div className="section-heading"><div className="eyebrow"><Eye size={14} /> ABOUT NAGAR DRISHTI</div><h1>Report. Understand. Act.</h1><p>Nagar Drishti is an AI-ready civic intelligence platform that connects citizen observations with municipal workflows.</p></div><div className="about-grid"><AboutCard icon={MapPinned} title="Capture context" text="Photo, location, category, priority, and description travel together as one issue record." /><AboutCard icon={ShieldCheck} title="Keep citizens in control" text="AI suggestions are visible and must be verified before a report is submitted." /><AboutCard icon={ArrowRight} title="Route to action" text="Department assignment, SLA tracking, duplicate detection, and resolution updates are designed into the issue lifecycle." /></div><div className="panel disclaimer"><strong>Integration note</strong><p>Nagar Drishti is architected for integration with the Swachhata grievance ecosystem. Production integration requires applicable ULB onboarding, authorization, credentials, and the current technical API specification.</p><Link className="secondary-btn" to="/analytics">View platform analytics</Link></div></div>
}

function AboutCard({ icon: Icon, title, text }) {
  return <article className="panel about-card"><div className="stat-icon"><Icon size={20} /></div><h2>{title}</h2><p>{text}</p></article>
}
