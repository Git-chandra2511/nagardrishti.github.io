import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = null
  scene.fog = new THREE.Fog(0x071b13, 12, 28)
  return scene
}
