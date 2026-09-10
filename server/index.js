import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { GoogleGenAI } from '@google/genai'

const app = express()
const port = Number(process.env.PORT || 5000)
const allowedCategories = ['Pothole', 'Garbage', 'Streetlight', 'Waterlogging']
const allowedPriorities = ['Low', 'Medium', 'High']

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin || /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.|172\.)/.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Origin not allowed by local development server.'))
  },
}))
app.use(express.json({ limit: '12mb' }))

app.get('/api/health', (_request, response) => {
  response.json({ success: true, data: { service: 'nagar-drishti-server', aiConfigured: Boolean(process.env.GEMINI_API_KEY) } })
})

app.post('/api/analyze', async (request, response) => {
  const { imageBase64, mimeType } = request.body || {}
  if (typeof imageBase64 !== 'string' || !mimeType) {
    return response.status(400).json({ success: false, error: { code: 'INVALID_IMAGE', message: 'An image is required.' } })
  }
  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({ success: false, error: { code: 'AI_NOT_CONFIGURED', message: 'GEMINI_API_KEY is missing from server/.env.' } })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: `Classify this civic issue. Allowed categories: ${allowedCategories.join(', ')}. Return only JSON with category, confidence from 0 to 1, priority (Low, Medium, High), severity from 1 to 10, and summary.` },
        ],
      }],
    })
    const parsed = JSON.parse(result.text.trim().replace(/^```json\s*|\s*```$/g, ''))
    const confidence = Number(parsed.confidence)
    const severity = Number(parsed.severity)
    if (!allowedCategories.includes(parsed.category) || !allowedPriorities.includes(parsed.priority) ||
        !Number.isFinite(confidence) || confidence < 0 || confidence > 1 ||
        !Number.isInteger(severity) || severity < 1 || severity > 10) {
      throw new Error('Invalid model response')
    }
    return response.json({
      success: true,
      data: {
        category: parsed.category,
        confidence: Math.round(confidence * 100),
        priority: parsed.priority,
        severity,
        summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 500) : '',
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      },
    })
  } catch (error) {
    console.error('Image analysis failed:', error.message)
    return response.status(502).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: 'The image could not be analyzed.' } })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Nagar Drishti server listening on http://localhost:${port}`)
})
