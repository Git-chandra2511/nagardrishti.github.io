import '@google/model-viewer'

export default function CityModel() {
  return (
    <section className="city-model-panel panel" aria-label="Interactive 3D city model">
      <div className="panel-head">
        <div>
          <span className="panel-kicker">DIGITAL AREA MODEL</span>
          <h2>Explore the civic landscape</h2>
        </div>
        <span className="model-hint">Drag to rotate</span>
      </div>
      <div className="city-model-stage">
        <model-viewer
          src="/city2hackthon.glb"
          alt="Interactive 3D model of the city area"
          camera-controls
          auto-rotate
          shadow-intensity="0.7"
          exposure="1"
          environment-image="neutral"
        />
      </div>
    </section>
  )
}
