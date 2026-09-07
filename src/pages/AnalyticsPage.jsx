import { BarChart3, CheckCircle2, Clock3, ShieldCheck, Users } from 'lucide-react'

export default function AnalyticsPage({ reports, officerMode = false, adminMode = false }) {
  const resolved = reports.filter(report => (report.workflowStatus || report.status) === 'resolved' || report.status === 'Resolved').length
  const active = reports.length - resolved
  const high = reports.filter(report => (report.ai?.priority || report.priority) === 'High').length
  const title = adminMode ? 'Admin intelligence' : officerMode ? 'Officer workspace' : 'Civic analytics'
  return <div className="page">
    <div className="section-heading"><div className="eyebrow"><BarChart3 size={14} /> {adminMode ? 'ADMIN CONTROL' : officerMode ? 'MUNICIPAL OPERATIONS' : 'CITY INTELLIGENCE'}</div><h1>{title}</h1><p>Operational metrics are calculated from the reports currently stored in this browser.</p></div>
    <div className="stats-grid"><Metric icon={Users} label="Total issues" value={reports.length} /><Metric icon={Clock3} label="Open issues" value={active} /><Metric icon={CheckCircle2} label="Resolved" value={resolved} tone="green" /><Metric icon={ShieldCheck} label="High priority" value={high} tone="violet" /></div>
    <div className="analytics-grid"><section className="panel analytics-summary"><div className="panel-head"><div><span className="panel-kicker">WORKFLOW HEALTH</span><h2>Resolution rate</h2></div><strong className="analytics-rate">{reports.length ? Math.round((resolved / reports.length) * 100) : 0}%</strong></div><div className="confidence-bar"><i style={{ width: `${reports.length ? (resolved / reports.length) * 100 : 0}%` }} /></div><p>Use this view as the foundation for department, ward, SLA, and integration analytics.</p></section><section className="panel analytics-summary"><div className="panel-head"><div><span className="panel-kicker">INTEGRATION READY</span><h2>Swachhata adapter</h2></div><span className="status-pill verified">MOCK MODE</span></div><p>Production synchronization requires ULB onboarding, authorization, credentials, and the current technical API specification.</p></section></div>
  </div>
}

function Metric({ icon: Icon, label, value, tone = '' }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={18} /></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>Live local data</small></div></div>
}
