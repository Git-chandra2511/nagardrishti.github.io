import { MapContainer, Polyline, TileLayer, CircleMarker, useMap } from 'react-leaflet'
import { CheckCircle2, Clock3, Gauge, MapPin, Route, Search, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const ROUTES = [
  {
    id: 'smoothest',
    name: 'Smoothest route',
    tone: 'green',
    points: [[31.2498, 75.6958], [31.2520, 75.6995], [31.2558, 75.7018], [31.2587, 75.7062], [31.2610, 75.7100]],
    distance: 3.8,
    minutes: 9,
  },
  {
    id: 'balanced',
    name: 'Balanced route',
    tone: 'blue',
    points: [[31.2498, 75.6958], [31.2508, 75.7015], [31.2548, 75.7042], [31.2580, 75.7088], [31.2610, 75.7100]],
    distance: 3.4,
    minutes: 8,
  },
  {
    id: 'fastest',
    name: 'Fastest route',
    tone: 'amber',
    points: [[31.2498, 75.6958], [31.2538, 75.6987], [31.2560, 75.7048], [31.2594, 75.7070], [31.2610, 75.7100]],
    distance: 3.1,
    minutes: 7,
  },
]

export default function FastRouteMap({ potholes }) {
  const [selectedId, setSelectedId] = useState('smoothest')
  const [liveRoutes, setLiveRoutes] = useState(null)
  const [routeError, setRouteError] = useState('')
  const [destinationText, setDestinationText] = useState('City centre')
  const [destination, setDestination] = useState({ label: 'City centre', coordinates: [75.7100, 31.2610] })
  const [origin, setOrigin] = useState({ label: 'Jalandhar fallback location', coordinates: [75.6958, 31.2498] })
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      position => setOrigin({
        label: 'Current location',
        coordinates: [position.coords.longitude, position.coords.latitude],
      }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${origin.coordinates[0]},${origin.coordinates[1]};${destination.coordinates[0]},${destination.coordinates[1]}?alternatives=true&steps=true&overview=full&geometries=geojson`

    setRouteError('')
    setIsLoadingRoutes(true)
    fetch(routeUrl, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Routing service returned ${response.status}`)
        return response.json()
      })
      .then(data => {
        if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No live routes were found')
        setLiveRoutes(data.routes.slice(0, 3).map((route, index) => ({
          id: `live-${index}`,
          tone: index === 0 ? 'green' : index === 1 ? 'blue' : 'amber',
          points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
          distance: route.distance / 1000,
          minutes: Math.max(1, Math.round(route.duration / 60)),
          steps: route.legs?.flatMap(leg => leg.steps || []).map(step => step.maneuver?.instruction || step.name).filter(Boolean).slice(0, 4) || [],
        })))
        setRouteError('')
      })
      .catch(error => {
        if (error.name !== 'AbortError') setRouteError('Live routes unavailable. Showing civic route estimates.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoadingRoutes(false)
      })

    return () => controller.abort()
  }, [destination, origin])

  const fallbackRoutes = useMemo(() => {
    const start = [origin.coordinates[1], origin.coordinates[0]]
    const end = [destination.coordinates[1], destination.coordinates[0]]
    const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2]
    return [
      { ...ROUTES[0], points: [start, [midpoint[0] + 0.002, midpoint[1] - 0.001], end] },
      { ...ROUTES[1], points: [start, [midpoint[0] - 0.001, midpoint[1] + 0.002], end] },
      { ...ROUTES[2], points: [start, midpoint, end] },
    ]
  }, [origin, destination])

  const routeStats = useMemo(() => {
    const routes = liveRoutes || fallbackRoutes
    const withRisk = routes.map(route => {
    const nearby = potholes.filter(report => route.points.some(point => distanceKm(point, [report.lat, report.lng]) < 0.45)).length
    return { ...route, potholes: nearby }
    })
    if (!withRisk.length) return []
    const fastest = [...withRisk].sort((a, b) => a.minutes - b.minutes)[0]
    const smoothest = [...withRisk].sort((a, b) => a.potholes - b.potholes || a.minutes - b.minutes)[0]
    const balanced = [...withRisk].sort((a, b) => (a.minutes + a.potholes * 2) - (b.minutes + b.potholes * 2))[0]
    const ordered = [
      { ...fastest, id: 'fastest', name: 'Fastest route', tone: 'amber' },
      { ...smoothest, id: 'smoothest', name: 'Smoothest route', tone: 'green' },
      { ...balanced, id: 'balanced', name: 'Balanced route', tone: 'blue' },
    ]
    return ordered.filter((route, index, all) => all.findIndex(candidate => candidate.points.length === route.points.length && candidate.points[0]?.join(',') === route.points[0]?.join(',')) === index)
  }, [potholes, liveRoutes, fallbackRoutes])

  const selected = routeStats.find(route => route.id === selectedId) || routeStats[0]

  useEffect(() => {
    if (selected) setSelectedId(selected.id)
  }, [destination])

  async function searchDestination(event) {
    event.preventDefault()
    const query = destinationText.trim()
    if (!query) return
    setIsSearching(true)
    setRouteError('')
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error(`Search returned ${response.status}`)
      const results = await response.json()
      if (!results.length) throw new Error('Destination not found')
      setDestination({ label: results[0].display_name.split(',').slice(0, 2).join(', '), coordinates: [Number(results[0].lon), Number(results[0].lat)] })
      setLiveRoutes(null)
    } catch (error) {
      setRouteError(error.message === 'Destination not found' ? 'Destination not found. Try a nearby landmark or city name.' : 'Destination search is unavailable right now.')
    } finally {
      setIsSearching(false)
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setRouteError('Location is not supported by this browser.')
      return
    }
    setRouteError('')
    navigator.geolocation.getCurrentPosition(
      position => setOrigin({
        label: 'Current location',
        coordinates: [position.coords.longitude, position.coords.latitude],
      }),
      () => setRouteError('Location permission was denied. Using the fallback origin.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  return (
    <div className="fast-route-grid">
      <div className="fast-route-map">
        <MapContainer key={`${origin.coordinates.join(',')}-${destination.coordinates.join(',')}`} center={[destination.coordinates[1], destination.coordinates[0]]} zoom={14} scrollWheelZoom={false}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <RouteBounds routes={routeStats} />
          {routeStats.map(route => <Polyline key={route.id} positions={route.points} pathOptions={{ color: route.id === selectedId ? '#168447' : '#a5b7ad', weight: route.id === selectedId ? 6 : 3, opacity: route.id === selectedId ? 0.95 : 0.5, dashArray: route.id === selectedId ? undefined : '7 8' }} />)}
          {potholes.map(report => <CircleMarker key={report.id} center={[report.lat, report.lng]} radius={6} pathOptions={{ color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.9, weight: 2 }} />)}
        </MapContainer>
        <div className="fast-route-map-legend"><span><i className="route-dot smooth" /> Selected route</span><span><i className="route-dot pothole" /> Pothole signal</span></div>
      </div>
      <div className="route-options">
        <form className="route-inputs" onSubmit={searchDestination}><div><label>FROM</label><button type="button" className="route-origin" onClick={useCurrentLocation}><MapPin size={12} /> {origin.label}</button></div><span>→</span><div className="destination-field"><label htmlFor="route-destination">TO</label><input id="route-destination" value={destinationText} onChange={event => setDestinationText(event.target.value)} placeholder="Enter destination" /></div><button type="submit" aria-label="Find routes" disabled={isSearching}>{isSearching ? '...' : <Search size={16} />}</button></form>
        <div className="route-options-head"><span>{potholes.length} pothole signals in this area</span><span>{isLoadingRoutes ? 'Finding live routes...' : liveRoutes ? 'Live OSRM route' : 'Estimated routes'}</span></div>
        {routeError && <div className="route-service-note"><ShieldAlert size={13} /> {routeError}</div>}
        {routeStats.map(route => <button type="button" key={route.id} className={`route-option ${route.id === selectedId ? 'selected' : ''}`} onClick={() => setSelectedId(route.id)}><span className={`route-icon ${route.tone}`}><Route size={16} /></span><span className="route-option-main"><strong>{route.name}</strong><small><Clock3 size={12} /> {route.minutes} min <span>•</span> {route.distance.toFixed(1)} km</small></span><span className={`route-risk ${route.potholes === 0 ? 'low' : route.potholes < 3 ? 'medium' : 'high'}`}><ShieldAlert size={12} /> {route.potholes} pothole{route.potholes === 1 ? '' : 's'}</span>{route.id === selectedId && <CheckCircle2 className="route-check" size={17} />}</button>)}
        {selected && <div className="route-summary"><Gauge size={16} /><span><strong>{selected.name}</strong> to <b>{destination.label}</b> with <b>{selected.potholes} nearby pothole signals</b>.{selected.steps?.length ? <small className="route-steps">{selected.steps.join(' • ')}</small> : null}</span></div>}
      </div>
    </div>
  )
}

function RouteBounds({ routes }) {
  const map = useMap()

  useEffect(() => {
    const points = routes.flatMap(route => route.points)
    if (points.length) map.fitBounds(points, { padding: [24, 24] })
  }, [map, routes])

  return null
}

function distanceKm([latA, lngA], [latB, lngB]) {
  const earthRadius = 6371
  const latDelta = (latB - latA) * Math.PI / 180
  const lngDelta = (lngB - lngA) * Math.PI / 180
  const value = Math.sin(latDelta / 2) ** 2 + Math.cos(latA * Math.PI / 180) * Math.cos(latB * Math.PI / 180) * Math.sin(lngDelta / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}
