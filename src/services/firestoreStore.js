import {
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from 'firebase/firestore'
import { db, firebaseEnabled } from './firebase'
import { normalizeIssue } from './issueService'

const issuesCollection = () => collection(db, 'issues')

export async function fetchRemoteReports() {
  if (!firebaseEnabled || !db) return null

  const snapshot = await getDocs(query(issuesCollection(), orderBy('createdAt', 'desc')))
  return snapshot.docs.map((item, index) => normalizeIssue({
    ...item.data(),
    id: item.id,
    issueId: item.data().issueId || item.id,
    createdAt: item.data().createdAt?.toMillis?.() || item.data().createdAt || Date.now(),
  }, index))
}

export async function saveRemoteReport(report) {
  if (!firebaseEnabled || !db) return null

  const issueId = report.issueId || report.id
  const payload = {
    ...report,
    createdAt: report.createdAt || Date.now(),
    updatedAt: serverTimestamp(),
  }
  await setDoc(doc(db, 'issues', issueId), payload, { merge: true })
  return issueId
}

export async function seedRemoteReports(reports) {
  if (!firebaseEnabled || !db) return
  const existing = await fetchRemoteReports()
  if (existing?.length) return
  await Promise.all(reports.map(report => saveRemoteReport(report)))
}
