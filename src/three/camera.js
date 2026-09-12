import * as THREE from 'three'

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(32, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(0, 0.7, 7.2)
  return camera
}

export function resizeCamera(camera, container) {
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
}

export function frameModel(camera, model, container) {
  const bounds = new THREE.Box3().setFromObject(model)
  const size = bounds.getSize(new THREE.Vector3())
  const center = bounds.getCenter(new THREE.Vector3())
  const verticalFov = THREE.MathUtils.degToRad(camera.fov)
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect)
  const verticalDistance = size.y / (2 * Math.tan(verticalFov / 2))
  const horizontalDistance = size.x / (2 * Math.tan(horizontalFov / 2))
  const distance = Math.max(verticalDistance, horizontalDistance) * 0.76
  const viewDirection = new THREE.Vector3(-0.82, 0.95, 0.82).normalize()
  const target = center.clone()
  target.y -= size.y * 0.08

  camera.position.copy(target).add(viewDirection.multiplyScalar(Math.max(distance, 5.2)))
  camera.lookAt(target)
  resizeCamera(camera, container)
}
