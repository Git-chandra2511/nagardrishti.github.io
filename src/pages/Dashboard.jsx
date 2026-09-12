import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Clock3, MapPinned, Plus, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react'
import StatCard from '../components/StatCard'
import IssueCard from '../components/IssueCard'
import MapView from '../components/MapView'
import VexHero from '../components/VexHero'
import CityModel from '../components/CityModel'

const WEEKLY_ACTIVITY = [
  { label: 'S', value: 1 },
  { label: 'M', value: 1 },
  { label: 'T', value: 1 },
  { label: 'W', value: 1 },
  { label: 'T', value: 7 },
  { label: 'F', value: 1 },
  { label: 'S', value: 2 },
]

const DEPARTMENT_WORKLOAD = [
  { name: 'PWD', value: 100, tone: 'amber' },
  { name: 'Municipal Corporation', value: 65, tone: 'green' },
  { name: 'Electricity Board', value: 28, tone: 'violet' },
  { name: 'Fire Department', value: 18, tone: 'amber' },
  { name: 'Hospital Department', value: 12, tone: 'cyan' },
  { name: 'Traffic Control Room', value: 8, tone: 'green' },
  { name: 'Drainage Department', value: 40, tone: 'cyan' },
]

export default function Dashboard({ reports }) {
  const verified = reports.filter(r => r.verified).length
  const active = reports.filter(r => ['Pending', 'In Progress'].includes(r.status)).length
  const resolved = reports.filter(r => r.status === 'Resolved').length
  const highPriority = reports.filter(r => r.priority === 'High').length
  const score = reports.length
    ? Math.round((verified / reports.length) * 70 + (resolved / reports.length) * 30)
    : 0
  const citizens = new Set(reports.map(r => r.reporter).filter(Boolean)).size
  const topCategory = reports.reduce((counts, report) => {
    counts[report.category] = (counts[report.category] || 0) + 1
    return counts
  }, {})
  const leadingCategory = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0]

  return (
    <>
      <VexHero />
      <div className="page dashboard-page">
        <section className="hero dashboard-hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> LIVE CIVIC NETWORK <span className="live-pill">● ONLINE</span></div>
            <h1>Make your area <em>visible.</em></h1>
            <p>Nagar Drishti turns citizens into a real-time sensing network. Scan a civic problem, verify with AI, and send it to the right department.</p>
            <div className="hero-actions">
              <Link className="primary-btn" to="/scan"><Camera size={18} /> Report an issue <ArrowRight size={17} /></Link>
              <Link className="secondary-btn" to="/map"><MapPinned size={17} /> Explore map</Link>
            </div>
          </div>
          <div className="dashboard-hero-image">
            <img src="/smartcity-civic-illustration.jpeg" alt="Smart city services connected to citizens" />
          </div>
        </section>

        <section className="civic-score-row">
          <div className="civic-score-card panel"><div className="score-ring"><strong>{score}</strong><span>/100</span></div><div><span className="panel-kicker">AREA PULSE</span><h2>Civic Health Score</h2><p>Calculated from verified and resolved reports.</p></div><div className="score-trend"><TrendingUp size={15} /> LIVE</div></div>
          <div className="mini-insight panel"><div className="insight-icon"><Zap size={17} /></div><div><span className="panel-kicker">AI INSIGHT</span><strong>{leadingCategory ? `Most reports are ${leadingCategory[0].toLowerCase()}.` : 'Your live report insights will appear here.'}</strong><p>{leadingCategory ? `${leadingCategory[1]} report${leadingCategory[1] === 1 ? '' : 's'} currently recorded.` : 'Submit a civic issue to start building area intelligence.'}</p></div></div>
        </section>

        <section className="stats-grid">
          <StatCard icon="AlertTriangle" label="Live issues" value={active} detail="From submitted reports" />
          <StatCard icon="CheckCircle2" label="Resolved issues" value={resolved} detail="From submitted reports" tone="green" />
          <StatCard icon="Users" label="Active citizens" value={citizens} detail="Reporting this week" tone="cyan" />
          <StatCard icon="ShieldCheck" label="Priority issues" value={highPriority} detail="Need faster action" tone="violet" />
        </section>

        <section className="dashboard-grid">
          <div className="panel map-panel"><div className="panel-head"><div><span className="panel-kicker">LIVE INTELLIGENCE</span><h2>Civic activity map</h2></div><Link to="/map">Open full map <ArrowRight size={15} /></Link></div><div className="dashboard-map"><MapView reports={reports} /></div></div>
          <div className="panel recent-panel"><div className="panel-head"><div><span className="panel-kicker">LATEST SIGNALS</span><h2>Recent issues</h2></div><Link to="/issues">View all issues <ArrowRight size={15} /></Link></div><div className="issue-list">{reports.slice(0, 4).map(r => <IssueCard key={r.id} report={r} compact />)}</div><Link className="quick-report" to="/scan"><Plus size={17} /> Report a new civic issue</Link></div>
        </section>

        <CityModel />

        <section className="analytics-grid">
          <div className="panel activity-panel"><div className="panel-head"><div><span className="panel-kicker">LIVE NETWORK ACTIVITY</span><h2>Reports this week</h2></div><span className="live-number">14 total</span></div><div className="bar-chart" aria-label="Reports activity chart">{WEEKLY_ACTIVITY.map(({ value, label }, index) => <div className="bar-wrap" key={`${label}-${index}`}><div className="bar" style={{ height: `${Math.max(12, value / 7 * 100)}%` }} /><span>{label}</span></div>)}</div></div>
          <div className="panel department-panel"><div className="panel-head"><div><span className="panel-kicker">SMART ROUTING</span><h2>Department workload</h2></div></div>{DEPARTMENT_WORKLOAD.map(department => <DepartmentRow key={department.name} {...department} />)}</div>
        </section>

        <section className="how-strip"><div><Clock3 size={18} /><span><strong>30 sec</strong> average report</span></div><div><ShieldCheck size={18} /><span><strong>AI verified</strong> before submission</span></div><div><MapPinned size={18} /><span><strong>GPS tagged</strong> for action</span></div></section>
      </div>
    </>
  )
}

function DepartmentRow({ name, value, tone }) {
  return <div className="department-row"><div><span>{name}</span><b>{value}%</b></div><div className={`load-track ${tone}`}><i style={{ width: `${value}%` }} /></div></div>
}
