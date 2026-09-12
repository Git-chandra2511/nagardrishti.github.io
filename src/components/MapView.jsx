import { MapContainer, TileLayer, Circle, CircleMarker, Popup, Polygon, Polyline, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LocateFixed, Minus, Plus } from 'lucide-react'

const WARD_BOUNDARIES = [
  { name: 'Ward 12 - Civil Lines', points: [[31.258, 75.697], [31.265, 75.704], [31.262, 75.714], [31.254, 75.708]] },
  { name: 'Ward 07 - Green Park', points: [[31.247, 75.698], [31.254, 75.708], [31.246, 75.718], [31.239, 75.709]] },
]

const ROAD_ASSETS = [
  { name: 'PWD corridor A-17', status: 'Maintenance due', points: [[31.2498, 75.6958], [31.2520, 75.6995], [31.2558, 75.7018], [31.2587, 75.7062]] },
  { name: 'NHAI connector NH-44', status: 'Monitored', points: [[31.239, 75.709], [31.246, 75.706], [31.254, 75.704], [31.263, 75.710]] },
]

export default function MapView({ reports, height = '100%', layers = {}, currentPosition, centerOnLocation, zoomIn, zoomOut, onMapReady }) {
  const navigate = useNavigate()
  const reportPosition = report => [
    report.location?.latitude ?? report.lat,
    report.location?.longitude ?? report.lng,
  ]
  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={[31.2548, 75.7042]} zoom={16} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewportController currentPosition={currentPosition} />
        <MapControls onMapReady={onMapReady} currentPosition={currentPosition} />
        {layers.wards && WARD_BOUNDARIES.map(ward => (
          <Polygon key={ward.name} positions={ward.points} pathOptions={{ color: '#168447', fillColor: '#8bd49b', fillOpacity: 0.12, weight: 2, dashArray: '5 5' }}>
            <Popup><strong>{ward.name}</strong><br />Boundary adapter • Survey of India / Bhuvan-ready layer</Popup>
          </Polygon>
        ))}
        {layers.roads && ROAD_ASSETS.map(asset => (
          <Polyline key={asset.name} positions={asset.points} pathOptions={{ color: asset.status === 'Maintenance due' ? '#d97706' : '#2775af', weight: 5, opacity: 0.85 }}>
            <Popup><strong>{asset.name}</strong><br />Status: {asset.status}<br />Road asset adapter • PWD / NHAI-ready layer</Popup>
          </Polyline>
        ))}
        {reports.map(report => {
          const position = reportPosition(report)
          if (!Number.isFinite(position[0]) || !Number.isFinite(position[1])) return null
          return (
            <CircleMarker
              key={report.id}
              center={position}
              radius={9}
              pathOptions={{
                color: report.priority === 'High' ? '#ff5d73' : '#16d7c2',
                fillColor: report.priority === 'High' ? '#ff5d73' : '#16d7c2',
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <strong>{report.category}</strong><br />
                {report.address}<br />
                <button className="popup-link" onClick={() => navigate(`/issues/${report.issueId || report.id}`)}>View issue</button>
              </Popup>
            </CircleMarker>
          )
        })}
        {currentPosition && (
          <>
            <Circle
              center={[currentPosition.latitude, currentPosition.longitude]}
              radius={currentPosition.accuracy}
              pathOptions={{ color: '#60a5fa', fillColor: '#60a5fa', fillOpacity: 0.12, weight: 1 }}
            />
            <CircleMarker
              center={[currentPosition.latitude, currentPosition.longitude]}
              radius={8}
              pathOptions={{ color: '#2563eb', fillColor: '#60a5fa', fillOpacity: 1, weight: 3 }}
            >
              <Popup><strong>Your current location</strong><br />GPS accuracy: {Math.round(currentPosition.accuracy)} m</Popup>
            </CircleMarker>
          </>
        )}
      </MapContainer>
      <div className="map-control-buttons">
        <button type="button" onClick={centerOnLocation} disabled={!currentPosition} aria-label="Center map on current location"><LocateFixed size={16} /></button>
        <button type="button" onClick={zoomIn} aria-label="Zoom in"><Plus size={16} /></button>
        <button type="button" onClick={zoomOut} aria-label="Zoom out"><Minus size={16} /></button>
      </div>
      <div className="map-legend">
        <span><i className="dot high" /> High priority</span>
        <span><i className="dot normal" /> Verified issue</span>
        {currentPosition && <span><i className="dot current" /> Your GPS</span>}
      </div>
    </div>
  )
}

function MapViewportController({ currentPosition }) {
  const map = useMap()

  useEffect(() => {
    if (currentPosition) map.setView([currentPosition.latitude, currentPosition.longitude], Math.max(map.getZoom(), 16))
  }, [currentPosition, map])

  return null
}

function MapControls({ onMapReady, currentPosition }) {
  const map = useMap()

  useEffect(() => {
    if (!onMapReady) return undefined
    onMapReady({
      centerOnLocation: () => currentPosition && map.setView([currentPosition.latitude, currentPosition.longitude], Math.max(map.getZoom(), 16)),
      zoomIn: () => map.zoomIn(),
      zoomOut: () => map.zoomOut(),
    })
    return undefined
  }, [map, onMapReady, currentPosition])

  return null
}
