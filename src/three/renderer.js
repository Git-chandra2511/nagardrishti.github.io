import * as THREE from 'three'

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D civic model')
  container.appendChild(renderer.domElement)
  return renderer
}

export function resizeRenderer(renderer, container) {
  renderer.setSize(container.clientWidth, container.clientHeight, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
