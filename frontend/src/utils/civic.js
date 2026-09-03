export const DEPARTMENT_MAP = {
  Pothole: 'PWD',
  Garbage: 'Municipal Corporation',
  Streetlight: 'Electricity Board',
  Waterlogging: 'Drainage Department',
}

export const CATEGORY_META = {
  Pothole: { icon: 'Construction', label: 'Pothole', color: 'amber' },
  Garbage: { icon: 'Trash2', label: 'Garbage', color: 'green' },
  Streetlight: { icon: 'Lightbulb', label: 'Streetlight', color: 'violet' },
  Waterlogging: { icon: 'Droplets', label: 'Waterlogging', color: 'cyan' },
}

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/scan', label: 'Scan Issue', icon: 'ScanLine' },
  { path: '/map', label: 'Civic Map', icon: 'Map' },
  { path: '/feed', label: 'Civic Feed', icon: 'Rss' },
  { path: '/leaderboard', label: 'Leaderboard', icon: 'Trophy' },
  { path: '/profile', label: 'Profile', icon: 'UserRound' },
]

export function formatTime(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function priorityFrom(category, confidence) {
  if (category === 'Waterlogging' || confidence >= 95) return 'High'
  if (confidence >= 88) return 'Medium'
  return 'Low'
}
