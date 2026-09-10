import { Check, Clipboard, ExternalLink, MessageCircle, Phone, Send, ShieldCheck, Smartphone, Users } from 'lucide-react'
import { useState } from 'react'

const REPORT_TEMPLATE = 'Nagar Drishti report: [issue type]. Location: [landmark or village]. Please attach a photo if possible.'
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

export default function CrossReportingPage() {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(REPORT_TEMPLATE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  async function shareTemplate() {
    if (navigator.share) {
      await navigator.share({ title: 'Nagar Drishti report', text: REPORT_TEMPLATE })
      setShared(true)
      window.setTimeout(() => setShared(false), 2200)
      return
    }
    copyTemplate()
  }

  const whatsappHref = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(REPORT_TEMPLATE)}`
    : `https://wa.me/?text=${encodeURIComponent(REPORT_TEMPLATE)}`

  return (
    <div className="page cross-reporting-page">
      <section className="cross-reporting-hero">
        <div><span className="eyebrow"><MessageCircle size={15} /> CROSS-REPORTING BRIDGE</span><h1>Report without downloading an app.</h1><p>Citizens can send a photo, location, and short message through WhatsApp or SMS. The official intake bot can then bring the report into Nagar Drishti.</p><div className="cross-hero-actions"><a className="primary-btn cross-whatsapp" href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Open WhatsApp</a><a className="secondary-btn cross-sms" href={`sms:?&body=${encodeURIComponent(REPORT_TEMPLATE)}`}><Send size={16} /> Open SMS</a></div></div><div className="cross-hero-icon"><Smartphone size={55} /><span>One message<br />can improve a street.</span></div>
      </section>

      <div className="cross-source-note"><ShieldCheck size={15} /><span><strong>Bridge status:</strong> front-end ready • official WhatsApp Business/SMS webhook required for automatic map ingestion</span></div>

      <section className="cross-grid">
        <div className="panel cross-template-card"><div className="panel-kicker">STEP 1 • SEND A REPORT</div><h2>Use this simple message</h2><div className="cross-template">{REPORT_TEMPLATE}</div><div className="cross-template-actions"><button className="secondary-btn" onClick={copyTemplate}>{copied ? <Check size={15} /> : <Clipboard size={15} />} {copied ? 'Copied' : 'Copy template'}</button><button className="secondary-btn" onClick={shareTemplate}>{shared ? <Check size={15} /> : <ExternalLink size={15} />} Share template</button></div><p className="cross-hint">Include a landmark, village name, or nearby road. Attach a photo when possible.</p></div>
        <div className="panel cross-flow-card"><div className="panel-kicker">STEP 2 • AUTOMATED INTAKE</div><h2>How the bridge works</h2><FlowStep icon={<MessageCircle size={16} />} title="WhatsApp or SMS arrives" text="The citizen uses a familiar channel." /><FlowStep icon={<ShieldCheck size={16} />} title="Message is checked" text="The intake service validates sender, media, and location." /><FlowStep icon={<Send size={16} />} title="Report enters Nagar Drishti" text="A structured issue is routed to the map and department workflow." /></div>
      </section>

      <section className="cross-audience-strip"><Users size={20} /><div><strong>Designed for real adoption</strong><span>Older citizens, low-connectivity areas, feature-phone users, and residents who do not want another app.</span></div><a className="secondary-btn" href="/about">About the platform</a></section>
    </div>
  )
}

function FlowStep({ icon, title, text }) {
  return <div className="cross-flow-step"><div>{icon}</div><span><strong>{title}</strong><small>{text}</small></span></div>
}
