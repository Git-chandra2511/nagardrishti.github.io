import IssueCard from '../components/IssueCard'
import { MessageSquareText, TrendingUp } from 'lucide-react'

export default function FeedPage({ reports }) {
  return (
    <div className="page narrow-page">
      <div className="section-heading"><div className="eyebrow"><MessageSquareText size={14} /> COMMUNITY SIGNALS</div><h1>Civic Feed</h1><p>Real people. Real places. One shared view of what the city needs.</p></div>
      <div className="feed-grid">
        <div className="feed-main">
          {reports.map(report => <IssueCard key={report.id} report={report} />)}
        </div>
        <aside className="panel trend-panel">
          <div className="panel-kicker">TRENDING</div>
          <h2>What citizens are seeing</h2>
          <div className="trend"><span>Potholes</span><b>42%</b><i style={{ '--w': '82%' }} /></div>
          <div className="trend"><span>Garbage</span><b>27%</b><i style={{ '--w': '61%' }} /></div>
          <div className="trend"><span>Streetlights</span><b>18%</b><i style={{ '--w': '44%' }} /></div>
          <div className="trend"><span>Waterlogging</span><b>13%</b><i style={{ '--w': '31%' }} /></div>
          <div className="trend-foot"><TrendingUp size={16} /> Based on verified reports</div>
        </aside>
      </div>
    </div>
  )
}
