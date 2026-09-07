import { normalizeIssue } from './issueService'

const REPORT_KEY = 'nagar_drishti_reports_v1'
const USER_KEY = 'nagar_drishti_user_v1'
const seedReports = [
  {
    id: 'ND-1042',
    category: 'Pothole',
    department: 'PWD',
    status: 'In Progress',
    priority: 'High',
    lat: 31.2547,
    lng: 75.7038,
    address: 'LPU Main Gate Road',
    confidence: 94,
    verified: true,
    points: 10,
    createdAt: Date.now() - 1000 * 60 * 28,
    reporter: 'Aarav',
  },
  {
    id: 'ND-1041',
    category: 'Garbage',
    department: 'Municipal Corporation',
    status: 'Verified',
    priority: 'Medium',
    lat: 31.2533,
    lng: 75.7051,
    address: 'University Market',
    confidence: 91,
    verified: true,
    points: 10,
    createdAt: Date.now() - 1000 * 60 * 65,
    reporter: 'Priya',
  },
  {
    id: 'ND-1040',
    category: 'Streetlight',
    department: 'Electricity Board',
    status: 'Pending',
    priority: 'Medium',
    lat: 31.256,
    lng: 75.7019,
    address: 'North Campus Road',
    confidence: 88,
    verified: true,
    points: 10,
    createdAt: Date.now() - 1000 * 60 * 130,
    reporter: 'Rohan',
  },
  {
    id: 'ND-1039',
    category: 'Waterlogging',
    department: 'Drainage Department',
    status: 'Resolved',
    priority: 'High',
    lat: 31.2525,
    lng: 75.7064,
    address: 'Hostel Block 34',
    confidence: 96,
    verified: true,
    points: 10,
    createdAt: Date.now() - 1000 * 60 * 190,
    reporter: 'Neha',
  },
]

export function getReports() {
  try {
    const saved = localStorage.getItem(REPORT_KEY)
    const reports = saved ? JSON.parse(saved) : seedReports
    return reports.map((report, index) => normalizeIssue(report, index))
  } catch {
    return seedReports.map((report, index) => normalizeIssue(report, index))
  }
}

export function saveReports(reports) {
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports))
}

export function getUser() {
  try {
    const saved = localStorage.getItem(USER_KEY)
    return saved
      ? JSON.parse(saved)
      : { name: 'Citizen', email: 'citizen@nagar.local', points: 120, reports: 3 }
  } catch {
    return { name: 'Citizen', email: 'citizen@nagar.local', points: 120, reports: 3 }
  }
}

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
