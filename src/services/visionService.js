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

async function optimizeImage(file) {
  const maxDimension = 1024
  let bitmap
  try {
    if ('createImageBitmap' in window) {
      bitmap = await createImageBitmap(file, { resizeWidth: maxDimension, resizeHeight: maxDimension, resizeQuality: 'medium' })
    }
  } catch {
    bitmap = null
  }

  if (!bitmap) {
    bitmap = await new Promise((resolve, reject) => {
      const image = new Image()
      const objectUrl = URL.createObjectURL(file)
      image.onload = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(image)
      }
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Unable to read this image.'))
      }
      image.src = objectUrl
    })
  }

  const sourceWidth = bitmap.width || bitmap.naturalWidth
  const sourceHeight = bitmap.height || bitmap.naturalHeight
  const scale = Math.min(1, maxDimension / Math.max(sourceWidth, sourceHeight))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(sourceWidth * scale))
  canvas.height = Math.max(1, Math.round(sourceHeight * scale))
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) {
    bitmap.close?.()
    throw new Error('Unable to prepare this image in the browser.')
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      canvas.width = 1
      canvas.height = 1
      if (blob) resolve(blob)
      else reject(new Error('Unable to prepare this image.'))
    }, 'image/jpeg', .68)
  })
}

export async function analyzeCivicImage(file) {
  if (!file?.type?.startsWith('image/')) throw new Error('Please choose a JPG, PNG, or WebP image.')
  if (file.size > 20 * 1024 * 1024) throw new Error('This photo is too large for the browser. Choose an image under 20 MB.')
  const optimizedFile = file.type.startsWith('image/') ? await optimizeImage(file) : file
  const imageBase64 = await fileToBase64(optimizedFile)
  const apiHost = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 90000)
  let localError
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
    localError = error
  } finally {
    window.clearTimeout(timeout)
  }

  if (localError?.message !== 'Failed to fetch' || !firebaseEnabled || !functions) {
    if (localError?.message === 'Failed to fetch') {
      throw new Error('AI server is not running. Start it with: npm run server')
    }
    throw localError
  }
  const analyze = httpsCallable(functions, 'analyzeCivicImage')
  const result = await analyze({ imageBase64, mimeType: file.type || 'image/jpeg' })
  return result.data
}
