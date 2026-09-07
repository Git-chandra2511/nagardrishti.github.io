import { Link } from 'react-router-dom'
import { ClipboardList, Filter, Search } from 'lucide-react'
import IssueCard from '../components/IssueCard'

export default function IssuesPage({ reports, mineOnly = false }) {
  const visible = mineOnly ? reports.filter(report => report.reporter === 'You') : reports
  return (
    <div className="page narrow-page">
      <div className="section-heading">
        <div className="eyebrow"><ClipboardList size={14} /> ISSUE OPERATIONS</div>
        <h1>{mineOnly ? 'My reports' : 'All civic issues'}</h1>
        <p>{mineOnly ? 'Track every issue you have reported and its current workflow state.' : 'A searchable view of the civic signals currently in the system.'}</p>
      </div>
      <div className="issue-toolbar panel">
        <label><Search size={15} /><input placeholder="Search by category or address" /></label>
        <button className="secondary-btn"><Filter size={15} /> Filters</button>
      </div>
      <div className="feed-main issue-collection">
        {visible.length ? visible.map(report => <Link key={report.issueId || report.id} to={`/issues/${report.issueId || report.id}`}><IssueCard report={report} /></Link>) : <div className="panel empty-state">No reports found yet. <Link to="/scan">Create the first report.</Link></div>}
      </div>
    </div>
  )
}
