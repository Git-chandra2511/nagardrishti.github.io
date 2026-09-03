import { Award, CheckCircle2, MapPin, Settings, ShieldCheck, Target } from 'lucide-react'

export default function ProfilePage({ user }) {
  return (
    <div className="page narrow-page">
      <section className="profile-card">
        <div className="profile-avatar">{(user.name || 'C').slice(0,1).toUpperCase()}</div>
        <div><div className="eyebrow">CITIZEN PROFILE</div><h1>{user.name}</h1><p>{user.email}</p></div>
        <button className="icon-btn"><Settings size={19} /></button>
      </section>
      <div className="profile-stats">
        <div><strong>{user.points}</strong><span>Nagar Points</span></div>
        <div><strong>{user.reports || 3}</strong><span>Reports</span></div>
        <div><strong>92%</strong><span>Verification</span></div>
      </div>
      <div className="profile-grid">
        <div className="panel achievements">
          <div className="panel-kicker">CIVIC ACHIEVEMENTS</div>
          <div className="achievement"><div><Award size={19} /></div><span><strong>First Responder</strong><small>Submitted your first civic report</small></span><CheckCircle2 size={17} /></div>
          <div className="achievement"><div><MapPin size={19} /></div><span><strong>City Mapper</strong><small>3 reports with precise GPS</small></span><CheckCircle2 size={17} /></div>
          <div className="achievement locked"><div><Target size={19} /></div><span><strong>Impact 100</strong><small>Reach 100 verified reports</small></span></div>
        </div>
        <div className="panel trust-panel"><ShieldCheck size={27} /><div className="panel-kicker">TRUST SCORE</div><strong>Excellent</strong><p>Your reports are consistently verified by the community.</p><div className="trust-bar"><i style={{ width: '92%' }} /></div><span>92 / 100</span></div>
      </div>
    </div>
  )
}
