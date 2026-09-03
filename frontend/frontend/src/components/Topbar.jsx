import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/': ['Civic Command Center', 'Real-time view of your city'],
  '/scan': ['Scan Civic Issue', 'AI-powered issue detection'],
  '/map': ['Civic Map', 'Live issue intelligence'],
  '/feed': ['Civic Feed', 'See what citizens are reporting'],
  '/leaderboard': ['Nagar Leaderboard', 'Every verified report counts'],
  '/profile': ['Citizen Profile', 'Your civic contribution'],
}

export default function Topbar({ onMenu, user }) {
  const location = useLocation()
  const [title, subtitle] = titles[location.pathname] || titles['/']
  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={onMenu}><Menu size={22} /></button>
      <div className="page-title">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
      <div className="top-actions">
        <button className="search-mini"><Search size={17} /><span>Search reports</span></button>
        <button className="icon-btn notification"><Bell size={19} /><i /></button>
        <div className="avatar">{(user?.name || 'C').slice(0,1).toUpperCase()}</div>
      </div>
    </header>
  )
}
