import { useRef, useState } from 'react'
import { Camera, Check, Crosshair, ImagePlus, LoaderCircle, MapPin, RotateCcw, Sparkles, Upload, X } from 'lucide-react'
import { DEPARTMENT_MAP, priorityFrom } from '../utils/civic'
import { analyzeCivicImage } from '../services/visionService'

const categories = ['Pothole', 'Garbage', 'Streetlight', 'Waterlogging']

export default function ScanPage({ onSubmit }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [result, setResult] = useState(null)
  const [verified, setVerified] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [manualCategory, setManualCategory] = useState('Pothole')

  function chooseFile(next) {
    if (!next) return
    setFile(next)
    setPreview(URL.createObjectURL(next))
    setResult(null)
    setVerified(false)
    setWrong(false)
    setSubmitted(false)
  }

  async function runAI() {
    if (!file) return
    setLoading(true)
    try {
      const prediction = await analyzeCivicImage(file)
      setResult(prediction)
      setManualCategory(prediction.category)
    } catch (error) {
      setResult(null)
      setWrong(false)
      window.alert(error.message || 'Unable to analyze this image. You can choose a category manually.')
    } finally {
      setLoading(false)
    }
  }

  function getLocation() {
    if (!navigator.geolocation) {
      setLocation({ lat: 31.2548, lng: 75.7042 })
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 31.2548, lng: 75.7042 }),
      { enableHighAccuracy: true, timeout: 8000 },
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
          <button className="primary-btn" onClick={() => { setFile(null); setPreview(''); setResult(null); setSubmitted(false); setLocation(null) }}><RotateCcw size={17} /> Scan another issue</button>
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

          <div className={`dropzone ${preview ? 'has-preview' : ''}`}>
            {preview ? (
              <>
                <img src={preview} alt="Selected civic issue" />
                <button className="remove-photo" onClick={() => { setFile(null); setPreview(''); setResult(null) }}><X size={17} /></button>
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

          {result && !loading && (
            <div className="ai-result">
              <div className="result-top">
                <div><span className="panel-kicker">AI PREDICTION</span><h2>{result.category}</h2><p>Recommended department: <strong>{DEPARTMENT_MAP[result.category]}</strong></p></div>
                <div className="confidence"><strong>{result.confidence}%</strong><span>confidence</span></div>
              </div>
              <div className="confidence-bar"><i style={{ width: `${result.confidence}%` }} /></div>
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
              <div><strong>Location tag</strong><span>{location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'GPS location not captured yet'}</span></div>
              <button className="secondary-btn" onClick={getLocation}><Crosshair size={16} /> {location ? 'Refresh' : 'Get GPS'}</button>
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
