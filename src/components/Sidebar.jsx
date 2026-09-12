import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import Icon from './Icon'
import Logo from './Logo'
import { NAV_ITEMS } from '../utils/civic'

export default function Sidebar({ open, onClose, user }) {
  return (
    <>
      {open && <button className="drawer-backdrop" onClick={onClose} aria-label="Close menu" />}
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-btn mobile-only" onClick={onClose}><X size={21} /></button>
        </div>
        <div className="nav-section-label">CIVIC CONTROL</div>
        <nav className="nav-list">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={onClose}>
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="nav-section-label nav-section-secondary">OPERATIONS</div>
        <nav className="nav-list">
          <NavLink to="/swachh-bharat" onClick={onClose}><Icon name="Leaf" size={19} /><span>Swachh Bharat mission</span></NavLink>
          <NavLink to="/cross-reporting" onClick={onClose}><Icon name="MessageCircle" size={19} /><span>WhatsApp / SMS reporting</span></NavLink>
          <NavLink to="/misconduct-report" onClick={onClose}><Icon name="FileWarning" size={19} /><span>Report official misconduct</span></NavLink>
          <NavLink to="/issues" onClick={onClose}><Icon name="ClipboardList" size={19} /><span>All issues</span></NavLink>
          <NavLink to="/my-reports" onClick={onClose}><Icon name="FileCheck2" size={19} /><span>My reports</span></NavLink>
          <NavLink to="/analytics" onClick={onClose}><Icon name="BarChart3" size={19} /><span>Analytics</span></NavLink>
          <NavLink to="/about" onClick={onClose}><Icon name="Info" size={19} /><span>About platform</span></NavLink>
          {user?.role === 'admin' && <NavLink to="/admin" onClick={onClose}><Icon name="ShieldCheck" size={19} /><span>Admin control</span></NavLink>}
        </nav>
        <div className="sidebar-bottom">
          <div className="mission-card">
            <div className="mission-icon"><Icon name="ShieldCheck" size={19} /></div>
            <div>
              <strong>Area mission</strong>
              <span>Report. Verify. Improve.</span>
            </div>
          </div>
          <div className="version">NAGAR DRISHTI • v1.0</div>
        </div>
      </aside>
    </>
  )
}
