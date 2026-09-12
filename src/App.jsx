import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import BottomNav from './components/BottomNav'
import DrishtiAI from './components/DrishtiAI'

import LoginPage from './pages/LoginPage'
import IntroPage from './pages/IntroPage'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const ScanPage = lazy(() => import('./pages/ScanPage'))
const MapPage = lazy(() => import('./pages/MapPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const IssueDetailsPage = lazy(() => import('./pages/IssueDetailsPage'))
const IssuesPage = lazy(() => import('./pages/IssuesPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const MisconductReportPage = lazy(() => import('./pages/MisconductReportPage'))
const SwachhBharatPage = lazy(() => import('./pages/SwachhBharatPage'))
const CrossReportingPage = lazy(() => import('./pages/CrossReportingPage'))

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

  useEffect(() => {
    let active = true
    import('./services/firestoreStore')
      .then(({ fetchRemoteReports }) => fetchRemoteReports())
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

  if (!session && location.pathname !== '/login' && location.pathname !== '/intro') {
    return <Navigate to="/intro" replace />
  }

  if (!session && (location.pathname === '/' || location.pathname === '/intro')) {
    return <IntroPage />
  }

  if (location.pathname === '/login') {
    return session ? <Navigate to={session.role === 'admin' ? '/admin' : '/'} replace /> : <LoginPage onLogin={handleLogin} />
  }

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
    import('./services/firestoreStore')
      .then(({ saveRemoteReport }) => saveRemoteReport(nextReport))
      .catch(error => {
        console.warn('Report saved locally, but Firestore sync failed.', error)
      })
  }

  function updateReport(reportId, changes) {
    const nextReports = reports.map(report => {
      const currentId = report.issueId || report.id
      return currentId === reportId ? normalizeIssue({ ...report, ...changes }) : report
    })
    const updatedReport = nextReports.find(report => (report.issueId || report.id) === reportId)
    setReports(nextReports)
    saveReports(nextReports)
    if (updatedReport) {
      import('./services/firestoreStore')
        .then(({ saveRemoteReport }) => saveRemoteReport(updatedReport))
        .catch(error => {
          console.warn('Report updated locally, but Firestore sync failed.', error)
        })
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <main className="main-area">
        <Topbar
          onMenu={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        <Suspense fallback={<div className="route-loading" role="status">Loading Nagar Drishti…</div>}>
          <Routes>
          <Route
            path="/"
            element={<Dashboard reports={reports} user={user} />}
          />

          <Route
            path="/scan"
            element={<ScanPage onSubmit={addReport} />}
          />
          <Route path="/misconduct-report" element={<MisconductReportPage onSubmit={addReport} />} />
          <Route path="/swachh-bharat" element={<SwachhBharatPage reports={reports} />} />
          <Route path="/cross-reporting" element={<CrossReportingPage />} />

          <Route
            path="/map"
            element={<MapPage reports={reports} />}
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
          <Route path="/admin/*" element={session.role === 'admin' ? <AdminPage reports={reports} onUpdateReport={updateReport} /> : <Navigate to="/" replace />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
          </Routes>
        </Suspense>
      </main>

      <BottomNav />
      <DrishtiAI />
    </div>
  )
}
