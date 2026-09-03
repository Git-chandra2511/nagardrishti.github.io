import { Layers3, LocateFixed, Plus, Minus, Filter } from 'lucide-react'
import MapView from '../components/MapView'
import IssueCard from '../components/IssueCard'
import { useState } from 'react'

export default function MapPage({ reports }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? reports : reports.filter(r => r.category === filter)
  return (
    <div className="page map-page">
      <div className="map-toolbar">
        <div><span className="eyebrow">CITY INTELLIGENCE</span><h1>Every report has a place.</h1></div>
        <div className="filter-row">
          <Filter size={15} />
          {['All', 'Pothole', 'Garbage', 'Streetlight', 'Waterlogging'].map(item => (
            <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="full-map-card">
        <MapView reports={filtered} />
        <div className="map-floating">
          <button><Layers3 size={17} /> Layers</button>
          <button><LocateFixed size={17} /> Locate me</button>
          <div className="zoom"><button><Plus size={17} /></button><button><Minus size={17} /></button></div>
        </div>
      </div>
      <div className="map-results">
        <div className="panel-head"><div><span className="panel-kicker">{filtered.length} SIGNALS</span><h2>Visible reports</h2></div></div>
        <div className="issue-grid">{filtered.map(r => <IssueCard key={r.id} report={r} />)}</div>
      </div>
    </div>
  )
}
