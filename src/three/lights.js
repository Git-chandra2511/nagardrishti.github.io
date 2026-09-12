import * as THREE from 'three'

export function addLights(scene) {
  const ambient = new THREE.HemisphereLight(0xffffff, 0xc7d8d0, 2.2)
  const key = new THREE.DirectionalLight(0xffffff, 3.5)
  key.position.set(4, 7, 5)
  key.castShadow = true

  const rim = new THREE.DirectionalLight(0x7ca894, 2.4)
  rim.position.set(-5, 3, -4)

  scene.add(ambient, key, rim)
}
