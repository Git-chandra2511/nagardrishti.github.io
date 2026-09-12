import Icon from './Icon'
import { formatTime } from '../utils/civic'

const icons = {
  Pothole: 'Construction',
  Garbage: 'Trash2',
  Streetlight: 'Lightbulb',
  Waterlogging: 'Droplets',
  Hospital: 'Hospital',
  'Traffic Police': 'TrafficCone',
  Narcotics: 'ShieldAlert',
  Fire: 'Flame',
}

export default function IssueCard({ report, compact = false }) {
  return (
    <article className={`issue-card ${compact ? 'compact' : ''}`}>
      <div className={`issue-symbol ${report.category.toLowerCase()}`}>
        <Icon name={icons[report.category] || 'AlertTriangle'} size={19} />
      </div>
      <div className="issue-main">
        <div className="issue-topline">
          <strong>{report.category}</strong>
          <span className={`status-pill ${report.status.toLowerCase().replaceAll(' ', '-')}`}>{report.status}</span>
        </div>
        <div className="issue-address"><Icon name="MapPin" size={13} /> {report.address}</div>
        <div className="issue-meta">
          <span>{report.department}</span>
          <span>•</span>
          <span>{formatTime(report.createdAt)}</span>
          {report.confidence && <><span>•</span><span>{report.confidence}% AI confidence</span></>}
        </div>
      </div>
      {!compact && <div className={`priority ${report.priority.toLowerCase()}`}>{report.priority}</div>}
    </article>
  )
}
