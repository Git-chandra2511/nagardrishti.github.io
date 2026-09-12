import 'dotenv/config'
import crypto from 'node:crypto'
import cors from 'cors'
import express from 'express'
import { GoogleGenAI } from '@google/genai'

const app = express()
const port = Number(process.env.PORT || 5000)
const allowedCategories = ['Pothole', 'Garbage', 'Streetlight', 'Waterlogging', 'Hospital', 'Traffic Police', 'Narcotics', 'Fire']
const defaultModel = 'gemini-3.6-flash'
const fallbackModels = ['gemini-2.0-flash', 'gemini-2.5-flash']
const whatsappApiVersion = process.env.WHATSAPP_API_VERSION || 'v23.0'

function modelCandidates() {
  return [...new Set([process.env.GEMINI_MODEL, defaultModel, ...fallbackModels].filter(Boolean))]
}

async function generateWithModel(ai, contents) {
  let lastError
  for (const model of modelCandidates()) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const result = await ai.models.generateContent({ model, contents })
        return { result, model }
      } catch (error) {
        lastError = error
        const message = String(error?.message || '').toLowerCase()
        const retryable = message.includes('fetch failed') || message.includes('network') || message.includes('temporarily unavailable') || message.includes('503')
        const unsupported = message.includes('not found') || message.includes('unsupported') || message.includes('invalid')
        if (!retryable && !unsupported) throw error
        if (retryable && attempt === 0) await new Promise(resolve => setTimeout(resolve, 1200))
        if (unsupported) break
      }
    }
  }
  throw lastError
}

function normalizeCategory(value) {
  const category = String(value || '').toLowerCase()
  if (category.includes('water') || category.includes('flood') || category.includes('drain')) return 'Waterlogging'
  if (category.includes('streetlight') || category.includes('street light') || category.includes('lamp') || category.includes('electric')) return 'Streetlight'
  if (category.includes('garbage') || category.includes('dustbin') || category.includes('trash') || category.includes('waste') || category.includes('litter')) return 'Garbage'
  if (category.includes('pothole') || category.includes('road') || category.includes('crack')) return 'Pothole'
  if (category.includes('hospital') || category.includes('medical') || category.includes('ambulance')) return 'Hospital'
  if (category.includes('traffic') || category.includes('signal') || category.includes('vehicle')) return 'Traffic Police'
  if (category.includes('narcotic') || category.includes('drug')) return 'Narcotics'
  if (category.includes('fire') || category.includes('smoke') || category.includes('burn')) return 'Fire'
  return null
}

function parseModelJson(text) {
  const raw = String(text || '').trim()
  const withoutFence = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const start = withoutFence.indexOf('{')
  const end = withoutFence.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('Model did not return a JSON object')
  return JSON.parse(withoutFence.slice(start, end + 1))
}

function normalizePriority(value) {
  const priority = String(value || '').trim().toLowerCase()
  if (priority === 'high') return 'High'
  if (priority === 'medium' || priority === 'moderate') return 'Medium'
  return 'Low'
}

const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin || /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.|172\.)/.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Origin not allowed by local development server.'))
  },
}))
app.use(express.json({
  limit: '12mb',
  verify: (request, _response, buffer) => {
    request.rawBody = buffer
  },
}))

function isValidWhatsAppSignature(request) {
  const signature = request.get('x-hub-signature-256')
  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!signature || !appSecret || !request.rawBody) return false
  const expected = `sha256=${crypto.createHmac('sha256', appSecret).update(request.rawBody).digest('hex')}`
  return signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

async function sendWhatsAppText(to, body) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  if (!token || !phoneNumberId) throw new Error('WhatsApp credentials are not configured')
  const result = await fetch(`https://graph.facebook.com/${whatsappApiVersion}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { preview_url: false, body: body.slice(0, 4096) },
    }),
  })
  if (!result.ok) throw new Error(`WhatsApp API returned ${result.status}: ${await result.text()}`)
}

app.get('/api/whatsapp/webhook', (request, response) => {
  const mode = request.query['hub.mode']
  const token = request.query['hub.verify_token']
  const challenge = request.query['hub.challenge']
  if (mode === 'subscribe' && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return response.status(200).send(challenge)
  }
  return response.sendStatus(403)
})

app.post('/api/whatsapp/webhook', async (request, response) => {
  if (!isValidWhatsAppSignature(request)) return response.sendStatus(403)
  response.sendStatus(200)

  const entries = Array.isArray(request.body?.entry) ? request.body.entry : []
  for (const entry of entries) {
    const changes = Array.isArray(entry.changes) ? entry.changes : []
    for (const change of changes) {
      const messages = change.value?.messages
      if (!Array.isArray(messages)) continue
      for (const message of messages) {
        if (message.type !== 'text' || !message.from || !message.text?.body) continue
        try {
          await sendWhatsAppText(message.from, `Nagar Drishti received your message:\n\n${message.text.body.trim().slice(0, 500)}\n\nTo report a civic issue, reply with its location and category, or use the Nagar Drishti app.`)
        } catch (error) {
          console.error('WhatsApp reply failed:', error.message)
        }
      }
    }
  }
})

app.get('/api/health', (_request, response) => {
  response.json({ success: true, data: { service: 'nagar-drishti-server', aiConfigured: Boolean(process.env.GEMINI_API_KEY) } })
})

app.post('/api/chat', async (request, response) => {
  const { message, history = [] } = request.body || {}
  if (typeof message !== 'string' || !message.trim()) {
    return response.status(400).json({ success: false, error: { code: 'INVALID_MESSAGE', message: 'A message is required.' } })
  }
  if (!process.env.GEMINI_API_KEY) {
    return response.status(503).json({ success: false, error: { code: 'AI_NOT_CONFIGURED', message: 'GEMINI_API_KEY is missing from server/.env.' } })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const conversation = Array.isArray(history)
      ? history.slice(-6).map(item => `${item.role === 'user' ? 'Citizen' : 'Drishti AI'}: ${String(item.text || '').slice(0, 800)}`).join('\n')
      : ''
    const { result } = await generateWithModel(ai, `You are Drishti AI, a concise and friendly civic assistant for Nagar Drishti.
Help citizens with potholes, garbage or overflowing dustbins, waterlogging, damaged streetlights, GPS tagging, AI verification, report submission, issue tracking, and department routing.
Do not claim that a report was submitted, an officer was contacted, or a live status was changed. Explain that the citizen should use the Scan page for those actions.
Use short paragraphs or bullets and do not use markdown tables.

Conversation:
${conversation}

Citizen: ${message.trim().slice(0, 1200)}
Drishti AI:`)
    const reply = result.text?.trim()
    if (!reply) throw new Error('Empty assistant response')
    return response.json({ success: true, data: { reply: reply.slice(0, 2000) } })
  } catch (error) {
    console.error('Chat request failed:', error.message)
    return response.status(502).json({ success: false, error: { code: 'CHAT_FAILED', message: 'Drishti AI is temporarily unavailable.' } })
  }
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
    const contents = [{
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: `Classify this civic issue. Allowed categories: ${allowedCategories.join(', ')}. Return only JSON with category, confidence from 0 to 1, priority (Low, Medium, High), severity from 1 to 10, and summary.` },
        ],
    }]
    const { result, model } = await generateWithModel(ai, contents)
    const parsed = parseModelJson(result.text)
    const rawConfidence = Number(parsed.confidence)
    const confidence = rawConfidence > 1 ? rawConfidence / 100 : rawConfidence
    const severity = Number(parsed.severity)
    const category = normalizeCategory(parsed.category)
    const priority = normalizePriority(parsed.priority)
    if (!category ||
        !Number.isFinite(confidence) || confidence < 0 || confidence > 1 ||
        !Number.isInteger(severity) || severity < 1 || severity > 10) {
      throw new Error('Invalid model response')
    }
    return response.json({
      success: true,
      data: {
        category,
        confidence: Math.round(confidence * 100),
        priority,
        severity,
        summary: typeof parsed.summary === 'string' ? parsed.summary.slice(0, 500) : '',
        model,
      },
    })
  } catch (error) {
    console.error('Image analysis failed:', error.message)
    const errorText = String(error?.message || '')
    if (errorText.includes('"code":429') || errorText.includes('RESOURCE_EXHAUSTED') || errorText.includes('quota')) {
      return response.status(429).json({
        success: false,
        error: {
          code: 'AI_QUOTA_EXCEEDED',
          message: 'AI image-analysis quota is temporarily exceeded. Try again later or choose the category manually.',
        },
      })
    }
    if (errorText.toLowerCase().includes('fetch failed') || errorText.toLowerCase().includes('network')) {
      return response.status(502).json({
        success: false,
        error: {
          code: 'AI_PROVIDER_UNAVAILABLE',
          message: 'The AI provider could not be reached. Please try Analyze again in a few seconds.',
        },
      })
    }
    return response.status(502).json({ success: false, error: { code: 'ANALYSIS_FAILED', message: 'The image could not be analyzed.' } })
  }
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Nagar Drishti server listening on http://localhost:${port}`)
})
