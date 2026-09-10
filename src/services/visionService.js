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

export async function analyzeCivicImage(file) {
  const imageBase64 = await fileToBase64(file)
  const localResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mimeType: file.type || 'image/jpeg' }),
  })
  if (localResponse.ok) {
    const payload = await localResponse.json()
    if (payload.success && payload.data) return payload.data
  }

  if (!firebaseEnabled || !functions) {
    throw new Error('The local Node server is unavailable. Start it with: npm run dev --prefix server')
  }
  const analyze = httpsCallable(functions, 'analyzeCivicImage')
  const result = await analyze({ imageBase64, mimeType: file.type || 'image/jpeg' })
  return result.data
}
