import { useEffect, useRef, useState } from 'react'

export default function CityModel() {
  const panelRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [modelViewerReady, setModelViewerReady] = useState(false)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px' })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return undefined
    let active = true
    import('@google/model-viewer').then(() => {
      if (active) setModelViewerReady(true)
    })
    return () => {
      active = false
    }
  }, [visible])

  return (
    <section ref={panelRef} className="city-model-panel panel" aria-label="Interactive 3D city model">
      <div className="panel-head">
        <div>
          <span className="panel-kicker">DIGITAL AREA MODEL</span>
          <h2>Explore the civic landscape</h2>
        </div>
        <span className="model-hint">Drag to rotate</span>
      </div>
      <div className="city-model-stage">
        {modelViewerReady ? (
          <model-viewer
            src="/city2hackthon.glb"
            alt="Interactive 3D model of the city area"
            camera-controls
            auto-rotate
            shadow-intensity="0.7"
            exposure="1"
            environment-image="neutral"
          />
        ) : (
          <div className="model-loading">Loading area model…</div>
        )}
      </div>
    </section>
  )
}
