import { ArrowRight, CheckCircle2, Droplets, Leaf, MapPinned, Recycle, ShieldCheck, Sparkles, Trash2, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const wards = [
  { name: 'Ward 12 - Civil Lines', score: 92, reports: 18, status: 'Champion' },
  { name: 'Ward 07 - Green Park', score: 86, reports: 24, status: 'Improving' },
  { name: 'Ward 19 - Station Road', score: 74, reports: 31, status: 'Needs focus' },
  { name: 'Ward 03 - Old Market', score: 68, reports: 37, status: 'Needs focus' },
]

export default function SwachhBharatPage({ reports }) {
  const garbageReports = reports.filter(report => report.category === 'Garbage')
  const resolved = garbageReports.filter(report => report.status === 'Resolved').length
  const cleanlinessScore = garbageReports.length
    ? Math.round(((resolved + Math.max(0, garbageReports.length - resolved) * 0.65) / garbageReports.length) * 100)
    : 87

  return (
    <div className="page swachh-page">
      <section className="swachh-hero">
        <div className="swachh-hero-copy">
          <span className="swachh-kicker"><Leaf size={15} /> SWACHH BHARAT ABHIYAN • CIVIC PARTNERSHIP</span>
          <h1>Cleaner streets start with <em>visible action.</em></h1>
          <p>Nagar Drishti helps citizens and local governments work together to spot waste, track sanitation response, and celebrate cleaner wards.</p>
          <div className="swachh-actions">
            <Link className="primary-btn swachh-primary" to="/scan"><Trash2 size={17} /> Report a cleanliness issue <ArrowRight size={16} /></Link>
            <Link className="secondary-btn swachh-secondary" to="/map"><MapPinned size={16} /> View cleanliness map</Link>
          </div>
        </div>
        <div className="swachh-emblem" aria-label="Swachh Bharat mission">
          <div className="swachh-emblem-ring"><Leaf size={42} /></div>
          <strong>स्वच्छ भारत</strong>
          <span>Swachh Bharat Mission</span>
        </div>
      </section>

      <section className="swachh-stat-grid">
        <MissionStat icon={<Sparkles size={19} />} label="City cleanliness score" value={`${cleanlinessScore}/100`} detail="Based on verified sanitation signals" />
        <MissionStat icon={<CheckCircle2 size={19} />} label="Issues resolved" value={resolved || 126} detail="Municipal response this month" />
        <MissionStat icon={<Users size={19} />} label="Citizen contributors" value="2,480" detail="People improving their wards" />
        <MissionStat icon={<Recycle size={19} />} label="Waste diverted" value="68%" detail="Reported segregation progress" />
      </section>

      <section className="swachh-content-grid">
        <div className="panel swachh-progress-panel">
          <div className="panel-head"><div><span className="panel-kicker">MISSION PROGRESS</span><h2>Clean city pulse</h2></div><span className="swachh-live"><span /> LIVE</span></div>
          <div className="swachh-progress-main"><div className="swachh-score-ring"><strong>{cleanlinessScore}</strong><span>/100</span></div><div><h3>On track for a cleaner city</h3><p>Sanitation teams are responding faster to citizen-verified reports across priority wards.</p><div className="swachh-bar"><i style={{ width: `${cleanlinessScore}%` }} /></div><small><TrendingUp size={13} /> 12% improvement this month</small></div></div>
          <div className="swachh-focus-row"><FocusItem icon={<Trash2 size={16} />} label="Waste hotspots" value="14 active" /><FocusItem icon={<Droplets size={16} />} label="Public sanitation" value="91% healthy" /><FocusItem icon={<Recycle size={16} />} label="Segregation drives" value="28 ongoing" /></div>
        </div>

        <div className="panel swachh-action-panel">
          <span className="panel-kicker">FOR GOVERNMENT TEAMS</span>
          <h2>Turn citizen signals into cleaner wards.</h2>
          <p>Prioritise sanitation work, publish progress, and build trust with transparent updates.</p>
          <Link className="secondary-btn" to="/analytics"><ShieldCheck size={16} /> Open response analytics <ArrowRight size={15} /></Link>
        </div>
      </section>

      <section className="panel ward-ranking-panel">
        <div className="panel-head"><div><span className="panel-kicker">WARD PERFORMANCE</span><h2>Cleanliness champions</h2></div><span className="ward-caption">Updated today</span></div>
        <div className="ward-list">{wards.map((ward, index) => <div className="ward-row" key={ward.name}><span className="ward-rank">{String(index + 1).padStart(2, '0')}</span><div className="ward-name"><strong>{ward.name}</strong><span>{ward.reports} citizen signals this month</span></div><div className="ward-meter"><i style={{ width: `${ward.score}%` }} /></div><strong className="ward-score">{ward.score}</strong><span className={`ward-status ${ward.status === 'Champion' ? 'champion' : ''}`}>{ward.status}</span></div>)}</div>
      </section>
    </div>
  )
}

function MissionStat({ icon, label, value, detail }) {
  return <div className="panel swachh-stat"><div className="swachh-stat-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function FocusItem({ icon, label, value }) {
  return <div className="swachh-focus-item"><div>{icon}</div><span>{label}</span><strong>{value}</strong></div>
}
