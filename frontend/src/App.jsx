import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileCheck2,
  Flame,
  Globe2,
  Home,
  ImagePlus,
  LayoutDashboard,
  Lightbulb,
  ListFilter,
  LocateFixed,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Navigation,
  Plus,
  Radar,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react'

import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

/* =========================================================
   NAGAR DRISHTI — SINGLE FILE PREMIUM LIGHT UI
   Everything is contained in this App.jsx
========================================================= */

const STORAGE_REPORTS = 'nagar-drishti-reports'
const STORAGE_USER = 'nagar-drishti-user'

const categories = {
  pothole: {
    label: 'Pothole',
    department: 'PWD',
    icon: '🕳️',
  },
  garbage: {
    label: 'Garbage',
    department: 'Municipal Corporation',
    icon: '🗑️',
  },
  streetlight: {
    label: 'Streetlight',
    department: 'Electricity Board',
    icon: '💡',
  },
  waterlogging: {
    label: 'Waterlogging',
    department: 'Drainage Department',
    icon: '💧',
  },
}

const seedReports = [
  {
    id: 'ND-1042',
    category: 'pothole',
    title: 'Large pothole near main road',
    department: 'PWD',
    status: 'Verified',
    priority: 'High',
    lat: 31.255,
    lng: 75.705,
    reporter: 'Aarav',
    time: '4 min ago',
  },
  {
    id: 'ND-1041',
    category: 'garbage',
    title: 'Overflowing garbage collection point',
    department: 'Municipal Corporation',
    status: 'Pending',
    priority: 'Medium',
    lat: 31.248,
    lng: 75.712,
    reporter: 'Priya',
    time: '11 min ago',
  },
  {
    id: 'ND-1040',
    category: 'streetlight',
    title: 'Streetlight not working',
    department: 'Electricity Board',
    status: 'Verified',
    priority: 'Medium',
    lat: 31.262,
    lng: 75.718,
    reporter: 'Rohan',
    time: '18 min ago',
  },
  {
    id: 'ND-1039',
    category: 'waterlogging',
    title: 'Water accumulated after rainfall',
    department: 'Drainage Department',
    status: 'In Progress',
    priority: 'High',
    lat: 31.244,
    lng: 75.699,
    reporter: 'Sneha',
    time: '25 min ago',
  },
]

const seedUser = {
  name: 'Chandra',
  email: 'citizen@nagar-drishti.app',
  points: 120,
  reports: 12,
  rank: 8,
}

function loadReports() {
  try {
    const saved = localStorage.getItem(STORAGE_REPORTS)
    return saved ? JSON.parse(saved) : seedReports
  } catch {
    return seedReports
  }
}

function loadUser() {
  try {
    const saved = localStorage.getItem(STORAGE_USER)
    return saved ? JSON.parse(saved) : seedUser
  } catch {
    return seedUser
  }
}

function saveReports(data) {
  localStorage.setItem(STORAGE_REPORTS, JSON.stringify(data))
}

function saveUser(data) {
  localStorage.setItem(STORAGE_USER, JSON.stringify(data))
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function Logo() {
  return (
    <div className="nd-logo">
      <div className="nd-logo-mark">
        <Radar size={21} strokeWidth={2.4} />
      </div>

      <div>
        <div className="nd-logo-title">Nagar Drishti</div>
        <div className="nd-logo-sub">THE CITY'S EYE</div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const cls =
    status === 'Verified'
      ? 'success'
      : status === 'In Progress'
        ? 'warning'
        : 'neutral'

  return <span className={`nd-badge ${cls}`}>{status}</span>
}

function StatCard({ icon, value, label, trend }) {
  return (
    <div className="nd-stat-card">
      <div className="nd-stat-top">
        <div className="nd-stat-icon">{icon}</div>
        {trend && <span className="nd-trend">{trend}</span>}
      </div>

      <div className="nd-stat-value">{value}</div>
      <div className="nd-stat-label">{label}</div>
    </div>
  )
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="nd-section-header">
      <div>
        {eyebrow && <div className="nd-eyebrow">{eyebrow}</div>}
        <h2>{title}</h2>
      </div>

      {action && (
        <button className="nd-text-button" onClick={action.onClick}>
          {action.label}
          <ArrowRight size={15} />
        </button>
      )}
    </div>
  )
}

function MapRecenter() {
  const map = useMap()

  return (
    <button
      className="nd-map-location"
      onClick={() => map.setView([31.255, 75.705], 14)}
      title="Recenter map"
    >
      <LocateFixed size={17} />
    </button>
  )
}

function CivicMap({ reports, compact = false }) {
  return (
    <div className={`nd-map ${compact ? 'compact' : ''}`}>
      <MapContainer
        center={[31.255, 75.705]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {reports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.lat, report.lng]}
            radius={8}
            pathOptions={{
              color:
                report.priority === 'High'
                  ? '#ef4444'
                  : report.status === 'Verified'
                    ? '#0891b2'
                    : '#f59e0b',
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              <strong>{report.title}</strong>
              <br />
              {categories[report.category]?.label}
              <br />
              <small>{report.department}</small>
            </Popup>
          </CircleMarker>
        ))}

        <MapRecenter />
      </MapContainer>
    </div>
  )
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({ page, setPage, open, setOpen, user }) {
  const items = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'scan', label: 'Report Issue', icon: Camera },
    { id: 'map', label: 'Civic Map', icon: Globe2 },
    { id: 'feed', label: 'Community Feed', icon: MessageSquare },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'My Profile', icon: User },
  ]

  function navigate(id) {
    setPage(id)
    setOpen(false)
  }

  return (
    <>
      {open && (
        <div className="nd-sidebar-overlay" onClick={() => setOpen(false)} />
      )}

      <aside className={`nd-sidebar ${open ? 'open' : ''}`}>
        <div className="nd-sidebar-head">
          <Logo />

          <button
            className="nd-mobile-close"
            onClick={() => setOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="nd-live-card">
          <div className="nd-live-dot" />
          <div>
            <strong>Network online</strong>
            <span>2,418 citizens active</span>
          </div>
        </div>

        <div className="nd-nav-label">MAIN MENU</div>

        <nav className="nd-nav">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.id}
                className={`nd-nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>

                {page === item.id && <ChevronRight size={15} />}
              </button>
            )
          })}
        </nav>

        <div className="nd-sidebar-spacer" />

        <div className="nd-sidebar-points">
          <div className="nd-points-icon">
            <Zap size={17} />
          </div>

          <div>
            <strong>{user.points} points</strong>
            <span>Keep improving your city</span>
          </div>
        </div>

        <div className="nd-sidebar-user">
          <div className="nd-avatar">{user.name.slice(0, 1)}</div>

          <div className="nd-user-info">
            <strong>{user.name}</strong>
            <span>Citizen</span>
          </div>

          <button title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  )
}

/* =========================================================
   TOPBAR
========================================================= */

function Topbar({ setOpen, user, setPage }) {
  return (
    <header className="nd-topbar">
      <div className="nd-topbar-left">
        <button className="nd-menu-button" onClick={() => setOpen(true)}>
          <Menu size={20} />
        </button>

        <div className="nd-breadcrumb">
          <span>Citizen Portal</span>
          <ChevronRight size={14} />
          <strong>Nagar Drishti</strong>
        </div>
      </div>

      <div className="nd-topbar-right">
        <button className="nd-search-button">
          <Search size={18} />
        </button>

        <button className="nd-notification">
          <Bell size={18} />
          <span />
        </button>

        <button
          className="nd-top-user"
          onClick={() => setPage('profile')}
        >
          <div className="nd-avatar small">{user.name.slice(0, 1)}</div>
          <div>
            <strong>{user.name}</strong>
            <span>Citizen</span>
          </div>
        </button>
      </div>
    </header>
  )
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ reports, user, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const videos = [
      document.getElementById('targo-hero-video'),
      document.getElementById('targo-about-video'),
    ].filter(Boolean)

    const playVideo = (video) => {
      if (!video) return
      video.muted = true
      video.defaultMuted = true
      const promise = video.play()
      if (promise && typeof promise.catch === 'function') promise.catch(() => {})
    }

    const timers = videos.map((video) => {
      playVideo(video)
      video.addEventListener('loadedmetadata', () => playVideo(video), { once: true })
      video.addEventListener('canplay', () => playVideo(video), { once: true })
      return window.setInterval(() => playVideo(video), 1000)
    })

    const unlock = () => videos.forEach(playVideo)
    document.addEventListener('click', unlock, { once: true, passive: true })
    document.addEventListener('touchstart', unlock, { once: true, passive: true })

    return () => {
      timers.forEach(clearInterval)
      document.removeEventListener('click', unlock)
      document.removeEventListener('touchstart', unlock)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="targo-dashboard">
      <section className="targo-hero" id="targo-home">
        <video
          id="targo-hero-video"
          className="targo-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4"
            type="video/mp4"
          />
        </video>

        <div className="targo-hero-scrim" />

        <nav className="targo-nav">
          <a className="targo-brand" href="#targo-home" aria-label="Nagar Drishti home">
            <span className="targo-logo" />
            <span className="targo-brand-name">Nagar Drishti</span>
          </a>

          <div className="targo-links">
            <a href="#targo-home">HOME</a>
            <a href="#targo-about">ABOUT</a>
            <a href="#targo-about">CONTACT US</a>
          </div>

          <a className="targo-contact" href="#targo-about">
            <svg className="targo-mail" viewBox="0 0 17 13" fill="none" aria-hidden="true">
              <rect x="0.7" y="0.7" width="15.6" height="11.6" rx="0.4" stroke="white" strokeWidth="1.4" />
              <path d="M1.2 1.4L8.5 7L15.8 1.4" stroke="white" strokeWidth="1.4" />
            </svg>
            CONTACT US
          </a>

          <button
            className="targo-mobile-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>

          <div className={`targo-mobile-menu ${menuOpen ? 'is-open' : ''}`}>
            <a href="#targo-home" onClick={closeMenu}>HOME</a>
            <a href="#targo-about" onClick={closeMenu}>ABOUT</a>
            <a href="#targo-about" onClick={closeMenu}>CONTACT US</a>
          </div>
        </nav>

        <div className="targo-hero-copy">
          <h1 className="targo-hero-title">
            SEEING
            <span>THE</span>
            <span>ISSUES</span>
            <span className="targo-indent">IN</span>
            <span className="targo-indent">YOUR</span>
            <span className="targo-indent targo-accent">CITY</span>
          </h1>
        </div>

        <div className="targo-cta-wrap">
          <a className="targo-button" href="#targo-about">REPORT AN ISSUE</a>
        </div>
      </section>

      <section className="targo-about" id="targo-about">
        <div className="targo-about-copy">
          <h2 className="targo-about-title">
            ABOUT
            <span className="targo-indent">NAGAR DRISHTI</span>
          </h2>

          <p className="targo-about-text">
            Nagar Drishti puts an AI eye on every street. Snap a photo of a pothole, an overflowing bin, or a broken streetlight, and our detection engine instantly classifies it and routes it to the right civic department. Faster reports, fewer surprises.
          </p>

          <div className="targo-about-button">
            <a className="targo-button" href="#targo-home">BACK TO TOP</a>
          </div>
        </div>

        <div className="targo-about-media">
          <video
            id="targo-about-video"
            className="targo-about-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4"
              type="video/mp4"
            />
          </video>
          <div className="targo-about-tint" />
        </div>
      </section>
    </div>
  )
}

/* =========================================================
   REPORT ROW
========================================================= */

function ReportRow({ report }) {
  const data = categories[report.category]

  return (
    <div className="nd-report-row">
      <div className="nd-report-icon">
        {data?.icon || '📍'}
      </div>

      <div className="nd-report-main">
        <strong>{report.title}</strong>

        <div className="nd-report-meta">
          <span>{report.id}</span>
          <span>•</span>
          <span>{report.reporter}</span>
          <span>•</span>
          <span>{report.time}</span>
        </div>
      </div>

      <div className="nd-report-department">
        {report.department}
      </div>

      <StatusBadge status={report.status} />

      <ChevronRight className="nd-row-arrow" size={17} />
    </div>
  )
}

/* =========================================================
   SCAN PAGE
========================================================= */

function ScanPage({ addReport }) {
  const inputRef = useRef(null)

  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [verified, setVerified] = useState(false)
  const [location, setLocation] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleFile(file) {
    if (!file) return

    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setVerified(false)
    setSubmitted(false)
  }

  function analyze() {
    if (!image) return

    setAnalyzing(true)

    setTimeout(() => {
      const name = image.name.toLowerCase()

      let category = 'pothole'

      if (name.includes('garbage') || name.includes('trash')) {
        category = 'garbage'
      } else if (
        name.includes('light') ||
        name.includes('lamp')
      ) {
        category = 'streetlight'
      } else if (
        name.includes('water') ||
        name.includes('flood')
      ) {
        category = 'waterlogging'
      }

      setResult({
        category,
        confidence: 94,
      })

      setAnalyzing(false)
    }, 1400)
  }

  function getLocation() {
    setLocation({
      lat: 31.255,
      lng: 75.705,
    })
  }

  function submit() {
    if (!result || !verified) return

    const data = categories[result.category]

    addReport({
      category: result.category,
      title: `${data.label} detected by citizen`,
      department: data.department,
      status: 'Verified',
      priority: result.confidence > 90 ? 'High' : 'Medium',
      lat: location?.lat || 31.255,
      lng: location?.lng || 75.705,
      time: 'just now',
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="nd-page nd-centered-page">
        <div className="nd-success-card">
          <div className="nd-success-icon">
            <CheckCircle2 size={42} />
          </div>

          <span className="nd-eyebrow">REPORT SUBMITTED</span>

          <h1>Your city just got smarter.</h1>

          <p>
            Your verified report has been added to the civic
            network and routed to the responsible department.
          </p>

          <div className="nd-reward">
            <Zap size={19} />
            +10 Nagar Points
          </div>

          <button
            className="nd-button primary"
            onClick={() => window.location.reload()}
          >
            Report another issue
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="nd-page">
      <div className="nd-page-heading">
        <div>
          <div className="nd-eyebrow">AI VISION REPORTING</div>
          <h1>See something? Report it.</h1>
          <p>
            Upload a photo and let Nagar Drishti identify,
            verify and route the civic issue.
          </p>
        </div>

        <div className="nd-stepper">
          <span className="active">01 Photo</span>
          <span>02 Verify</span>
          <span>03 Location</span>
          <span>04 Submit</span>
        </div>
      </div>

      <div className="nd-scan-layout">
        <div className="nd-panel nd-upload-panel">
          <div
            className="nd-dropzone"
            onClick={() => inputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Selected civic issue" />
            ) : (
              <>
                <div className="nd-upload-icon">
                  <ImagePlus size={28} />
                </div>

                <h3>Upload an issue photo</h3>

                <p>
                  Take a clear photo of a pothole, garbage,
                  streetlight or waterlogging.
                </p>

                <button
                  className="nd-button secondary"
                  type="button"
                >
                  <Upload size={17} />
                  Choose photo
                </button>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>

          {image && !result && (
            <button
              className="nd-button primary full"
              onClick={analyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Activity className="nd-spin" size={18} />
                  AI is analysing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyse with AI
                </>
              )}
            </button>
          )}
        </div>

        <div className="nd-panel nd-analysis-panel">
          <div className="nd-panel-label">
            <Sparkles size={16} />
            AI ANALYSIS
          </div>

          {!result ? (
            <div className="nd-empty-analysis">
              <Radar size={42} />
              <strong>Waiting for image</strong>
              <span>
                Upload a photo to start AI classification.
              </span>
            </div>
          ) : (
            <>
              <div className="nd-ai-result">
                <div className="nd-result-icon">
                  {categories[result.category].icon}
                </div>

                <div>
                  <span>DETECTED ISSUE</span>
                  <h2>
                    {categories[result.category].label}
                  </h2>
                </div>

                <div className="nd-confidence">
                  <strong>{result.confidence}%</strong>
                  <span>confidence</span>
                </div>
              </div>

              <div className="nd-route-card">
                <div>
                  <span>SMART ROUTING</span>
                  <strong>
                    {categories[result.category].department}
                  </strong>
                </div>

                <ArrowRight size={20} />
              </div>

              <div className="nd-verification">
                <div>
                  <ShieldCheck size={19} />
                  <div>
                    <strong>Is this correct?</strong>
                    <span>
                      Confirm AI's classification before submitting.
                    </span>
                  </div>
                </div>

                <div className="nd-verification-buttons">
                  <button
                    className={verified ? 'selected' : ''}
                    onClick={() => setVerified(true)}
                  >
                    <CheckCircle2 size={16} />
                    Confirm
                  </button>

                  <button
                    className={!verified ? 'wrong' : ''}
                    onClick={() => setVerified(false)}
                  >
                    Wrong
                  </button>
                </div>
              </div>

              <div className="nd-location-card">
                <div className="nd-location-icon">
                  <MapPin size={18} />
                </div>

                <div>
                  <strong>
                    {location
                      ? 'Location captured'
                      : 'Add your location'}
                  </strong>

                  <span>
                    {location
                      ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                      : 'Your approximate location is required.'}
                  </span>
                </div>

                {!location && (
                  <button onClick={getLocation}>
                    <Navigation size={15} />
                    Detect
                  </button>
                )}
              </div>

              <button
                className="nd-button primary full"
                disabled={!verified}
                onClick={submit}
              >
                <Send size={17} />
                Submit verified report
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MAP PAGE
========================================================= */

function MapPage({ reports }) {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return reports
    return reports.filter((r) => r.category === filter)
  }, [reports, filter])

  return (
    <div className="nd-page">
      <div className="nd-page-heading map-heading">
        <div>
          <div className="nd-eyebrow">LIVE CIVIC NETWORK</div>
          <h1>See your city.</h1>
          <p>
            Every marker represents a real civic signal
            reported by the community.
          </p>
        </div>

        <div className="nd-filter-row">
          {['all', 'pothole', 'garbage', 'streetlight', 'waterlogging'].map(
            (item) => (
              <button
                key={item}
                className={filter === item ? 'active' : ''}
                onClick={() => setFilter(item)}
              >
                {item === 'all'
                  ? 'All'
                  : categories[item].label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="nd-full-map-card">
        <CivicMap reports={filtered} />
      </div>

      <div className="nd-map-bottom">
        <div className="nd-panel">
          <SectionHeader
            eyebrow="ACTIVE SIGNALS"
            title={`${filtered.length} issues nearby`}
          />

          <div className="nd-report-list">
            {filtered.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>
        </div>

        <div className="nd-panel nd-priority-panel">
          <div className="nd-panel-label">
            <CircleAlert size={16} />
            PRIORITY AREA
          </div>

          <h2>Main Road Corridor</h2>

          <p>
            7 reports detected within a 500m radius.
            Infrastructure priority is currently elevated.
          </p>

          <div className="nd-priority-score">
            <strong>82</strong>
            <span>/ 100 priority</span>
          </div>

          <div className="nd-bar">
            <i style={{ width: '82%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   FEED PAGE
========================================================= */

function FeedPage({ reports }) {
  return (
    <div className="nd-page">
      <div className="nd-page-heading">
        <div>
          <div className="nd-eyebrow">COMMUNITY</div>
          <h1>What citizens are reporting.</h1>
          <p>
            A transparent feed of civic problems being
            detected around the city.
          </p>
        </div>

        <button className="nd-button secondary">
          <ListFilter size={17} />
          Filter
        </button>
      </div>

      <div className="nd-feed-layout">
        <div className="nd-panel">
          <SectionHeader
            eyebrow="LIVE FEED"
            title="Recent community reports"
          />

          <div className="nd-feed-list">
            {reports.map((report) => (
              <div className="nd-feed-card" key={report.id}>
                <div className="nd-feed-icon">
                  {categories[report.category]?.icon}
                </div>

                <div className="nd-feed-content">
                  <div className="nd-feed-top">
                    <span>
                      {categories[report.category]?.label}
                    </span>
                    <StatusBadge status={report.status} />
                  </div>

                  <h3>{report.title}</h3>

                  <p>
                    Reported by <strong>{report.reporter}</strong>{' '}
                    · {report.time}
                  </p>

                  <div className="nd-feed-route">
                    <MapPin size={14} />
                    {report.department}
                  </div>
                </div>

                <button className="nd-round-button">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="nd-panel nd-feed-side">
          <div className="nd-panel-label">
            <Flame size={16} />
            TRENDING
          </div>

          <h2>Potholes are trending</h2>

          <p>
            Citizen reports of road damage are up 18% this
            week.
          </p>

          <div className="nd-mini-stat">
            <strong>18%</strong>
            <span>increase</span>
          </div>

          <div className="nd-divider" />

          <div className="nd-mini-row">
            <span>Most active area</span>
            <strong>Main Road</strong>
          </div>

          <div className="nd-mini-row">
            <span>Most reported</span>
            <strong>Potholes</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   LEADERBOARD
========================================================= */

function LeaderboardPage({ user }) {
  const leaders = [
    { name: 'Aarav Singh', points: 580, reports: 34 },
    { name: 'Priya Sharma', points: 520, reports: 29 },
    { name: 'Rohan Verma', points: 440, reports: 25 },
    { name: user.name, points: user.points, reports: user.reports },
    { name: 'Sneha Kapoor', points: 310, reports: 18 },
  ]

  return (
    <div className="nd-page">
      <div className="nd-leader-hero">
        <div>
          <div className="nd-eyebrow">
            <Trophy size={14} />
            CIVIC CHAMPIONS
          </div>

          <h1>
            Good citizens
            <br />
            make great cities.
          </h1>

          <p>
            Earn Nagar Points for verified reports and climb
            the civic leaderboard.
          </p>
        </div>

        <div className="nd-trophy">
          <Trophy size={72} strokeWidth={1.1} />
        </div>
      </div>

      <div className="nd-ranking-grid">
        <div className="nd-panel">
          <SectionHeader
            eyebrow="THIS WEEK"
            title="Top citizens"
          />

          <div className="nd-leader-list">
            {leaders.map((leader, index) => (
              <div
                key={leader.name}
                className={`nd-leader-row ${
                  leader.name === user.name ? 'current' : ''
                }`}
              >
                <div className="nd-rank">
                  {index === 0 ? (
                    <Trophy size={17} />
                  ) : (
                    `0${index + 1}`
                  )}
                </div>

                <div className="nd-avatar">
                  {leader.name.slice(0, 1)}
                </div>

                <div className="nd-leader-name">
                  <strong>{leader.name}</strong>
                  <span>{leader.reports} reports</span>
                </div>

                <strong className="nd-leader-points">
                  {leader.points}
                  <small> pts</small>
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div className="nd-panel nd-your-rank">
          <div className="nd-panel-label">
            <Award size={16} />
            YOUR IMPACT
          </div>

          <div className="nd-rank-big">
            <span>#</span>
            {user.rank}
          </div>

          <p>
            You're ahead of <strong>72%</strong> of active
            citizens.
          </p>

          <div className="nd-impact-row">
            <div>
              <strong>{user.points}</strong>
              <span>Nagar Points</span>
            </div>

            <div>
              <strong>{user.reports}</strong>
              <span>Reports</span>
            </div>
          </div>

          <div className="nd-reward">
            <Zap size={18} />
            30 more points → next badge
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({ user }) {
  return (
    <div className="nd-page">
      <div className="nd-page-heading">
        <div>
          <div className="nd-eyebrow">YOUR CIVIC IDENTITY</div>
          <h1>My profile.</h1>
          <p>
            Track your contribution to the city.
          </p>
        </div>
      </div>

      <div className="nd-profile-grid">
        <div className="nd-profile-card">
          <div className="nd-profile-avatar">
            {user.name.slice(0, 1)}
          </div>

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <div className="nd-profile-badge">
            <ShieldCheck size={15} />
            Verified Citizen
          </div>

          <div className="nd-profile-stats">
            <div>
              <strong>{user.points}</strong>
              <span>Points</span>
            </div>

            <div>
              <strong>{user.reports}</strong>
              <span>Reports</span>
            </div>

            <div>
              <strong>#{user.rank}</strong>
              <span>Rank</span>
            </div>
          </div>
        </div>

        <div className="nd-panel">
          <SectionHeader
            eyebrow="YOUR IMPACT"
            title="Civic contribution"
          />

          <div className="nd-impact-chart">
            {[42, 58, 36, 72, 55, 84, 68].map(
              (height, index) => (
                <div key={index}>
                  <span
                    style={{ height: `${height}%` }}
                  />
                  <small>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </small>
                </div>
              ),
            )}
          </div>

          <div className="nd-impact-summary">
            <div>
              <span>This week</span>
              <strong>+42 points</strong>
            </div>

            <div>
              <span>Verified reports</span>
              <strong>9</strong>
            </div>

            <div>
              <span>Impact score</span>
              <strong>94/100</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [reports, setReports] = useState(loadReports)
  const [user, setUser] = useState(loadUser)

  useEffect(() => {
    saveReports(reports)
  }, [reports])

  useEffect(() => {
    saveUser(user)
  }, [user])

  function addReport(report) {
    const nextReport = {
      ...report,
      id: `ND-${1043 + reports.length}`,
      reporter: 'You',
    }

    setReports((current) => [nextReport, ...current])

    setUser((current) => ({
      ...current,
      points: current.points + 10,
      reports: current.reports + 1,
    }))
  }

  function renderPage() {
    switch (page) {
      case 'scan':
        return <ScanPage addReport={addReport} />

      case 'map':
        return <MapPage reports={reports} />

      case 'feed':
        return <FeedPage reports={reports} />

      case 'leaderboard':
        return <LeaderboardPage user={user} />

      case 'profile':
        return <ProfilePage user={user} />

      default:
        return (
          <Dashboard
            reports={reports}
            user={user}
            setPage={setPage}
          />
        )
    }
  }

  return (
    <>
      <style>{`
        /* =====================================================
           NAGAR DRISHTI PREMIUM LIGHT DESIGN SYSTEM
        ===================================================== */

        :root {
          --nd-bg: #f5f7f9;
          --nd-surface: #ffffff;
          --nd-surface-2: #f8fafc;
          --nd-text: #111827;
          --nd-muted: #697586;
          --nd-border: #e5e9ef;
          --nd-primary: #0891b2;
          --nd-primary-dark: #0e7490;
          --nd-primary-soft: #e6f7fa;
          --nd-green: #16a34a;
          --nd-orange: #f59e0b;
          --nd-red: #ef4444;
          --nd-sidebar: #ffffff;
          --nd-shadow: 0 12px 40px rgba(15, 23, 42, .055);
          --nd-radius: 22px;
        }

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
          width: 100%;
        }

        body {
          background: var(--nd-bg);
          color: var(--nd-text);
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        button,
        input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .nd-app {
          min-height: 100vh;
          background: var(--nd-bg);
        }

        /* SIDEBAR */

        .nd-sidebar {
          position: fixed;
          z-index: 100;
          top: 0;
          bottom: 0;
          left: 0;
          width: 265px;
          padding: 25px 18px;
          background: var(--nd-sidebar);
          border-right: 1px solid var(--nd-border);
          display: flex;
          flex-direction: column;
        }

        .nd-sidebar-head {
          padding: 0 8px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nd-logo {
          display: flex;
          gap: 11px;
          align-items: center;
        }

        .nd-logo-mark {
          width: 39px;
          height: 39px;
          border-radius: 12px;
          background: #101828;
          color: white;
          display: grid;
          place-items: center;
        }

        .nd-logo-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -.4px;
        }

        .nd-logo-sub {
          color: var(--nd-muted);
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-top: 3px;
        }

        .nd-live-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px;
          margin: 0 4px 27px;
          background: var(--nd-primary-soft);
          border: 1px solid #d5f0f4;
          border-radius: 15px;
        }

        .nd-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,.12);
          flex: 0 0 auto;
        }

        .nd-live-card strong {
          display: block;
          font-size: 12px;
        }

        .nd-live-card span {
          display: block;
          color: var(--nd-muted);
          font-size: 10px;
          margin-top: 3px;
        }

        .nd-nav-label {
          padding: 0 11px 9px;
          color: #98a2b3;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .nd-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nd-nav-item {
          width: 100%;
          border: 0;
          background: transparent;
          color: #667085;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 12px;
          border-radius: 12px;
          text-align: left;
          font-size: 13px;
          transition: .2s ease;
        }

        .nd-nav-item:hover {
          background: #f3f6f8;
          color: var(--nd-text);
        }

        .nd-nav-item.active {
          color: var(--nd-primary-dark);
          background: var(--nd-primary-soft);
          font-weight: 700;
        }

        .nd-nav-item svg:last-child {
          margin-left: auto;
        }

        .nd-sidebar-spacer {
          flex: 1;
        }

        .nd-sidebar-points {
          margin: 15px 3px;
          display: flex;
          gap: 10px;
          padding: 13px;
          border-radius: 15px;
          background: #fbfcfd;
          border: 1px solid var(--nd-border);
        }

        .nd-points-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #fff5d9;
          color: #c28100;
          display: grid;
          place-items: center;
        }

        .nd-sidebar-points strong,
        .nd-sidebar-points span {
          display: block;
        }

        .nd-sidebar-points strong {
          font-size: 11px;
        }

        .nd-sidebar-points span {
          color: var(--nd-muted);
          font-size: 9px;
          margin-top: 3px;
        }

        .nd-sidebar-user {
          padding: 13px 5px 0;
          border-top: 1px solid var(--nd-border);
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .nd-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #dff5f8;
          color: var(--nd-primary-dark);
          display: grid;
          place-items: center;
          font-size: 13px;
          font-weight: 800;
          flex: 0 0 auto;
        }

        .nd-avatar.small {
          width: 34px;
          height: 34px;
        }

        .nd-user-info {
          min-width: 0;
          flex: 1;
        }

        .nd-user-info strong,
        .nd-user-info span {
          display: block;
        }

        .nd-user-info strong {
          font-size: 12px;
        }

        .nd-user-info span {
          color: var(--nd-muted);
          font-size: 9px;
          margin-top: 2px;
        }

        .nd-sidebar-user button {
          border: 0;
          background: transparent;
          color: #98a2b3;
        }

        .nd-mobile-close {
          display: none;
          border: 0;
          background: #f2f4f7;
          border-radius: 10px;
          padding: 7px;
        }

        /* MAIN */

        .nd-main {
          margin-left: 265px;
          min-height: 100vh;
        }

        .nd-topbar {
          height: 76px;
          background: rgba(255,255,255,.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--nd-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 36px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nd-topbar-left,
        .nd-topbar-right,
        .nd-breadcrumb,
        .nd-top-user {
          display: flex;
          align-items: center;
        }

        .nd-breadcrumb {
          gap: 8px;
          color: #98a2b3;
          font-size: 11px;
        }

        .nd-breadcrumb strong {
          color: var(--nd-text);
        }

        .nd-menu-button {
          display: none;
          border: 0;
          background: transparent;
        }

        .nd-topbar-right {
          gap: 8px;
        }

        .nd-search-button,
        .nd-notification {
          position: relative;
          width: 37px;
          height: 37px;
          border: 1px solid var(--nd-border);
          background: white;
          border-radius: 11px;
          color: #667085;
          display: grid;
          place-items: center;
        }

        .nd-notification span {
          width: 6px;
          height: 6px;
          background: var(--nd-red);
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
          border: 1px solid white;
        }

        .nd-top-user {
          border: 0;
          background: transparent;
          margin-left: 9px;
          gap: 8px;
          text-align: left;
        }

        .nd-top-user strong,
        .nd-top-user span {
          display: block;
        }

        .nd-top-user strong {
          font-size: 11px;
        }

        .nd-top-user span {
          color: var(--nd-muted);
          font-size: 9px;
          margin-top: 2px;
        }

        /* PAGE */

        .nd-page {
          max-width: 1380px;
          margin: 0 auto;
          padding: 42px 42px 80px;
        }

        .nd-dashboard-head,
        .nd-page-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 32px;
        }

        .nd-eyebrow {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--nd-primary-dark);
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.6px;
          margin-bottom: 11px;
        }

        .nd-dashboard-head h1,
        .nd-page-heading h1 {
          font-size: clamp(38px, 5vw, 65px);
          line-height: .95;
          letter-spacing: -3px;
          margin: 0;
          font-weight: 850;
        }

        .nd-dashboard-head h1 span {
          color: var(--nd-primary);
        }

        .nd-dashboard-head p,
        .nd-page-heading p {
          max-width: 560px;
          color: var(--nd-muted);
          font-size: 14px;
          line-height: 1.65;
          margin: 16px 0 0;
        }

        .nd-head-actions {
          display: flex;
          gap: 9px;
        }

        /* BUTTONS */

        .nd-button {
          min-height: 42px;
          border-radius: 11px;
          padding: 0 15px;
          border: 1px solid var(--nd-border);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 700;
          font-size: 11px;
          transition: .2s ease;
        }

        .nd-button:hover {
          transform: translateY(-1px);
        }

        .nd-button.primary {
          background: var(--nd-primary);
          border-color: var(--nd-primary);
          color: white;
          box-shadow: 0 7px 18px rgba(8,145,178,.18);
        }

        .nd-button.secondary {
          background: white;
          color: #344054;
        }

        .nd-button.full {
          width: 100%;
        }

        .nd-dark-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 0;
          background: #111827;
          color: white;
          border-radius: 11px;
          padding: 12px 15px;
          font-size: 11px;
          font-weight: 750;
        }

        .nd-text-button {
          border: 0;
          background: transparent;
          color: var(--nd-primary-dark);
          display: flex;
          gap: 5px;
          align-items: center;
          font-size: 10px;
          font-weight: 800;
        }

        /* HERO */

        .nd-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(240px, .7fr);
          gap: 16px;
          margin-bottom: 16px;
        }

        .nd-hero-card {
          min-height: 310px;
          padding: 37px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(8,145,178,.18),
              transparent 34%
            ),
            #101828;
          color: white;
          display: flex;
          justify-content: space-between;
        }

        .nd-hero-copy {
          max-width: 520px;
          position: relative;
          z-index: 2;
        }

        .nd-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255,255,255,.15);
          background: rgba(255,255,255,.06);
          padding: 7px 9px;
          border-radius: 99px;
          color: #b8e9ef;
          font-size: 8px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .nd-hero-card h2 {
          font-size: clamp(35px, 4vw, 54px);
          letter-spacing: -2.5px;
          line-height: .96;
          margin: 22px 0 14px;
        }

        .nd-hero-card h2 em {
          color: #8ee7ef;
          font-style: normal;
        }

        .nd-hero-card p {
          max-width: 470px;
          color: #b7c1cd;
          font-size: 12px;
          line-height: 1.65;
          margin-bottom: 21px;
        }

        .nd-hero-orbit {
          width: 250px;
          height: 250px;
          position: absolute;
          right: 28px;
          top: 28px;
          display: grid;
          place-items: center;
        }

        .orbit-ring {
          position: absolute;
          border: 1px solid rgba(142,231,239,.14);
          border-radius: 50%;
        }

        .ring-one {
          width: 120px;
          height: 120px;
        }

        .ring-two {
          width: 185px;
          height: 185px;
        }

        .ring-three {
          width: 250px;
          height: 250px;
        }

        .orbit-center {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(8,145,178,.18);
          border: 1px solid rgba(142,231,239,.35);
          display: grid;
          place-items: center;
          color: #8ee7ef;
        }

        .orbit-center span {
          font-size: 6px;
          letter-spacing: 1px;
          font-weight: 900;
        }

        .orbit-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          background: #8ee7ef;
          border-radius: 50%;
          box-shadow: 0 0 18px rgba(142,231,239,.8);
        }

        .dot-one {
          top: 22px;
          right: 67px;
        }

        .dot-two {
          bottom: 38px;
          left: 29px;
        }

        .dot-three {
          right: 20px;
          bottom: 88px;
        }

        .nd-health-card {
          border: 1px solid var(--nd-border);
          border-radius: 24px;
          background: white;
          padding: 27px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nd-card-label {
          display: flex;
          justify-content: space-between;
          color: #98a2b3;
          font-size: 8px;
          letter-spacing: 1px;
          font-weight: 850;
        }

        .nd-card-label span {
          color: var(--nd-green);
        }

        .nd-health-score {
          font-size: 77px;
          font-weight: 850;
          letter-spacing: -5px;
          line-height: 1;
        }

        .nd-health-meter,
        .nd-bar {
          height: 7px;
          border-radius: 99px;
          background: #edf1f3;
          overflow: hidden;
        }

        .nd-health-meter div,
        .nd-bar i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--nd-primary);
        }

        .nd-health-bottom {
          display: flex;
          justify-content: space-between;
          color: var(--nd-muted);
          font-size: 9px;
        }

        /* STATS */

        .nd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .nd-stat-card {
          background: white;
          border: 1px solid var(--nd-border);
          border-radius: 18px;
          padding: 19px;
        }

        .nd-stat-top {
          display: flex;
          justify-content: space-between;
        }

        .nd-stat-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: var(--nd-primary-soft);
          color: var(--nd-primary-dark);
          display: grid;
          place-items: center;
        }

        .nd-trend {
          color: var(--nd-green);
          font-size: 9px;
          font-weight: 800;
        }

        .nd-stat-value {
          font-size: 28px;
          font-weight: 850;
          letter-spacing: -1.5px;
          margin-top: 17px;
        }

        .nd-stat-label {
          color: var(--nd-muted);
          font-size: 10px;
          margin-top: 3px;
        }

        /* PANELS */

        .nd-panel {
          background: white;
          border: 1px solid var(--nd-border);
          border-radius: var(--nd-radius);
          padding: 25px;
          box-shadow: var(--nd-shadow);
        }

        .nd-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .nd-section-header h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -.7px;
        }

        .nd-content-grid {
          display: grid;
          grid-template-columns: 1.35fr .75fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        /* MAP */

        .nd-map {
          width: 100%;
          height: 510px;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          background: #edf3f5;
        }

        .nd-map.compact {
          height: 320px;
        }

        .nd-map-location {
          position: absolute;
          z-index: 1000;
          right: 14px;
          bottom: 14px;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 11px;
          background: white;
          color: #344054;
          box-shadow: 0 5px 20px rgba(0,0,0,.12);
          display: grid;
          place-items: center;
        }

        .nd-map .leaflet-control-zoom {
          border: 0 !important;
          box-shadow: 0 5px 20px rgba(0,0,0,.1) !important;
        }

        .nd-map .leaflet-control-zoom a {
          color: #344054 !important;
          background: white !important;
          border: 0 !important;
        }

        .nd-map-legend {
          display: flex;
          gap: 18px;
          padding-top: 13px;
          color: var(--nd-muted);
          font-size: 9px;
        }

        .nd-map-legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nd-map-legend i {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .nd-map-legend .red {
          background: var(--nd-red);
        }

        .nd-map-legend .cyan {
          background: var(--nd-primary);
        }

        .nd-map-legend .yellow {
          background: var(--nd-orange);
        }

        /* INSIGHT */

        .nd-insight-main {
          padding: 18px;
          border-radius: 16px;
          background: #f8fbfc;
          border: 1px solid #e8f1f3;
          display: flex;
          gap: 13px;
          margin-bottom: 22px;
        }

        .nd-ai-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--nd-primary-soft);
          color: var(--nd-primary-dark);
          display: grid;
          place-items: center;
          flex: 0 0 auto;
        }

        .nd-insight-main strong {
          font-size: 12px;
        }

        .nd-insight-main p {
          color: var(--nd-muted);
          font-size: 10px;
          line-height: 1.55;
          margin: 6px 0 0;
        }

        .nd-insight-bars {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .nd-insight-bars > div > div:first-child {
          display: flex;
          justify-content: space-between;
          color: var(--nd-muted);
          font-size: 9px;
          margin-bottom: 6px;
        }

        .nd-insight-bars strong {
          color: var(--nd-text);
        }

        .nd-insight-note {
          margin-top: 22px;
          padding: 12px;
          background: #fff9e8;
          color: #8b6500;
          border-radius: 12px;
          font-size: 9px;
          display: flex;
          gap: 7px;
          line-height: 1.4;
        }

        /* REPORTS */

        .nd-report-list {
          display: flex;
          flex-direction: column;
        }

        .nd-report-row {
          display: grid;
          grid-template-columns: 42px minmax(0, 1fr) 180px 90px 20px;
          gap: 13px;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #eef1f4;
        }

        .nd-report-row:last-child {
          border-bottom: 0;
        }

        .nd-report-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #f5f7f9;
          display: grid;
          place-items: center;
          font-size: 18px;
        }

        .nd-report-main strong {
          font-size: 11px;
        }

        .nd-report-meta {
          display: flex;
          gap: 6px;
          color: #98a2b3;
          font-size: 8px;
          margin-top: 5px;
        }

        .nd-report-department {
          color: var(--nd-muted);
          font-size: 9px;
        }

        .nd-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 8px;
          border-radius: 99px;
          font-size: 8px;
          font-weight: 800;
        }

        .nd-badge.success {
          background: #eaf8ef;
          color: #16803d;
        }

        .nd-badge.warning {
          background: #fff6df;
          color: #9a6800;
        }

        .nd-badge.neutral {
          background: #f0f2f5;
          color: #667085;
        }

        .nd-row-arrow {
          color: #b0b7c2;
        }

        /* SCAN */

        .nd-stepper {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .nd-stepper span {
          padding: 7px 9px;
          border-radius: 8px;
          background: white;
          border: 1px solid var(--nd-border);
          color: #98a2b3;
          font-size: 8px;
          font-weight: 800;
        }

        .nd-stepper span.active {
          background: var(--nd-primary-soft);
          border-color: #d5f0f4;
          color: var(--nd-primary-dark);
        }

        .nd-scan-layout {
          display: grid;
          grid-template-columns: 1fr .9fr;
          gap: 16px;
        }

        .nd-upload-panel,
        .nd-analysis-panel {
          min-height: 540px;
        }

        .nd-dropzone {
          height: 430px;
          border: 1.5px dashed #cbd5dc;
          border-radius: 19px;
          background: #fbfcfd;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          overflow: hidden;
          cursor: pointer;
        }

        .nd-dropzone img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nd-upload-icon {
          width: 62px;
          height: 62px;
          border-radius: 18px;
          background: var(--nd-primary-soft);
          color: var(--nd-primary-dark);
          display: grid;
          place-items: center;
          margin-bottom: 15px;
        }

        .nd-dropzone h3 {
          margin: 0;
          font-size: 17px;
        }

        .nd-dropzone p {
          max-width: 340px;
          color: var(--nd-muted);
          font-size: 10px;
          line-height: 1.6;
          margin: 9px 0 17px;
        }

        .nd-upload-panel > .nd-button {
          margin-top: 13px;
        }

        .nd-panel-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--nd-primary-dark);
          font-size: 9px;
          letter-spacing: 1.2px;
          font-weight: 850;
        }

        .nd-empty-analysis {
          min-height: 440px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #b1bac4;
          text-align: center;
          gap: 7px;
        }

        .nd-empty-analysis strong {
          color: #667085;
          font-size: 13px;
          margin-top: 10px;
        }

        .nd-empty-analysis span {
          font-size: 9px;
        }

        .nd-ai-result {
          margin-top: 25px;
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 13px;
        }

        .nd-result-icon {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          background: var(--nd-primary-soft);
          display: grid;
          place-items: center;
          font-size: 24px;
        }

        .nd-ai-result span,
        .nd-confidence span {
          display: block;
          color: #98a2b3;
          font-size: 7px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .nd-ai-result h2 {
          margin: 5px 0 0;
          font-size: 20px;
        }

        .nd-confidence {
          text-align: right;
        }

        .nd-confidence strong {
          display: block;
          color: var(--nd-green);
          font-size: 23px;
        }

        .nd-confidence span {
          margin-top: 2px;
        }

        .nd-route-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 23px;
          padding: 16px;
          border-radius: 15px;
          background: #f8fafb;
          border: 1px solid var(--nd-border);
        }

        .nd-route-card span,
        .nd-route-card strong {
          display: block;
        }

        .nd-route-card span {
          color: #98a2b3;
          font-size: 7px;
          letter-spacing: 1px;
        }

        .nd-route-card strong {
          margin-top: 5px;
          font-size: 11px;
        }

        .nd-verification {
          margin-top: 13px;
          padding: 16px;
          border-radius: 15px;
          border: 1px solid var(--nd-border);
        }

        .nd-verification > div:first-child {
          display: flex;
          gap: 9px;
        }

        .nd-verification strong,
        .nd-verification span {
          display: block;
        }

        .nd-verification strong {
          font-size: 11px;
        }

        .nd-verification span {
          color: var(--nd-muted);
          font-size: 8px;
          margin-top: 3px;
        }

        .nd-verification-buttons {
          display: flex;
          gap: 7px;
          margin-top: 13px;
        }

        .nd-verification-buttons button {
          flex: 1;
          border: 1px solid var(--nd-border);
          background: white;
          border-radius: 9px;
          padding: 9px;
          font-size: 9px;
          font-weight: 750;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        .nd-verification-buttons button.selected {
          background: #eaf8ef;
          border-color: #bce8ca;
          color: #16803d;
        }

        .nd-verification-buttons button.wrong {
          background: #fff0f0;
          border-color: #ffd2d2;
          color: #c52e2e;
        }

        .nd-location-card {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 13px 0;
          padding: 13px;
          border-radius: 15px;
          background: #f8fafb;
        }

        .nd-location-icon {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: #fff1f1;
          color: var(--nd-red);
          display: grid;
          place-items: center;
        }

        .nd-location-card > div:nth-child(2) {
          flex: 1;
        }

        .nd-location-card strong,
        .nd-location-card span {
          display: block;
        }

        .nd-location-card strong {
          font-size: 10px;
        }

        .nd-location-card span {
          color: var(--nd-muted);
          font-size: 8px;
          margin-top: 3px;
        }

        .nd-location-card button {
          border: 0;
          background: white;
          border: 1px solid var(--nd-border);
          padding: 7px 9px;
          border-radius: 8px;
          display: flex;
          gap: 4px;
          align-items: center;
          font-size: 8px;
          font-weight: 800;
        }

        .nd-button:disabled {
          opacity: .45;
          cursor: not-allowed;
          transform: none;
        }

        .nd-spin {
          animation: nd-spin 1s linear infinite;
        }

        @keyframes nd-spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* SUCCESS */

        .nd-centered-page {
          min-height: calc(100vh - 76px);
          display: grid;
          place-items: center;
        }

        .nd-success-card {
          max-width: 570px;
          text-align: center;
          background: white;
          border: 1px solid var(--nd-border);
          border-radius: 28px;
          padding: 48px;
          box-shadow: var(--nd-shadow);
        }

        .nd-success-icon {
          width: 82px;
          height: 82px;
          border-radius: 50%;
          background: #eaf8ef;
          color: var(--nd-green);
          display: grid;
          place-items: center;
          margin: 0 auto 22px;
        }

        .nd-success-card h1 {
          font-size: 38px;
          letter-spacing: -2px;
          margin: 0;
        }

        .nd-success-card p {
          color: var(--nd-muted);
          font-size: 12px;
          line-height: 1.7;
        }

        .nd-reward {
          width: fit-content;
          margin: 18px auto;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border-radius: 99px;
          background: #fff6dc;
          color: #996800;
          font-size: 10px;
          font-weight: 850;
        }

        /* MAP PAGE */

        .nd-full-map-card {
          background: white;
          border: 1px solid var(--nd-border);
          border-radius: 24px;
          padding: 8px;
          box-shadow: var(--nd-shadow);
        }

        .nd-full-map-card .nd-map {
          height: 580px;
        }

        .nd-filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: flex-end;
        }

        .nd-filter-row button {
          border: 1px solid var(--nd-border);
          background: white;
          color: var(--nd-muted);
          padding: 8px 10px;
          border-radius: 9px;
          font-size: 8px;
          font-weight: 750;
        }

        .nd-filter-row button.active {
          background: var(--nd-primary-soft);
          color: var(--nd-primary-dark);
          border-color: #cdeef2;
        }

        .nd-map-bottom {
          display: grid;
          grid-template-columns: 1.4fr .6fr;
          gap: 16px;
          margin-top: 16px;
        }

        .nd-priority-panel h2 {
          font-size: 22px;
          margin: 18px 0 7px;
        }

        .nd-priority-panel p {
          color: var(--nd-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .nd-priority-score {
          margin: 25px 0 10px;
        }

        .nd-priority-score strong {
          font-size: 42px;
          letter-spacing: -2px;
        }

        .nd-priority-score span {
          color: var(--nd-muted);
          font-size: 9px;
        }

        /* FEED */

        .nd-feed-layout {
          display: grid;
          grid-template-columns: 1.35fr .65fr;
          gap: 16px;
        }

        .nd-feed-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .nd-feed-card {
          display: flex;
          gap: 13px;
          padding: 15px;
          border: 1px solid #edf0f3;
          border-radius: 16px;
          align-items: center;
        }

        .nd-feed-icon {
          width: 48px;
          height: 48px;
          background: #f6f8fa;
          border-radius: 14px;
          display: grid;
          place-items: center;
          font-size: 21px;
        }

        .nd-feed-content {
          flex: 1;
        }

        .nd-feed-top {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--nd-primary-dark);
          font-size: 8px;
          font-weight: 800;
        }

        .nd-feed-top .nd-badge {
          margin-left: auto;
        }

        .nd-feed-card h3 {
          font-size: 12px;
          margin: 6px 0;
        }

        .nd-feed-card p {
          color: var(--nd-muted);
          font-size: 8px;
          margin: 0;
        }

        .nd-feed-route {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #98a2b3;
          font-size: 8px;
          margin-top: 9px;
        }

        .nd-round-button {
          width: 32px;
          height: 32px;
          border: 1px solid var(--nd-border);
          background: white;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }

        .nd-feed-side h2 {
          font-size: 25px;
          letter-spacing: -1px;
          margin: 20px 0 8px;
        }

        .nd-feed-side p {
          color: var(--nd-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .nd-mini-stat {
          margin: 28px 0;
        }

        .nd-mini-stat strong {
          font-size: 45px;
          letter-spacing: -3px;
          color: var(--nd-primary);
        }

        .nd-mini-stat span {
          color: var(--nd-muted);
          font-size: 9px;
          margin-left: 5px;
        }

        .nd-divider {
          height: 1px;
          background: var(--nd-border);
          margin: 15px 0;
        }

        .nd-mini-row {
          display: flex;
          justify-content: space-between;
          padding: 9px 0;
          color: var(--nd-muted);
          font-size: 9px;
        }

        .nd-mini-row strong {
          color: var(--nd-text);
        }

        /* LEADERBOARD */

        .nd-leader-hero {
          min-height: 285px;
          border-radius: 25px;
          padding: 39px;
          background:
            radial-gradient(
              circle at 80% 50%,
              rgba(8,145,178,.14),
              transparent 28%
            ),
            #101828;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
          position: relative;
          margin-bottom: 16px;
        }

        .nd-leader-hero h1 {
          font-size: clamp(38px, 5vw, 59px);
          line-height: .96;
          letter-spacing: -3px;
          margin: 0;
        }

        .nd-leader-hero p {
          color: #b9c3cf;
          font-size: 11px;
          max-width: 470px;
          line-height: 1.6;
        }

        .nd-trophy {
          width: 210px;
          height: 210px;
          border-radius: 50%;
          border: 1px solid rgba(142,231,239,.18);
          color: #8ee7ef;
          display: grid;
          place-items: center;
          margin-right: 60px;
        }

        .nd-ranking-grid {
          display: grid;
          grid-template-columns: 1.25fr .75fr;
          gap: 16px;
        }

        .nd-leader-list {
          display: flex;
          flex-direction: column;
        }

        .nd-leader-row {
          display: grid;
          grid-template-columns: 34px 38px 1fr auto;
          gap: 11px;
          align-items: center;
          padding: 12px 4px;
          border-bottom: 1px solid #eef1f3;
        }

        .nd-leader-row.current {
          background: var(--nd-primary-soft);
          border-radius: 13px;
          padding-left: 9px;
          padding-right: 9px;
        }

        .nd-rank {
          font-size: 10px;
          color: #98a2b3;
          font-weight: 850;
        }

        .nd-leader-name strong,
        .nd-leader-name span {
          display: block;
        }

        .nd-leader-name strong {
          font-size: 11px;
        }

        .nd-leader-name span {
          color: var(--nd-muted);
          font-size: 8px;
          margin-top: 3px;
        }

        .nd-leader-points {
          color: var(--nd-primary-dark);
          font-size: 13px;
        }

        .nd-leader-points small {
          font-size: 7px;
          color: var(--nd-muted);
        }

        .nd-your-rank {
          display: flex;
          flex-direction: column;
        }

        .nd-rank-big {
          font-size: 76px;
          font-weight: 850;
          letter-spacing: -5px;
          margin-top: 20px;
        }

        .nd-rank-big span {
          font-size: 24px;
          color: var(--nd-primary);
        }

        .nd-your-rank p {
          color: var(--nd-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .nd-impact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin: 17px 0;
        }

        .nd-impact-row div {
          background: #f8fafb;
          padding: 13px;
          border-radius: 12px;
        }

        .nd-impact-row strong,
        .nd-impact-row span {
          display: block;
        }

        .nd-impact-row strong {
          font-size: 20px;
        }

        .nd-impact-row span {
          color: var(--nd-muted);
          font-size: 8px;
          margin-top: 3px;
        }

        /* PROFILE */

        .nd-profile-grid {
          display: grid;
          grid-template-columns: .65fr 1.35fr;
          gap: 16px;
        }

        .nd-profile-card {
          background: white;
          border: 1px solid var(--nd-border);
          border-radius: 23px;
          padding: 32px;
          text-align: center;
          box-shadow: var(--nd-shadow);
        }

        .nd-profile-avatar {
          width: 82px;
          height: 82px;
          margin: 0 auto 17px;
          border-radius: 25px;
          background: #dff5f8;
          color: var(--nd-primary-dark);
          display: grid;
          place-items: center;
          font-size: 30px;
          font-weight: 850;
        }

        .nd-profile-card h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -.8px;
        }

        .nd-profile-card > p {
          color: var(--nd-muted);
          font-size: 10px;
        }

        .nd-profile-badge {
          width: fit-content;
          margin: 15px auto 25px;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #16803d;
          background: #eaf8ef;
          padding: 7px 10px;
          border-radius: 99px;
          font-size: 8px;
          font-weight: 800;
        }

        .nd-profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--nd-border);
          padding-top: 20px;
        }

        .nd-profile-stats strong,
        .nd-profile-stats span {
          display: block;
        }

        .nd-profile-stats strong {
          font-size: 18px;
        }

        .nd-profile-stats span {
          color: var(--nd-muted);
          font-size: 8px;
          margin-top: 4px;
        }

        .nd-impact-chart {
          height: 220px;
          display: flex;
          align-items: flex-end;
          gap: 14px;
          padding: 20px 5px;
          border-bottom: 1px solid var(--nd-border);
        }

        .nd-impact-chart > div {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 8px;
        }

        .nd-impact-chart span {
          display: block;
          width: 100%;
          max-width: 32px;
          background: #cdeff3;
          border-radius: 7px 7px 2px 2px;
        }

        .nd-impact-chart div:nth-child(6) span {
          background: var(--nd-primary);
        }

        .nd-impact-chart small {
          color: #98a2b3;
          font-size: 8px;
        }

        .nd-impact-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .nd-impact-summary span,
        .nd-impact-summary strong {
          display: block;
        }

        .nd-impact-summary span {
          color: var(--nd-muted);
          font-size: 8px;
        }

        .nd-impact-summary strong {
          font-size: 14px;
          margin-top: 4px;
        }

        /* MOBILE */

        .nd-sidebar-overlay {
          display: none;
        }

        @media (max-width: 1100px) {
          .nd-hero-grid,
          .nd-content-grid,
          .nd-scan-layout,
          .nd-feed-layout,
          .nd-ranking-grid,
          .nd-profile-grid,
          .nd-map-bottom {
            grid-template-columns: 1fr;
          }

          .nd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .nd-health-card {
            min-height: 220px;
          }

          .nd-hero-orbit {
            opacity: .45;
          }

          .nd-report-department {
            display: none;
          }

          .nd-report-row {
            grid-template-columns: 42px minmax(0,1fr) 90px 20px;
          }
        }

        @media (max-width: 760px) {
          .nd-sidebar {
            transform: translateX(-100%);
            transition: transform .25s ease;
            box-shadow: 20px 0 50px rgba(0,0,0,.12);
          }

          .nd-sidebar.open {
            transform: translateX(0);
          }

          .nd-sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            z-index: 90;
            background: rgba(15,23,42,.25);
            backdrop-filter: blur(2px);
          }

          .nd-mobile-close {
            display: grid;
            place-items: center;
          }

          .nd-main {
            margin-left: 0;
          }

          .nd-topbar {
            padding: 0 16px;
            height: 66px;
          }

          .nd-menu-button {
            display: grid;
            place-items: center;
            margin-right: 10px;
          }

          .nd-breadcrumb {
            font-size: 10px;
          }

          .nd-top-user > div:last-child {
            display: none;
          }

          .nd-page {
            padding: 27px 15px 70px;
          }

          .nd-dashboard-head,
          .nd-page-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .nd-dashboard-head h1,
          .nd-page-heading h1 {
            font-size: 42px;
            letter-spacing: -2px;
          }

          .nd-head-actions {
            width: 100%;
          }

          .nd-head-actions .nd-button {
            flex: 1;
          }

          .nd-hero-card {
            padding: 27px;
            min-height: 340px;
          }

          .nd-hero-orbit {
            right: -65px;
            opacity: .3;
          }

          .nd-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .nd-stat-card {
            padding: 15px;
          }

          .nd-stat-value {
            font-size: 24px;
          }

          .nd-panel {
            padding: 18px;
            border-radius: 18px;
          }

          .nd-map.compact {
            height: 280px;
          }

          .nd-report-row {
            grid-template-columns: 38px minmax(0,1fr) 20px;
            gap: 9px;
          }

          .nd-report-icon {
            width: 38px;
            height: 38px;
          }

          .nd-report-row .nd-badge {
            display: none;
          }

          .nd-scan-layout {
            gap: 12px;
          }

          .nd-upload-panel,
          .nd-analysis-panel {
            min-height: auto;
          }

          .nd-dropzone {
            height: 330px;
          }

          .nd-full-map-card .nd-map {
            height: 430px;
          }

          .nd-filter-row {
            justify-content: flex-start;
          }

          .nd-leader-hero {
            padding: 27px;
            min-height: 330px;
          }

          .nd-trophy {
            position: absolute;
            right: -50px;
            opacity: .25;
          }

          .nd-success-card {
            padding: 30px 20px;
          }

          .nd-success-card h1 {
            font-size: 31px;
          }

          .nd-impact-chart {
            gap: 7px;
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=Quantico:wght@400;700&display=swap');

        .targo-dashboard {
          --targo-bg:#F2F1F0;
          --targo-about:#F7F6F8;
          --targo-accent:#15BCDF;
          --targo-accent-hover:#3fd0ef;
          --targo-border:#0fa3c2;
          --targo-heading:#2b3033;
          --targo-nav:#3a3a3a;
          --targo-body:#6b6f72;
          width:100%;
          overflow:hidden;
          background:var(--targo-bg);
          color:var(--targo-heading);
          font-family:"Quantico","Arial Narrow",Arial,sans-serif;
        }
        .targo-dashboard *{box-sizing:border-box}
        .targo-dashboard a{text-decoration:none}
        .targo-dashboard h1,.targo-dashboard h2{margin:0;text-transform:uppercase;letter-spacing:.01em;line-height:.98}
        .targo-hero{position:relative;min-height:calc(100svh - 76px);background:#F2F1F0;overflow:hidden;isolation:isolate}
        .targo-hero-video{position:absolute;z-index:-3;top:0;right:-20%;width:99%;height:auto;max-width:none;object-fit:contain;object-position:center top;pointer-events:none;display:block}
        .targo-hero-scrim{position:absolute;z-index:-2;inset:0 auto 0 0;width:70%;pointer-events:none;background:linear-gradient(90deg,#F2F1F0 0%,#F2F1F0 55%,rgba(242,241,240,.85) 78%,rgba(242,241,240,0) 100%)}
        .targo-nav{position:relative;z-index:20;display:flex;align-items:center;flex-wrap:wrap;gap:clamp(20px,5vw,56px);padding:clamp(20px,3vw,38px) clamp(20px,4vw,48px) 0}
        .targo-brand{display:inline-flex;align-items:center;gap:13px;flex:0 0 auto}
        .targo-logo{width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:#111;display:grid;place-items:center}
        .targo-logo:before{content:"";width:20px;height:8px;background:#fff;border-radius:999px;transform:rotate(-25deg)}
        .targo-brand-name{font-size:clamp(22px,5vw,30px);font-weight:400;color:#111;letter-spacing:-.5px;line-height:1}
        .targo-links{display:flex;align-items:center;gap:34px;margin-left:clamp(10px,5vw,46px)}
        .targo-links a{font-size:clamp(12px,2.4vw,15px);font-weight:700;letter-spacing:.06em;color:#3a3a3a;white-space:nowrap}
        .targo-contact{margin-left:auto;display:inline-flex;align-items:center;gap:12px;border:0;background:transparent;color:#fff!important;padding:14px 26px;text-transform:uppercase;font:700 clamp(12px,2.2vw,15px)/1 "Quantico","Arial Narrow",Arial,sans-serif;letter-spacing:.14em;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
        .targo-contact:hover{background:rgba(255,255,255,.14)}
        .targo-mail{width:17px;height:13px;flex:0 0 17px}
        .targo-mobile-toggle{display:none;margin-left:auto;width:46px;height:40px;padding:8px;border:0;background:transparent;cursor:pointer}
        .targo-mobile-toggle span{display:block;width:22px;height:2px;margin:0 auto;background:#fff}.targo-mobile-toggle span+span{margin-top:5px}
        .targo-mobile-menu{display:none}
        .targo-hero-copy{position:relative;z-index:2;padding:min(clamp(40px,9vw,120px),9vh) 20px min(clamp(24px,4vw,44px),5vh) clamp(20px,9vw,118px)}
        .targo-hero-title{max-width:900px;font-size:min(clamp(34px,7.6vw,80px),9.2vh);font-weight:700;color:#2b3033}
        .targo-hero-title span{display:block}.targo-hero-title .targo-indent{padding-left:min(238px,28vw)}.targo-hero-title .targo-accent{color:#15BCDF}
        .targo-cta-wrap{padding-left:calc(clamp(20px,9vw,118px) + min(238px,28vw));padding-bottom:min(clamp(36px,6vw,80px),7vh)}
        .targo-button{position:relative;display:inline-flex;align-items:center;gap:18px;border:1px solid #0fa3c2;background:#15BCDF;color:#1a1c1e!important;padding:18px 34px;text-transform:uppercase;font:700 clamp(13px,2.2vw,16px)/1 "Quantico","Arial Narrow",Arial,sans-serif;letter-spacing:.14em;cursor:pointer;clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));box-shadow:0 0 0 1px rgba(21,188,223,.35),0 10px 30px -12px rgba(15,163,194,.6);transition:transform .18s ease,background .18s ease,box-shadow .18s ease}
        .targo-button:after{content:"";width:22px;height:1px;background:#1a1c1e;display:block;margin-left:2px}.targo-button:hover{background:#3fd0ef;transform:translateY(-2px);box-shadow:0 0 0 1px rgba(21,188,223,.55),0 14px 38px -10px rgba(15,163,194,.72)}
        .targo-about{display:flex;flex-wrap:wrap;align-items:center;gap:40px;background:linear-gradient(180deg,#F2F1F0 0%,#F7F6F8 18%,#F7F6F8 100%);padding:clamp(60px,10vw,140px) 0 clamp(30px,5vw,70px) clamp(20px,9vw,118px);overflow:hidden}
        .targo-about-copy{flex:1 1 420px;min-width:300px}.targo-about-title{font-size:clamp(34px,6.5vw,72px);font-weight:700;color:#2b3033}.targo-about-title .targo-indent{display:block;padding-left:min(160px,18vw);color:#15BCDF}
        .targo-about-text{max-width:520px;margin:32px 0 0 min(160px,18vw);font-size:clamp(14px,1.6vw,17px);line-height:1.7;color:#6b6f72}
        .targo-about-button{margin:36px 0 0 min(160px,18vw)}
        .targo-about-media{flex:1 1 360px;min-width:280px;display:flex;justify-content:flex-end;position:relative}.targo-about-video{display:block;width:100%;max-width:644px;height:auto;object-fit:contain}.targo-about-tint{position:absolute;top:0;right:0;width:100%;max-width:644px;height:100%;background:#15BCDF;mix-blend-mode:hue;pointer-events:none;z-index:1}
        @media(max-width:700px){
          .targo-hero{min-height:calc(100svh - 66px)}.targo-hero-video{top:0;left:-12%;right:auto;width:119%}.targo-hero-scrim{display:none}
          .targo-nav{padding:20px}.targo-links,.targo-contact{display:none}.targo-mobile-toggle{display:block}
          .targo-mobile-menu{position:absolute;z-index:50;top:calc(100% + 10px);left:20px;right:20px;display:grid;gap:18px;padding:20px 22px;background:rgba(242,241,240,.97);border:1px solid rgba(58,58,58,.13);box-shadow:0 18px 45px rgba(35,40,43,.12);opacity:0;visibility:hidden;transform:translateY(-8px);transition:.16s ease}
          .targo-mobile-menu.is-open{opacity:1;visibility:visible;transform:translateY(0)}.targo-mobile-menu a{color:#1a1c1e!important;font-size:14px;font-weight:700;letter-spacing:.06em}
          .targo-hero-copy{margin-top:360px;padding:0 20px 28px}.targo-hero-title{font-size:clamp(34px,10vw,56px)}.targo-cta-wrap{padding-left:calc(20px + min(238px,28vw));padding-bottom:36px}
          .targo-button{padding:17px 25px}.targo-about{flex-direction:column;align-items:stretch;gap:50px;padding:70px 0 40px 20px}.targo-about-copy{min-width:0}.targo-about-title{font-size:clamp(34px,10vw,56px)}.targo-about-text{margin-left:min(160px,18vw);max-width:calc(100vw - min(160px,18vw) - 20px)}.targo-about-button{margin-left:min(160px,18vw)}.targo-about-media{width:100%;min-width:0}.targo-about-video,.targo-about-tint{width:100%;max-width:644px}
        }
        @media(max-width:430px){.targo-logo{width:34px;height:34px;flex-basis:34px}.targo-logo:before{width:18px;height:7px}.targo-hero-copy{margin-top:360px}.targo-hero-title{font-size:34px}.targo-hero-title .targo-indent{padding-left:22vw}.targo-cta-wrap{padding-left:calc(20px + 22vw)}.targo-about{padding-left:20px}.targo-about-title{font-size:34px}.targo-about-text,.targo-about-button{margin-left:22vw}.targo-about-text{max-width:calc(100vw - 22vw - 20px)}}
      `}</style>

      <div className="nd-app">
        <Sidebar
          page={page}
          setPage={setPage}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          user={user}
        />

        <main className="nd-main">
          <Topbar
            setOpen={setSidebarOpen}
            user={user}
            setPage={setPage}
          />

          {renderPage()}
        </main>
      </div>
    </>
  )
}