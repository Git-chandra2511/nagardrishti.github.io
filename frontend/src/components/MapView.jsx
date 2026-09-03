import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'

export default function MapView({ reports, height = '100%' }) {
  const navigate = useNavigate()
  return (
    <div className="map-wrap" style={{ height }}>
      <MapContainer center={[31.2548, 75.7042]} zoom={16} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
              <button className="popup-link" onClick={() => navigate('/map')}>View civic map</button>
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
