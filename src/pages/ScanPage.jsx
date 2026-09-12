import { useEffect, useRef, useState } from 'react'
import { Camera, Check, Crosshair, ImagePlus, Languages, LoaderCircle, MapPin, Mic, RotateCcw, Sparkles, Square, Upload, Volume2, X } from 'lucide-react'
import { DEPARTMENT_MAP, priorityFrom } from '../utils/civic'
import { analyzeCivicImage } from '../services/visionService'

const categories = ['Pothole', 'Garbage', 'Streetlight', 'Waterlogging', 'Hospital', 'Traffic Police', 'Narcotics', 'Fire']

export default function ScanPage({ onSubmit }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [verified, setVerified] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [locationError, setLocationError] = useState('')
  const [loading, setLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [manualMode, setManualMode] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [manualCategory, setManualCategory] = useState('Pothole')
  const [voiceLanguage, setVoiceLanguage] = useState('hi-IN')
  const [voiceText, setVoiceText] = useState('')
  const [voiceListening, setVoiceListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => () => {
    recognitionRef.current?.stop()
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  function chooseFile(next) {
    if (!next) return
    if (!next.type.startsWith('image/')) {
      setAnalysisError('Please choose a JPG, PNG, or WebP image.')
      return
    }
    if (next.size > 20 * 1024 * 1024) {
      setAnalysisError('This photo is too large for the browser. Choose an image under 20 MB.')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setResult(null)
    setAnalysisError('')
    setManualMode(false)
    setVerified(false)
    setWrong(false)
    setSubmitted(false)
    setLocation(null)
    setLocationStatus('idle')
    setLocationError('')
  }

  function toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceError('Voice input is not supported in this browser. Try the latest Chrome or Edge.')
      return
    }
    if (voiceListening) {
      recognitionRef.current?.stop()
      setVoiceListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = voiceLanguage
    recognition.continuous = true
    recognition.interimResults = true
    recognition.onstart = () => {
      setVoiceError('')
      setVoiceListening(true)
    }
    recognition.onresult = event => {
      let finalText = ''
      let interimText = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const text = event.results[index][0].transcript
        if (event.results[index].isFinal) finalText += text
        else interimText += text
      }
      if (finalText) setVoiceText(current => `${current} ${finalText}`.trim())
      if (interimText) setVoiceError(`Listening: ${interimText}`)
    }
    recognition.onerror = event => {
      setVoiceListening(false)
      setVoiceError(event.error === 'not-allowed' ? 'Microphone permission was denied.' : 'Voice input stopped. Please try again.')
    }
    recognition.onend = () => setVoiceListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  async function runAI() {
    if (!file) return
    setLoading(true)
    setAnalysisError('')
    setManualMode(false)
    try {
      const prediction = await analyzeCivicImage(file)
      setResult(prediction)
      setManualCategory(prediction.category)
    } catch (error) {
      setResult({
        category: manualCategory,
        confidence: 0,
        priority: priorityFrom(manualCategory, 100),
        severity: 1,
        summary: 'AI is temporarily unavailable. Select the correct category below to continue manually.',
      })
      setManualMode(true)
      setWrong(true)
      setAnalysisError(error.message || 'Unable to analyze this image. You can choose a category manually.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if ((verified || wrong) && !location && locationStatus === 'idle') getLocation()
  }, [verified, wrong, location, locationStatus])

  function getLocation() {
    if (!navigator.geolocation) {
      setLocation({ lat: 31.2548, lng: 75.7042, source: 'fallback' })
      setLocationStatus('fallback')
      setLocationError('This browser does not support GPS. Using the demo location.')
      return
    }
    setLocationStatus('loading')
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, source: 'gps' })
        setLocationStatus('success')
      },
      error => {
        setLocation({ lat: 31.2548, lng: 75.7042, source: 'fallback' })
        setLocationStatus('fallback')
        setLocationError(
          error.code === 1
            ? 'GPS permission is blocked. Allow location for localhost in the browser, then tap Refresh.'
            : 'GPS timed out or is unavailable. Using the demo location; tap Refresh to try again.',
        )
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  function submit() {
    const category = wrong ? manualCategory : result.category
    const report = {
      category,
      department: DEPARTMENT_MAP[category],
      confidence: wrong ? 100 : result.confidence,
      priority: priorityFrom(category, wrong ? 100 : result.confidence),
      lat: location?.lat || 31.2548,
      lng: location?.lng || 75.7042,
      address: 'Current GPS location',
      status: 'Pending',
      verified: true,
      description: voiceText.trim() || 'Reported through Nagar Drishti civic scan.',
      points: 10,
      createdAt: Date.now(),
      reporter: 'You',
    }
    onSubmit(report)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="page center-page">
        <div className="success-card">
          <div className="success-check"><Check size={35} /></div>
          <div className="eyebrow">REPORT RECEIVED</div>
          <h1>Your city has a new signal.</h1>
          <p>Your verified <strong>{wrong ? manualCategory : result.category}</strong> report has been tagged with GPS and routed to <strong>{DEPARTMENT_MAP[wrong ? manualCategory : result.category]}</strong>.</p>
          <div className="success-stats"><span>+10 Nagar Points</span><span>AI verified</span><span>GPS tagged</span></div>
          <button className="primary-btn" onClick={() => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(''); setResult(null); setManualMode(false); setSubmitted(false); setLocation(null); setLocationStatus('idle'); setLocationError('') }}><RotateCcw size={17} /> Scan another issue</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="scan-layout">
        <section className="scan-main">
          <div className="section-heading">
            <div className="eyebrow"><Sparkles size={14} /> AI CIVIC VISION</div>
            <h1>What needs fixing?</h1>
            <p>Take a photo or upload one. Nagar Drishti detects the issue, suggests the department, and asks you to verify before submission.</p>
          </div>

          <section className={`voice-report-card ${voiceListening ? 'is-listening' : ''}`}>
            <div className="voice-report-copy">
              <div className="voice-report-icon"><Volume2 size={19} /></div>
              <div><span className="panel-kicker">VOICE-FIRST REPORTING</span><h2>Tell us what happened</h2><p>Speak naturally in Hindi or English. Your words become the report description.</p></div>
            </div>
            <div className="voice-report-controls">
              <label><Languages size={14} /><select value={voiceLanguage} onChange={event => setVoiceLanguage(event.target.value)} disabled={voiceListening}><option value="hi-IN">हिंदी</option><option value="en-IN">English</option></select></label>
              <button className={`voice-record-btn ${voiceListening ? 'recording' : ''}`} onClick={toggleVoice}><span>{voiceListening ? <Square size={14} /> : <Mic size={16} />}</span>{voiceListening ? 'Stop listening' : 'Speak report'}</button>
            </div>
            {(voiceText || voiceError) && <div className="voice-transcript" aria-live="polite">{voiceText && <p>{voiceText}</p>}{voiceError && <small>{voiceError}</small>}</div>}
            {voiceText && <button className="voice-clear-btn" onClick={() => { setVoiceText(''); setVoiceError('') }}>Clear voice note</button>}
          </section>

          <div className={`dropzone ${preview ? 'has-preview' : ''} ${loading ? 'is-scanning' : ''} ${result ? 'is-analyzed' : ''}`}>
            {preview ? (
              <>
                <img src={preview} alt="Selected civic issue" />
                {loading && (
                  <div className="scan-animation" aria-live="polite">
                    <div className="scan-target"><span /><span /><span /><span /></div>
                    <div className="scan-line" />
                    <strong>SCANNING IMAGE</strong>
                  </div>
                )}
                {result && (
                  <div className="scan-success" aria-label={manualMode ? 'Manual category required' : 'Image analyzed successfully'}>
                    <Check size={18} />
                    <span>{manualMode ? 'MANUAL REVIEW' : 'SCAN COMPLETE'}</span>
                  </div>
                )}
                <button className="remove-photo" onClick={() => { if (preview) URL.revokeObjectURL(preview); setFile(null); setPreview(''); setResult(null); setManualMode(false); setAnalysisError(''); setLocation(null); setLocationStatus('idle'); setLocationError('') }}><X size={17} /></button>
                <div className="preview-overlay">
                  <button className="secondary-btn" onClick={() => inputRef.current?.click()}><Upload size={16} /> Replace</button>
                  {!result && <button className="primary-btn" onClick={runAI}><Sparkles size={16} /> Analyze with AI</button>}
                </div>
              </>
            ) : (
              <button className="drop-content" onClick={() => inputRef.current?.click()}>
                <div className="upload-icon"><ImagePlus size={28} /></div>
                <strong>Drop a civic issue photo here</strong>
                <span>or click to browse • JPG, PNG up to 5 MB</span>
                <div className="camera-btn"><Camera size={17} /> Use camera</div>
              </button>
            )}
            <input ref={inputRef} hidden type="file" accept="image/*" capture="environment" onChange={e => chooseFile(e.target.files?.[0])} />
          </div>

          {file && !result && !loading && (
            <div className="analysis-callout">
              <div><Sparkles size={18} /><span><strong>Ready for AI analysis</strong><small>We will classify the civic issue from your photo.</small></span></div>
              <button className="primary-btn" onClick={runAI}>Analyze <Sparkles size={16} /></button>
            </div>
          )}

          {loading && (
            <div className="analysis-loading"><LoaderCircle className="spin" size={23} /><div><strong>AI is examining the image…</strong><span>Checking visual patterns and civic category</span></div></div>
          )}

          {analysisError && !loading && (
            <div className="analysis-error" role="alert">
              <div><strong>AI analysis could not start</strong><span>{analysisError}</span></div>
              <button className="secondary-btn" onClick={runAI}>Try again</button>
            </div>
          )}

          {result && !loading && (
            <div className="ai-result">
              <div className="result-top">
                <div><span className="panel-kicker">{manualMode ? 'MANUAL FALLBACK' : 'AI PREDICTION'}</span><h2>{result.category}</h2><p>Recommended department: <strong>{DEPARTMENT_MAP[result.category]}</strong></p></div>
                <div className="confidence"><strong>{result.confidence}%</strong><span>confidence</span></div>
              </div>
              <div className="confidence-bar"><i style={{ width: `${result.confidence}%` }} /></div>
              <div className="analysis-output">
                <div><span>Priority</span><strong>{result.priority}</strong></div>
                <div><span>Severity</span><strong>{result.severity}/10</strong></div>
                {result.summary && <p>{result.summary}</p>}
              </div>
              <div className="verify-question"><strong>Does this look correct?</strong><span>Verify with AI before Nagar Drishti submits it.</span></div>
              <div className="verify-actions">
                <button className={verified ? 'verify-btn selected' : 'verify-btn'} onClick={() => { setVerified(true); setWrong(false) }}><Check size={18} /> Confirm</button>
                <button className={wrong ? 'verify-btn wrong selected' : 'verify-btn wrong'} onClick={() => { setWrong(true); setVerified(false) }}><X size={18} /> Wrong tag</button>
              </div>
              {wrong && (
                <div className="manual-select">
                  <label>Select correct issue</label>
                  <select value={manualCategory} onChange={e => setManualCategory(e.target.value)}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {result && (verified || wrong) && (
            <div className="location-card">
              <div className="location-icon"><MapPin size={20} /></div>
              <div><strong>Location tag</strong><span>{locationStatus === 'loading' ? 'Requesting GPS location…' : location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${location.source === 'fallback' ? ' • demo fallback' : ''}` : 'GPS location not captured yet'}{locationError && <small>{locationError}</small>}</span></div>
              <button className="secondary-btn" onClick={getLocation} disabled={locationStatus === 'loading'}><Crosshair size={16} /> {locationStatus === 'loading' ? 'Locating…' : location ? 'Refresh' : 'Get GPS'}</button>
            </div>
          )}

          {result && (verified || wrong) && location && (
            <button className="submit-report" onClick={submit}><span><Check size={19} /> Submit verified report</span><strong>+10 pts</strong></button>
          )}
        </section>

        <aside className="scan-side">
          <div className="panel intelligence-panel">
            <div className="panel-kicker">HOW IT WORKS</div>
            {[
              ['01', 'Capture', 'Photo of the civic problem'],
              ['02', 'AI Vision', 'Category + confidence score'],
              ['03', 'Verify', 'You remain in control'],
              ['04', 'Route', 'Correct department + GPS'],
            ].map(([n, title, desc]) => (
              <div className="step" key={n}><b>{n}</b><div><strong>{title}</strong><span>{desc}</span></div></div>
            ))}
          </div>
          <div className="tip-card"><Sparkles size={18} /><div><strong>Pro tip</strong><span>Photograph the issue clearly and include surrounding context. Better images improve AI confidence.</span></div></div>
        </aside>
      </div>
    </div>
  )
}
