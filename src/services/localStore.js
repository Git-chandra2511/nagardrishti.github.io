import { normalizeIssue } from './issueService'

const REPORT_KEY = 'nagar_drishti_reports_v1'
const USER_KEY = 'nagar_drishti_user_v1'
const DEMO_REPORT_IDS = new Set(['ND-1039', 'ND-1040', 'ND-1041', 'ND-1042'])
export function getReports() {
  try {
    const saved = localStorage.getItem(REPORT_KEY)
    const reports = saved ? JSON.parse(saved).filter(report => !DEMO_REPORT_IDS.has(report.id)) : []
    return reports.map((report, index) => normalizeIssue(report, index))
  } catch {
    return []
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
