import { useEffect, useRef } from 'react'

export default function Nagar3D() {
  const sceneRef = useRef(null)

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const handleMove = (e) => {
      const rect = scene.getBoundingClientRect()

      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      scene.style.setProperty('--mx', `${x * 18}deg`)
      scene.style.setProperty('--my', `${y * -14}deg`)
    }

    const handleLeave = () => {
      scene.style.setProperty('--mx', '0deg')
      scene.style.setProperty('--my', '0deg')
    }

    scene.addEventListener('mousemove', handleMove)
    scene.addEventListener('mouseleave', handleLeave)

    return () => {
      scene.removeEventListener('mousemove', handleMove)
      scene.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  const nodes = [
    { x: '18%', y: '25%', delay: '0s' },
    { x: '38%', y: '15%', delay: '.7s' },
    { x: '62%', y: '23%', delay: '1.4s' },
    { x: '80%', y: '35%', delay: '2.1s' },
    { x: '27%', y: '58%', delay: '1.1s' },
    { x: '52%', y: '52%', delay: '.3s' },
    { x: '73%', y: '65%', delay: '1.8s' },
    { x: '42%', y: '78%', delay: '2.5s' },
  ]

  return (
    <div className="nd3d-wrap">
      <div className="nd3d-grid" />

      <div className="nd3d-scene" ref={sceneRef}>
        {/* CITY PLATFORM */}
        <div className="nd3d-platform">
          <div className="nd3d-ring ring-one" />
          <div className="nd3d-ring ring-two" />
          <div className="nd3d-ring ring-three" />

          <div className="nd3d-city">
            <div className="building b1" />
            <div className="building b2" />
            <div className="building b3" />
            <div className="building b4" />
            <div className="building b5" />
            <div className="building b6" />
            <div className="building b7" />
          </div>

          {/* AI CORE */}
          <div className="nd3d-core">
            <div className="core-ring" />
            <div className="core-ring second" />
            <div className="core-dot">
              AI
            </div>
          </div>

          {/* CONNECTIONS */}
          <div className="connection c1" />
          <div className="connection c2" />
          <div className="connection c3" />
          <div className="connection c4" />
          <div className="connection c5" />
          <div className="connection c6" />

          {/* NETWORK NODES */}
          {nodes.map((node, index) => (
            <div
              key={index}
              className="nd3d-node"
              style={{
                left: node.x,
                top: node.y,
                animationDelay: node.delay,
              }}
            >
              <span />
            </div>
          ))}
        </div>

        {/* FLOATING ISSUE CARDS */}

        <div className="nd3d-card issue-card-one">
          <div className="mini-icon">!</div>
          <div>
            <strong>Pothole detected</strong>
            <small>AI confidence 96%</small>
          </div>
        </div>

        <div className="nd3d-card issue-card-two">
          <div className="mini-icon">✓</div>
          <div>
            <strong>Issue verified</strong>
            <small>+10 Nagar Points</small>
          </div>
        </div>

        <div className="nd3d-card issue-card-three">
          <div className="mini-icon">⌁</div>
          <div>
            <strong>Smart routing</strong>
            <small>Assigned to PWD</small>
          </div>
        </div>

        {/* STATUS */}
        <div className="nd3d-status">
          <span className="live-dot" />
          <span>LIVE CIVIC NETWORK</span>
          <b>ONLINE</b>
        </div>
      </div>
    </div>
  )
}