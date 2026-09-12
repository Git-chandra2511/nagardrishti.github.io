import { useMemo, useState } from 'react'
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Filter, ShieldCheck } from 'lucide-react'
import { DEPARTMENT_OPTIONS } from '../utils/civic'

const statusOptions = [
  ['reported', 'Pending'],
  ['assigned', 'Assigned'],
  ['in_progress', 'In progress'],
  ['resolved', 'Resolved'],
  ['reopened', 'Reopened'],
]

export default function AdminPage({ reports, onUpdateReport }) {
  const [status, setStatus] = useState('All')
  const filteredReports = useMemo(() => {
    if (status === 'All') return reports
    return reports.filter(report => displayStatus(report).toLowerCase() === status.toLowerCase())
  }, [reports, status])

  const resolved = reports.filter(report => (report.workflowStatus || report.status || '').toLowerCase() === 'resolved').length
  const highPriority = reports.filter(report => (report.ai?.priority || report.priority || '').toLowerCase() === 'high').length
  const pending = reports.filter(report => ['reported', 'assigned', 'reopened'].includes(workflowStatus(report))).length
  const departments = [...new Set([
    ...DEPARTMENT_OPTIONS,
    ...reports.map(report => report.department || report.ai?.department || 'Unassigned'),
  ])]
  const priorityCounts = ['High', 'Medium', 'Low'].map(priority => ({
    label: priority,
    count: reports.filter(report => (report.ai?.priority || report.priority || 'Low').toLowerCase() === priority.toLowerCase()).length,
  }))
  const categoryCounts = [...new Set(reports.map(report => report.category || 'Other'))]
    .map(category => ({ label: category, count: reports.filter(report => (report.category || 'Other') === category).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
  const activeCount = reports.filter(report => ['pending', 'in progress', 'reported'].includes((report.workflowStatus || report.status || '').toLowerCase())).length
  const resolutionRate = reports.length ? Math.round((resolved / reports.length) * 100) : 0

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

      <div className="admin-insights">
        <section className="panel admin-insight-panel admin-pulse-panel">
          <div className="panel-head"><div><span className="panel-kicker">OPERATIONS PULSE</span><h2>Response readiness</h2></div><span className="admin-pulse-dot"><i /> Active</span></div>
          <div className="admin-pulse-main"><strong>{activeCount}</strong><span>open signals being tracked</span></div>
          <div className="admin-pulse-track"><i style={{ width: `${reports.length ? Math.max(8, Math.round((activeCount / reports.length) * 100)) : 0}%` }} /></div>
          <div className="admin-pulse-meta"><span><b>{resolutionRate}%</b> resolution rate</span><span><b>{departments.length}</b> departments routed</span></div>
        </section>

        <section className="panel admin-insight-panel">
          <div className="panel-head"><div><span className="panel-kicker">PRIORITY MIX</span><h2>Attention required</h2></div></div>
          <div className="admin-priority-chart">
            {priorityCounts.map(item => {
              const width = reports.length ? Math.max(item.count ? 7 : 0, Math.round((item.count / reports.length) * 100)) : 0
              return <div className="admin-priority-row" key={item.label}><div><span>{item.label}</span><strong>{item.count}</strong></div><div className={`admin-priority-track ${item.label.toLowerCase()}`}><i style={{ width: `${width}%` }} /></div></div>
            })}
          </div>
        </section>

        <section className="panel admin-insight-panel">
          <div className="panel-head"><div><span className="panel-kicker">ISSUE SIGNALS</span><h2>Most reported</h2></div></div>
          <div className="admin-category-list">
            {categoryCounts.map((item, index) => <div className="admin-category-row" key={item.label}><span className="admin-category-rank">0{index + 1}</span><span>{item.label}</span><strong>{item.count}</strong></div>)}
            {!categoryCounts.length && <div className="admin-empty">Issue signals will appear after reports arrive.</div>}
          </div>
        </section>
      </div>

      <div className="admin-grid">
        <section className="panel admin-table-panel">
          <div className="panel-head admin-panel-head">
            <div><span className="panel-kicker">ISSUE QUEUE</span><h2>Latest civic reports</h2></div>
            <label className="admin-filter"><Filter size={14} /><select value={status} onChange={event => setStatus(event.target.value)}><option>All</option><option>Pending</option><option>Assigned</option><option>Resolved</option><option>In progress</option><option>Reopened</option></select></label>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Issue</th><th>Department</th><th>Priority</th><th>Status</th></tr></thead>
              <tbody>
                {filteredReports.slice(0, 10).map(report => {
                  const issueStatus = displayStatus(report)
                  const priority = report.ai?.priority || report.priority || 'Normal'
                  const reportId = report.issueId || report.id
                  return <tr key={reportId}><td><strong>{report.category || 'Civic issue'}</strong><small>{reportId} · {report.address || 'Location tagged'}</small></td><td><select className="admin-control-select" value={report.department || 'Unassigned'} onChange={event => onUpdateReport(reportId, { department: event.target.value })} aria-label={`Assign ${reportId} department`}><option>Unassigned</option>{departments.filter(item => item !== 'Unassigned').map(item => <option key={item}>{item}</option>)}</select></td><td><span className={`admin-priority ${priority.toLowerCase()}`}>{priority}</span></td><td><select className="admin-control-select status-control" value={workflowStatus(report)} onChange={event => onUpdateReport(reportId, { workflowStatus: event.target.value, status: event.target.value === 'resolved' ? 'Resolved' : event.target.value === 'in_progress' ? 'In Progress' : 'Pending' })} aria-label={`Update ${reportId} status`}>{statusOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></td></tr>
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

function workflowStatus(report) {
  const raw = (report.workflowStatus || report.status || 'reported').toLowerCase()
  if (raw === 'pending') return 'reported'
  if (raw === 'in progress') return 'in_progress'
  return raw
}

function displayStatus(report) {
  const current = workflowStatus(report)
  return statusOptions.find(([value]) => value === current)?.[1] || 'Pending'
}

function Metric({ icon: Icon, label, value, tone = '' }) {
  return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={18} /></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small>Live local data</small></div></div>
}
