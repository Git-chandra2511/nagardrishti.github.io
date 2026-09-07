import { DEPARTMENT_MAP } from '../utils/civic'

export const ISSUE_STATUSES = ['reported', 'assigned', 'in_progress', 'resolved', 'reopened', 'rejected']

const SLA_HOURS = {
  Garbage: 12,
  Streetlight: 24,
  Pothole: 24,
  Waterlogging: 12,
}

export function issueIdFor(index = 0) {
  return `ND-${new Date().getFullYear()}-${String(1 + index).padStart(6, '0')}`
}

export function normalizeIssue(report, index = 0) {
  const category = report.category || 'Other'
  const confidence = Number(report.confidence || 0)
  const status = report.status === 'In Progress' ? 'in_progress' : report.status === 'Resolved' ? 'resolved' : report.status === 'Pending' ? 'reported' : 'assigned'
  const createdAt = report.createdAt || Date.now()

  return {
    ...report,
    issueId: report.issueId || report.id || issueIdFor(index),
    title: report.title || `${category} reported near ${report.address || 'your area'}`,
    description: report.description || '',
    category,
    department: report.department || DEPARTMENT_MAP[category] || 'Municipal Corporation',
    status: report.status || 'Pending',
    workflowStatus: report.workflowStatus || status,
    ai: {
      category,
      confidence: confidence > 1 ? confidence / 100 : confidence,
      priority: report.priority || 'Medium',
      severity: report.severity || (report.priority === 'High' ? 8 : 5),
      model: report.ai?.model || 'local-mock',
    },
    location: {
      latitude: report.location?.latitude ?? report.lat,
      longitude: report.location?.longitude ?? report.lng,
      address: report.location?.address || report.address || 'Location not provided',
    },
    resolution: report.resolution || { image: null, note: null, resolvedAt: null },
    duplicateClusterId: report.duplicateClusterId || null,
    swachhata: report.swachhata || { eligible: category === 'Garbage', syncStatus: 'NOT_SYNCED', complaintId: null, lastSyncAt: null },
    sla: {
      hours: report.sla?.hours || SLA_HOURS[category] || 48,
      dueAt: report.sla?.dueAt || createdAt + (SLA_HOURS[category] || 48) * 60 * 60 * 1000,
    },
    createdAt,
    updatedAt: report.updatedAt || createdAt,
  }
}

export function findPossibleDuplicates(issue, reports) {
  const lat = issue.location?.latitude ?? issue.lat
  const lng = issue.location?.longitude ?? issue.lng
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return []

  return reports.filter(candidate => {
    if (candidate.issueId === issue.issueId || candidate.id === issue.id) return false
    const candidateLat = candidate.location?.latitude ?? candidate.lat
    const candidateLng = candidate.location?.longitude ?? candidate.lng
    if (candidate.category !== issue.category || !Number.isFinite(candidateLat) || !Number.isFinite(candidateLng)) return false
    return Math.hypot((candidateLat - lat) * 111, (candidateLng - lng) * 96) < 0.25
  })
}

export function getSlaState(issue) {
  if (issue.workflowStatus === 'resolved' || issue.workflowStatus === 'rejected') return 'complete'
  const dueAt = issue.sla?.dueAt || 0
  return dueAt && dueAt < Date.now() ? 'overdue' : 'on_track'
}
