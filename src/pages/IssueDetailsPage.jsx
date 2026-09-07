import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, MapPin, ShieldCheck } from 'lucide-react'
import { getSlaState } from '../services/issueService'

export default function IssueDetailsPage({ reports }) {
  const { issueId } = useParams()
  const issue = reports.find(report => (report.issueId || report.id) === issueId)
  if (!issue) return <div className="page center-page"><div className="success-card"><h1>Issue not found</h1><p>The issue may have been removed or the link is invalid.</p><Link className="primary-btn" to="/issues">Back to issues</Link></div></div>
  const workflowStatus = issue.workflowStatus || 'reported'
  const status = workflowStatus.replace('_', ' ')
  const sla = getSlaState(issue)
  return (
    <div className="page narrow-page">
      <Link className="back-link" to="/issues"><ArrowLeft size={15} /> Back to issues</Link>
      <div className="issue-detail-grid">
        <section className="panel issue-detail-main">
          <div className="eyebrow"><ShieldCheck size={14} /> ISSUE {issue.issueId || issue.id}</div>
          <h1>{issue.title}</h1>
          <p className="detail-description">{issue.description || `A ${issue.category.toLowerCase()} issue reported at ${issue.location?.address || issue.address}.`}</p>
          <div className="detail-status-row"><span className={`status-pill ${workflowStatus}`}>{status}</span><span className={`sla-badge ${sla}`}>{sla === 'overdue' ? 'SLA overdue' : sla === 'complete' ? 'Workflow complete' : 'Within SLA'}</span></div>
          <div className="detail-timeline"><TimelineItem label="Reported" active /><TimelineItem label="Assigned" active={['assigned', 'in_progress', 'resolved'].includes(workflowStatus)} /><TimelineItem label="In progress" active={['in_progress', 'resolved'].includes(workflowStatus)} /><TimelineItem label="Resolved" active={workflowStatus === 'resolved'} /></div>
        </section>
        <aside className="issue-detail-side">
          <div className="panel detail-facts"><Fact icon={MapPin} label="Location" value={issue.location?.address || issue.address} /><Fact icon={Clock3} label="Department" value={issue.department} /><Fact icon={CheckCircle2} label="AI confidence" value={`${Math.round((issue.ai?.confidence || 0) * 100)}%`} /><Fact icon={ShieldCheck} label="Priority" value={issue.ai?.priority || issue.priority} /></div>
          {issue.possibleDuplicate && <div className="duplicate-callout panel"><strong>Possible duplicate</strong><span>Other citizens may have reported the same nearby issue. Municipal teams can consolidate these signals.</span></div>}
          <Link className="primary-btn detail-action" to="/map">Open on civic map</Link>
        </aside>
      </div>
    </div>
  )
}

function Fact({ icon: Icon, label, value }) {
  return <div className="detail-fact"><Icon size={17} /><span><small>{label}</small><strong>{value}</strong></span></div>
}

function TimelineItem({ label, active }) {
  return <div className={`timeline-item ${active ? 'active' : ''}`}><i /><span>{label}</span></div>
}
