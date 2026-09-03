import Icon from './Icon'

export default function Logo({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark"><Icon name="ScanEye" size={24} /></div>
      {!compact && (
        <div>
          <div className="brand-name">NAGAR DRISHTI</div>
          <div className="brand-sub">THE CITY'S EYE</div>
        </div>
      )}
    </div>
  )
}
