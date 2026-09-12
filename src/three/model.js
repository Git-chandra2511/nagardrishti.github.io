import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export function loadModel(url) {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(url, resolve, undefined, reject)
  })
}

export async function prepareModel(url) {
  const gltf = await loadModel(url)
  const model = gltf.scene
  const bounds = new THREE.Box3().setFromObject(model)
  const center = bounds.getCenter(new THREE.Vector3())
  const size = bounds.getSize(new THREE.Vector3())
  const largestDimension = Math.max(size.x, size.y, size.z) || 1
  const scale = 3.4 / largestDimension

  model.position.sub(center.multiplyScalar(scale))
  model.scale.setScalar(scale)
  model.position.y -= 0.2
  model.traverse((node) => {
    if (!node.isMesh) return
    node.castShadow = true
    node.receiveShadow = true
    if (node.material) {
      node.material.envMapIntensity = 0.8
    }
  })
  return model
}

export function disposeModel(model) {
  model.traverse((node) => {
    if (!node.isMesh) return
    node.geometry?.dispose()
    const materials = Array.isArray(node.material) ? node.material : [node.material]
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value?.isTexture) value.dispose()
      })
      material.dispose()
    })
  })
}
