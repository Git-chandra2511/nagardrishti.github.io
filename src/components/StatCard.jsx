import Icon from './Icon'

export default function StatCard({ icon, label, value, detail, tone = '' }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-icon"><Icon name={icon} size={20} /></div>
      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  )
}
