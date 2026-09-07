import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BottomNav from './components/BottomNav'

import Dashboard from './pages/Dashboard'
import ScanPage from './pages/ScanPage'
import MapPage from './pages/MapPage'
import FeedPage from './pages/FeedPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'

import {
  getReports,
  getUser,
  saveReports,
  saveUser,
} from './services/localStore'

export default function App() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reports, setReports] = useState(getReports)
  const [user, setUser] = useState(getUser)

  const reportCount = useMemo(() => {
    return reports.filter((report) => report.reporter === 'You').length
  }, [reports])

  function addReport(report) {
    const nextReport = {
      ...report,
      id: `ND-${1043 + reports.length}`,
      reporter: 'You',
    }

    const nextReports = [nextReport, ...reports]

    const nextUser = {
      ...user,
      points: (user.points || 0) + 10,
      reports: (user.reports || 0) + 1,
    }

    setReports(nextReports)
    setUser(nextUser)
    saveReports(nextReports)
    saveUser(nextUser)
  }

  if (location.pathname === '/') {
    return <Routes><Route path="/" element={<Dashboard reports={reports} user={user} />} /></Routes>
  }

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-area">
        <Topbar
          onMenu={() => setSidebarOpen(true)}
          user={user}
        />

        <Routes>
          <Route
            path="/"
            element={<Dashboard reports={reports} user={user} />}
          />

          <Route
            path="/scan"
            element={<ScanPage onSubmit={addReport} />}
          />

          <Route
            path="/map"
            element={<MapPage reports={reports} />}
          />

          <Route
            path="/feed"
            element={<FeedPage reports={reports} />}
          />

          <Route
            path="/leaderboard"
            element={<LeaderboardPage user={user} />}
          />

          <Route
            path="/profile"
            element={
              <ProfilePage
                user={{
                  ...user,
                  
                  reports: reportCount || user.reports,
                }}
              />
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}
