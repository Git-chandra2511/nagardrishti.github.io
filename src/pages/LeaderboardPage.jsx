import { Award, Crown, Medal, Sparkles, Trophy, TrendingUp } from 'lucide-react'

const people = [
  ['Aarav Mehta', 840, 42],
  ['Priya Singh', 760, 38],
  ['Rohan Kumar', 690, 34],
  ['Neha Sharma', 610, 31],
  ['You', 120, 3],
]

export default function LeaderboardPage({ user }) {
  const list = people.map(p => p[0] === 'You' ? [user.name || 'You', user.points, user.reports || 3] : p)
  const currentName = user.name || 'You'
  const currentPoints = user.points || 0
  const rank = Math.max(1, list.findIndex(person => person[0] === currentName) + 1)
  const nextTarget = rank === 1 ? 1000 : list[Math.max(0, rank - 2)]?.[1] || 250
  const previousTarget = list[rank]?.[1] || 0
  const progress = Math.min(100, Math.max(8, Math.round(((currentPoints - previousTarget) / Math.max(1, nextTarget - previousTarget)) * 100)))
  return (
    <div className="page">
      <div className="leader-hero">
        <div><div className="eyebrow"><Trophy size={14} /> CIVIC IMPACT</div><h1>Points become progress.</h1><p>Every verified report earns Nagar Points. Climb the leaderboard by helping your city see what matters.</p></div>
        <div className="leader-visual" aria-label="Animated civic impact visual">
          <div className="leader-visual-grid" />
          <div className="leader-visual-chart"><i /><i /><i /><i /><i /></div>
          <div className="leader-visual-card card-points"><Sparkles size={12} /><span><b>+10</b> points</span></div>
          <div className="leader-visual-card card-reports"><TrendingUp size={12} /><span><b>+24%</b> impact</span></div>
          <div className="trophy-orb" aria-hidden="true"><span className="trophy-orb-ring ring-one" /><span className="trophy-orb-ring ring-two" /><span className="trophy-orb-spark spark-one" /><span className="trophy-orb-spark spark-two" /><Crown size={43} /></div>
        </div>
      </div>
      <section className="leader-profile panel">
        <div className="leader-profile-identity"><div className="leader-profile-avatar">{currentName.slice(0, 1).toUpperCase()}</div><div><span className="panel-kicker">YOUR CIVIC STANDING</span><h2>{currentName}</h2><p>Keep reporting verified issues to move up the city impact board.</p></div></div>
        <div className="leader-profile-rank"><span>Current rank</span><strong>#{rank}</strong><small>of {list.length} citizens</small></div>
        <div className="leader-profile-progress"><div><span>Progress to next rank</span><strong>{currentPoints} / {nextTarget} pts</strong></div><div className="leader-progress-track"><i style={{ width: `${progress}%` }} /><b /></div><small>{Math.max(0, nextTarget - currentPoints)} points to go</small></div>
      </section>
      <div className="leader-achievements">
        <div className="leader-achievement"><Award size={18} /><span><strong>{user.reports || 0}</strong> verified reports</span></div>
        <div className="leader-achievement"><TrendingUp size={18} /><span><strong>{progress}%</strong> rank progress</span></div>
        <div className="leader-achievement"><Sparkles size={18} /><span><strong>{currentPoints}</strong> Nagar Points</span></div>
      </div>
      <div className="leader-grid">
        <div className="panel podium">
          <div className="podium-item second"><Medal size={24} /><strong>{list[1][0]}</strong><span>{list[1][1]} pts</span></div>
          <div className="podium-item first"><Crown size={27} /><strong>{list[0][0]}</strong><span>{list[0][1]} pts</span></div>
          <div className="podium-item third"><Medal size={22} /><strong>{list[2][0]}</strong><span>{list[2][1]} pts</span></div>
        </div>
        <div className="panel leaderboard-list">
          <div className="panel-head"><div><span className="panel-kicker">TOP CITIZENS</span><h2>Leaderboard</h2></div><Sparkles size={19} /></div>
          {list.map((person, index) => (
            <div className={`rank-row ${person[0] === (user.name || 'You') ? 'me' : ''}`} key={person[0]}>
              <b>#{index + 1}</b><div className="rank-avatar">{person[0].slice(0,1)}</div><span><strong>{person[0]}</strong><small>{person[2]} verified reports</small></span><em>{person[1]} pts</em>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
