import { httpsCallable } from 'firebase/functions'
import { firebaseEnabled, functions } from './firebase'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1])
    reader.onerror = () => reject(reader.error || new Error('Unable to read image.'))
    reader.readAsDataURL(file)
  })
}

function optimizeImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)
    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const maxDimension = 1280
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
        else reject(new Error('Unable to prepare this image.'))
      }, 'image/jpeg', .78)
    }
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read this image.'))
    }
    image.src = objectUrl
  })
}

export async function analyzeCivicImage(file) {
  const optimizedFile = file.type.startsWith('image/') ? await optimizeImage(file) : file
  const imageBase64 = await fileToBase64(optimizedFile)
  const apiHost = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 90000)
  try {
    const localResponse = await fetch(`${apiHost}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType: 'image/jpeg' }),
      signal: controller.signal,
    })
    const responseText = await localResponse.text()
    let payload = {}
    if (responseText.trim()) {
      try {
        payload = JSON.parse(responseText)
      } catch {
        throw new Error(`AI server returned an invalid response (${localResponse.status}).`)
      }
    }
    if (localResponse.ok && payload.success && payload.data) return payload.data
    if (payload.error?.message) throw new Error(payload.error.message)
    if (!localResponse.ok) {
      throw new Error(`AI server request failed (${localResponse.status}). Start it with: npm run server`)
    }
    throw new Error('AI server returned an empty response. Start it with: npm run server')
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Image analysis timed out after 90 seconds. Try a smaller or clearer photo.')
    if (error.message === 'Failed to fetch') {
      throw new Error('AI server is not running. Start it with: npm start --prefix server')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }

  if (!firebaseEnabled || !functions) {
    throw new Error('The local Node server is unavailable. Start it with: npm start --prefix server')
  }
  const analyze = httpsCallable(functions, 'analyzeCivicImage')
  const result = await analyze({ imageBase64, mimeType: file.type || 'image/jpeg' })
  return result.data
}
