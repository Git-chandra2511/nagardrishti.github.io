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
  if (!firebaseEnabled || !functions) {
    throw new Error('Firebase Functions is not configured.')
  }
  const imageBase64 = await fileToBase64(file)
  const analyze = httpsCallable(functions, 'analyzeCivicImage')
  const result = await analyze({ imageBase64, mimeType: file.type || 'image/jpeg' })
  return result.data
}
