import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Filter, ShieldCheck } from 'lucide-react'

export default function AdminPage({ reports }) {
  const [status, setStatus] = useState('All')
  const filteredReports = useMemo(() => {
    if (status === 'All') return reports
    return reports.filter(report => (report.workflowStatus || report.status || 'Pending').toLowerCase() === status.toLowerCase())
  }, [reports, status])

  const resolved = reports.filter(report => (report.workflowStatus || report.status || '').toLowerCase() === 'resolved').length
  const highPriority = reports.filter(report => (report.ai?.priority || report.priority || '').toLowerCase() === 'high').length
  const pending = reports.filter(report => (report.workflowStatus || report.status || 'pending').toLowerCase() === 'pending').length
  const departments = [...new Set(reports.map(report => report.department || report.ai?.department || 'Unassigned'))]

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <div className="section-heading">
          <div className="eyebrow"><ShieldCheck size={14} /> ADMIN CONTROL CENTER</div>
          <h1>Operations overview</h1>
          <p>Monitor civic reports, prioritize urgent issues, and track department response from one workspace.</p>
        </div>
        <span className="admin-live"><i /> LIVE LOCAL DATA</span>
      </div>

      <div className="stats-grid admin-stats">
        <Metric icon={BarChart3} label="Total reports" value={reports.length} />
        <Metric icon={Clock3} label="Awaiting action" value={pending} />
        <Metric icon={AlertTriangle} label="High priority" value={highPriority} tone="violet" />
        <Metric icon={CheckCircle2} label="Resolved" value={resolved} tone="green" />
      </div>

      <div className="admin-grid">
        <section className="panel admin-table-panel">
          <div className="panel-head admin-panel-head">
            <div><span className="panel-kicker">ISSUE QUEUE</span><h2>Latest civic reports</h2></div>
            <label className="admin-filter"><Filter size={14} /><select value={status} onChange={event => setStatus(event.target.value)}><option>All</option><option>Pending</option><option>Resolved</option><option>In progress</option></select></label>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Issue</th><th>Department</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {filteredReports.slice(0, 10).map(report => {
                  const issueStatus = report.workflowStatus || report.status || 'Pending'
                  const priority = report.ai?.priority || report.priority || 'Normal'
                  return <tr key={report.issueId || report.id}><td><strong>{report.category || 'Civic issue'}</strong><small>{report.issueId || report.id} · {report.address || 'Location tagged'}</small></td><td>{report.department || report.ai?.department || 'Unassigned'}</td><td><span className={`admin-priority ${priority.toLowerCase()}`}>{priority}</span></td><td><span className={`status-pill ${issueStatus.toLowerCase().replace(' ', '-')}`}>{issueStatus}</span></td></tr>
                })}
              </tbody>
            </table>
            {!filteredReports.length && <div className="admin-empty">No reports match this filter.</div>}
          </div>
        </section>

        <section className="panel admin-departments">
          <div className="panel-head"><div><span className="panel-kicker">SMART ROUTING</span><h2>Department workload</h2></div></div>
          <div className="admin-department-list">
            {departments.map(department => {
              const count = reports.filter(report => (report.department || report.ai?.department || 'Unassigned') === department).length
              const percentage = reports.length ? Math.round((count / reports.length) * 100) : 0
              return <div className="admin-department" key={department}><div><span>{department}</span><strong>{percentage}%</strong></div><div className="admin-progress"><i style={{ width: `${percentage}%` }} /></div></div>
            })}
            {!departments.length && <div className="admin-empty">Department workload will appear after reports arrive.</div>}
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ icon: Icon, label, value, tone = '' }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={18} /></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>Live local data</small></div></div>
}
