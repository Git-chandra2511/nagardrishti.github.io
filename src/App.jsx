import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BottomNav from './components/BottomNav'
import DrishtiAI from './components/DrishtiAI'

import Dashboard from './pages/Dashboard'
import ScanPage from './pages/ScanPage'
import MapPage from './pages/MapPage'
import FeedPage from './pages/FeedPage'
import LeaderboardPage from './pages/LeaderboardPage'
import ProfilePage from './pages/ProfilePage'
import IssueDetailsPage from './pages/IssueDetailsPage'
import IssuesPage from './pages/IssuesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AboutPage from './pages/AboutPage'
import LoginPage from './pages/LoginPage'

import {
  getReports,
  getUser,
  saveReports,
  saveUser,
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from './services/localStore'
import { findPossibleDuplicates, normalizeIssue } from './services/issueService'
import { fetchRemoteReports, saveRemoteReport } from './services/firestoreStore'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [reports, setReports] = useState(getReports)
  const [user, setUser] = useState(getUser)
  const [session, setSession] = useState(getAuthSession)

  function handleLogin(nextSession) {
    const nextUser = { ...user, name: nextSession.name, email: nextSession.email, role: nextSession.role }
    setSession(nextSession)
    setUser(nextUser)
    saveAuthSession(nextSession)
    saveUser(nextUser)
  }

  function handleLogout() {
    clearAuthSession()
    setSession(null)
    navigate('/login', { replace: true })
  }

  if (!session && location.pathname !== '/login') {
    return <Navigate to="/login" replace />
  }

  if (location.pathname === '/login') {
    return session ? <Navigate to={session.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage onLogin={handleLogin} />
  }

  useEffect(() => {
    let active = true
    fetchRemoteReports()
      .then(remoteReports => {
        if (active && remoteReports?.length) setReports(remoteReports)
      })
      .catch(error => {
        console.warn('Firestore reports unavailable; continuing with local reports.', error)
      })
    return () => {
      active = false
    }
  }, [])

  const reportCount = useMemo(() => {
    return reports.filter((report) => report.reporter === 'You').length
  }, [reports])

  function addReport(report) {
    const nextReport = normalizeIssue({
      ...report,
      id: `ND-${1043 + reports.length}`,
      reporter: 'You',
    }, reports.length)
    const duplicates = findPossibleDuplicates(nextReport, reports)
    if (duplicates.length) {
      nextReport.duplicateClusterId = duplicates[0].duplicateClusterId || duplicates[0].issueId
      nextReport.possibleDuplicate = true
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
    saveRemoteReport(nextReport).catch(error => {
      console.warn('Report saved locally, but Firestore sync failed.', error)
    })
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
          onLogout={handleLogout}
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
          <Route path="/issues" element={<IssuesPage reports={reports} />} />
          <Route path="/my-reports" element={<IssuesPage reports={reports} mineOnly />} />
          <Route path="/issues/:issueId" element={<IssueDetailsPage reports={reports} />} />
          <Route path="/analytics" element={<AnalyticsPage reports={reports} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/officer/*" element={<AnalyticsPage reports={reports} officerMode />} />
          <Route path="/admin/*" element={session.role === 'admin' ? <AnalyticsPage reports={reports} adminMode /> : <Navigate to="/" replace />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <BottomNav />
      <DrishtiAI />
    </div>
  )
}
