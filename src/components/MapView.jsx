import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Polyline } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'

const WARD_BOUNDARIES = [
  { name: 'Ward 12 - Civil Lines', points: [[31.258, 75.697], [31.265, 75.704], [31.262, 75.714], [31.254, 75.708]] },
  { name: 'Ward 07 - Green Park', points: [[31.247, 75.698], [31.254, 75.708], [31.246, 75.718], [31.239, 75.709]] },
]

const ROAD_ASSETS = [
  { name: 'PWD corridor A-17', status: 'Maintenance due', points: [[31.2498, 75.6958], [31.2520, 75.6995], [31.2558, 75.7018], [31.2587, 75.7062]] },
  { name: 'NHAI connector NH-44', status: 'Monitored', points: [[31.239, 75.709], [31.246, 75.706], [31.254, 75.704], [31.263, 75.710]] },
]

export default function MapView({ reports, height = '100%', layers = {} }) {
  const navigate = useNavigate()
  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={[31.2548, 75.7042]} zoom={16} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
        {reports.map(report => (
          <CircleMarker
            key={report.id}
            center={[report.lat, report.lng]}
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
        ))}
      </MapContainer>
      <div className="map-legend">
        <span><i className="dot high" /> High priority</span>
        <span><i className="dot normal" /> Verified issue</span>
      </div>
    </div>
  )
}
