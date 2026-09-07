import { Bell, Menu, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const titles = {
  '/': ['Civic Command Center', 'Real-time view of your city'],
  '/scan': ['Scan Civic Issue', 'AI-powered issue detection'],
  '/map': ['Civic Map', 'Live issue intelligence'],
  '/feed': ['Civic Feed', 'See what citizens are reporting'],
  '/leaderboard': ['Nagar Leaderboard', 'Every verified report counts'],
  '/profile': ['Citizen Profile', 'Your civic contribution'],
  '/issues': ['Issue Operations', 'Search and track civic issues'],
  '/my-reports': ['My Reports', 'Track your submitted issues'],
  '/analytics': ['Civic Analytics', 'Operational intelligence from live reports'],
  '/about': ['About Nagar Drishti', 'Report, understand, act'],
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
      <div className="topbar-ticker" aria-label="Live civic updates">
        <span className="topbar-ticker-live"><i /> LIVE</span>
        <div className="topbar-ticker-track">
          <span>YOUR CITY. YOUR VOICE.</span><b>✦</b><span>SPOT IT. REPORT IT.</span><b>✦</b>
          <span>TOGETHER, WE IMPROVE.</span><b>✦</b><span>YOUR CITY. YOUR VOICE.</span><b>✦</b>
          <span>SPOT IT. REPORT IT.</span><b>✦</b><span>TOGETHER, WE IMPROVE.</span><b>✦</b>
        </div>
      </div>
      <div className="top-actions">
        <button className="search-mini"><Search size={17} /><span>Search reports</span></button>
        <button className="icon-btn notification"><Bell size={19} /><i /></button>
        <div className="avatar">{(user?.name || 'C').slice(0,1).toUpperCase()}</div>
      </div>
    </header>
  )
}
