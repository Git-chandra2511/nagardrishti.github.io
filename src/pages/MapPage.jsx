import { Layers3, LocateFixed, Plus, Minus, Filter, Route, ShieldCheck, Timer } from 'lucide-react'
import MapView from '../components/MapView'
import IssueCard from '../components/IssueCard'
import FastRouteMap from '../components/FastRouteMap'
import { useMemo, useState } from 'react'

export default function MapPage({ reports }) {
  const [filter, setFilter] = useState('All')
  const [layers, setLayers] = useState({ wards: false, roads: false })
  const filtered = filter === 'All' ? reports : reports.filter(r => r.category === filter)
  const potholes = useMemo(() => reports.filter(report => report.category === 'Pothole'), [reports])
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
        <MapView reports={filtered} layers={layers} />
        <div className="map-floating">
          <div className="map-layer-control">
            <button><Layers3 size={17} /> Layers</button>
            <label><input type="checkbox" checked={layers.wards} onChange={event => setLayers(current => ({ ...current, wards: event.target.checked }))} /> Ward boundaries <small>Bhuvan / SoI</small></label>
            <label><input type="checkbox" checked={layers.roads} onChange={event => setLayers(current => ({ ...current, roads: event.target.checked }))} /> Road assets <small>PWD / NHAI</small></label>
          </div>
          <button><LocateFixed size={17} /> Locate me</button>
          <div className="zoom"><button><Plus size={17} /></button><button><Minus size={17} /></button></div>
        </div>
      </div>
      <div className="gis-source-strip"><span><Layers3 size={14} /> GIS DATA FUSION</span><small>Citizen reports + Bhuvan / Survey of India boundary adapters + PWD / NHAI road asset adapters</small><em>Demo adapters • replace with official GeoJSON/API feeds</em></div>
      <section className="fast-route-section">
        <div className="fast-route-heading">
          <div><span className="eyebrow"><Route size={14} /> POTHOLE-AWARE ROUTING</span><h2>Find a faster, smoother route</h2><p>Compare route distance and nearby pothole signals before you leave.</p></div>
          <div className="fast-route-note"><ShieldCheck size={16} /> Uses verified civic reports</div>
        </div>
        <FastRouteMap potholes={potholes} />
      </section>
      <div className="map-results">
        <div className="panel-head"><div><span className="panel-kicker">{filtered.length} SIGNALS</span><h2>Visible reports</h2></div></div>
        <div className="issue-grid">{filtered.map(r => <IssueCard key={r.id} report={r} />)}</div>
      </div>
    </div>
  )
}
