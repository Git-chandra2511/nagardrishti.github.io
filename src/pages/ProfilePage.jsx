import { useState } from 'react'
import { Award, CheckCircle2, MapPin, Settings, ShieldCheck, Target, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage({ user }) {
  const navigate = useNavigate()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState(null)

  const achievements = [
    { title: 'First Responder', detail: 'Submitted your first civic report', icon: Award, complete: true },
    { title: 'City Mapper', detail: '3 reports with precise GPS', icon: MapPin, complete: true },
    { title: 'Impact 100', detail: 'Reach 100 verified reports', icon: Target, complete: false },
  ]

  return (
    <div className="page narrow-page">
      <section className="profile-card">
        <div className="profile-avatar">{(user.name || 'C').slice(0,1).toUpperCase()}</div>
        <div><div className="eyebrow">CITIZEN PROFILE</div><h1>{user.name}</h1><p>{user.email}</p></div>
        <button className="icon-btn profile-settings-btn" type="button" onClick={() => setSettingsOpen(value => !value)} aria-label="Toggle profile settings">
          {settingsOpen ? <X size={19} /> : <Settings size={19} />}
        </button>
        {settingsOpen && <div className="profile-settings-popover"><strong>Profile settings</strong><span>Your profile is connected to your civic account.</span><button type="button" onClick={() => navigate('/my-reports')}>View my reports</button></div>}
      </section>
      <div className="profile-stats">
        <button type="button" onClick={() => navigate('/leaderboard')}><strong>{user.points}</strong><span>Nagar Points</span></button>
        <button type="button" onClick={() => navigate('/my-reports')}><strong>{user.reports || 3}</strong><span>Reports</span></button>
        <button type="button" onClick={() => setSelectedAchievement('Trust score is based on verified community reports.')}><strong>92%</strong><span>Verification</span></button>
      </div>
      <div className="profile-grid">
        <div className="panel achievements">
          <div className="panel-kicker">CIVIC ACHIEVEMENTS</div>
          {achievements.map(({ title, detail, icon: Icon, complete }) => <button className={`achievement${complete ? '' : ' locked'}`} type="button" key={title} onClick={() => setSelectedAchievement(`${title}: ${detail}.`)}><div><Icon size={19} /></div><span><strong>{title}</strong><small>{detail}</small></span>{complete && <CheckCircle2 size={17} />}</button>)}
        </div>
        <button className="panel trust-panel" type="button" onClick={() => setSelectedAchievement('Your trust score increases when the community verifies your reports.')}><ShieldCheck size={27} /><div className="panel-kicker">TRUST SCORE</div><strong>Excellent</strong><p>Your reports are consistently verified by the community.</p><div className="trust-bar"><i style={{ width: '92%' }} /></div><span>92 / 100</span></button>
      </div>
      {selectedAchievement && <div className="profile-feedback" role="status">{selectedAchievement}<button type="button" onClick={() => setSelectedAchievement(null)} aria-label="Close message"><X size={14} /></button></div>}
    </div>
  )
}
