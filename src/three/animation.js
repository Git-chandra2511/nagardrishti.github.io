import * as THREE from 'three'

export function createAnimation(model, camera, renderer, scene) {
  const clock = new THREE.Clock()
  const target = new THREE.Vector2()
  const current = new THREE.Vector2()
  const baseRotation = { x: 0, y: 0 }
  let frameId
  let running = true

  function render() {
    if (!running) return
    const elapsed = clock.getElapsedTime()
    current.lerp(target, 0.045)
    model.rotation.x = baseRotation.x + current.y * 0.045
    model.rotation.y = baseRotation.y + current.x * 0.045
    model.rotation.z = current.x * 0.02
    model.position.x = current.x * 0.07
    model.position.y = -0.2 + current.y * 0.04 + Math.sin(elapsed * 0.7) * 0.018
    camera.position.x = current.x * 0.08
    camera.lookAt(0, 0.1, 0)
    renderer.render(scene, camera)
    frameId = requestAnimationFrame(render)
  }

  render()

  return {
    setPointerTarget(x, y) {
      target.set(x, y)
    },
    stop() {
      running = false
      cancelAnimationFrame(frameId)
    },
  }
}
