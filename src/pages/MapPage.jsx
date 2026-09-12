import { Layers3, LocateFixed, Plus, Minus, Filter, Route, ShieldCheck } from 'lucide-react'
import MapView from '../components/MapView'
import IssueCard from '../components/IssueCard'
import FastRouteMap from '../components/FastRouteMap'
import { useCallback, useEffect, useMemo, useState } from 'react'

export default function MapPage({ reports }) {
  const [filter, setFilter] = useState('All')
  const [layers, setLayers] = useState({ wards: false, roads: false })
  const [currentPosition, setCurrentPosition] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [mapActions, setMapActions] = useState({})
  const filtered = filter === 'All' ? reports : reports.filter(r => r.category === filter)
  const potholes = useMemo(() => reports.filter(report => report.category === 'Pothole'), [reports])

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('GPS is not supported by this browser.')
      return undefined
    }
    const watchId = navigator.geolocation.watchPosition(
      position => {
        setCurrentPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocationError('')
      },
      error => setLocationError(error.code === 1 ? 'Allow location access to show your live GPS position.' : 'GPS signal is unavailable.'),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  const registerMapActions = useCallback((actions) => {
    setMapActions(current => current.zoomIn === actions.zoomIn ? current : actions)
  }, [])

  return (
    <div className="page map-page">
      <div className="map-toolbar">
        <div><span className="eyebrow">CITY INTELLIGENCE</span><h1>Every report has a place.</h1></div>
        <div className="filter-row">
          <Filter size={15} />
          {['All', 'Pothole', 'Garbage', 'Streetlight', 'Waterlogging', 'Hospital', 'Traffic Police', 'Narcotics', 'Fire'].map(item => (
            <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      </div>
      <div className="full-map-card">
        <MapView reports={filtered} layers={layers} currentPosition={currentPosition} centerOnLocation={mapActions.centerOnLocation} zoomIn={mapActions.zoomIn} zoomOut={mapActions.zoomOut} onMapReady={registerMapActions} />
        <div className="map-floating">
          <div className="map-layer-control">
            <button><Layers3 size={17} /> Layers</button>
            <label><input type="checkbox" checked={layers.wards} onChange={event => setLayers(current => ({ ...current, wards: event.target.checked }))} /> Ward boundaries <small>Bhuvan / SoI</small></label>
            <label><input type="checkbox" checked={layers.roads} onChange={event => setLayers(current => ({ ...current, roads: event.target.checked }))} /> Road assets <small>PWD / NHAI</small></label>
          </div>
          <button type="button" onClick={mapActions.centerOnLocation} disabled={!currentPosition}><LocateFixed size={17} /> {currentPosition ? 'Locate me' : 'Waiting for GPS'}</button>
          {locationError && <small className="map-location-error">{locationError}</small>}
          <div className="zoom"><button type="button" onClick={mapActions.zoomIn}><Plus size={17} /></button><button type="button" onClick={mapActions.zoomOut}><Minus size={17} /></button></div>
        </div>
      </div>
      <div className="gis-source-strip"><span><Layers3 size={14} /> GIS DATA FUSION</span><small>Citizen reports + Bhuvan / Survey of India boundary adapters + PWD / NHAI road asset adapters</small><em>Demo adapters • replace with official GeoJSON/API feeds</em></div>
      <section className="fast-route-section">
        <div className="fast-route-heading">
          <div><span className="eyebrow"><Route size={14} /> ROAD-NETWORK ROUTING</span><h2>Find a faster, smoother route</h2><p>Compare live road-network distance and nearby pothole signals before you leave.</p></div>
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
