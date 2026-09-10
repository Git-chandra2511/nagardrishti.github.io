/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall, HttpsError} = require("firebase-functions/https");
const {GoogleGenAI} = require("@google/genai");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

const allowedCategories = ["Pothole", "Garbage", "Streetlight", "Waterlogging"];
const allowedPriorities = ["Low", "Medium", "High"];

exports.analyzeCivicImage = onCall(async (request) => {
  if (!request.data || typeof request.data.imageBase64 !== "string" || !request.data.mimeType) {
    throw new HttpsError("invalid-argument", "An image is required.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new HttpsError("failed-precondition", "Gemini is not configured on the backend.");
  }

  const ai = new GoogleGenAI({apiKey});
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      role: "user",
      parts: [
        {inlineData: {mimeType: request.data.mimeType, data: request.data.imageBase64}},
        {text: [
          "Classify this civic issue for a municipal reporting app.",
          `Allowed categories: ${allowedCategories.join(", ")}.`,
          "Return only valid JSON with category, confidence (0 to 1), priority (Low, Medium, or High), severity (1 to 10), and summary.",
          "Do not include markdown fences or extra text.",
        ].join(" ")},
      ],
    }],
  });

  let parsed;
  try {
    parsed = JSON.parse(response.text.trim().replace(/^```json\s*|\s*```$/g, ""));
  } catch {
    throw new HttpsError("internal", "The vision service returned an invalid response.");
  }

  if (!allowedCategories.includes(parsed.category)) {
    throw new HttpsError("internal", "The vision service returned an unsupported category.");
  }

  const confidence = Number(parsed.confidence);
  const severity = Number(parsed.severity);
  if (!Number.isFinite(confidence) || confidence < 0 || confidence > 1 ||
      !Number.isInteger(severity) || severity < 1 || severity > 10 ||
      !allowedPriorities.includes(parsed.priority)) {
    throw new HttpsError("internal", "The vision service returned invalid issue metadata.");
  }

  return {
    category: parsed.category,
    confidence: Math.round(confidence * 100),
    priority: parsed.priority,
    severity,
    summary: typeof parsed.summary === "string" ? parsed.summary.slice(0, 500) : "",
    model: "gemini-2.5-flash",
  };
});
