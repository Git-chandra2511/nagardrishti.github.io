import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const items = [
  ['/', 'Home', 'Home'],
  ['/scan', 'Scan', 'ScanLine'],
  ['/map', 'Map', 'Map'],
  ['/leaderboard', 'Ranks', 'Trophy'],
  ['/profile', 'Profile', 'UserRound'],
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(([path, label, icon]) => (
        <NavLink key={path} to={path} end={path === '/'}>
          <Icon name={icon} size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
