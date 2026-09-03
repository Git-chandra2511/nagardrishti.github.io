import { Crown, Medal, Sparkles, Trophy } from 'lucide-react'

const people = [
  ['Aarav Mehta', 840, 42],
  ['Priya Singh', 760, 38],
  ['Rohan Kumar', 690, 34],
  ['Neha Sharma', 610, 31],
  ['You', 120, 3],
]

export default function LeaderboardPage({ user }) {
  const list = people.map(p => p[0] === 'You' ? [user.name || 'You', user.points, user.reports || 3] : p)
  return (
    <div className="page">
      <div className="leader-hero">
        <div><div className="eyebrow"><Trophy size={14} /> CIVIC IMPACT</div><h1>Points become progress.</h1><p>Every verified report earns Nagar Points. Climb the leaderboard by helping your city see what matters.</p></div>
        <div className="trophy-orb"><Crown size={43} /></div>
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
