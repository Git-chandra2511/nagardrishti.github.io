import { useRef, useState } from 'react'
import { Camera, Check, FileWarning, ImagePlus, Send, ShieldCheck, X } from 'lucide-react'

const officialDepartments = [
  'Traffic Police',
  'Municipal Corporation',
  'Police Department',
  'Public Works Department',
  'Electricity Board',
  'Other Government Department',
]

const complaintTypes = [
  'Illegal payment demand',
  'Abuse of authority',
  'Harassment or intimidation',
  'Refusal to provide public service',
  'Other official misconduct',
]

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Unable to read the selected photo.'))
    reader.readAsDataURL(file)
  })
}

export default function MisconductReportPage({ onSubmit }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [photoName, setPhotoName] = useState('')
  const [details, setDetails] = useState('')
  const [department, setDepartment] = useState('Traffic Police')
  const [complaintType, setComplaintType] = useState('Illegal payment demand')
  const [consent, setConsent] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function choosePhoto(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    setPreview(await readImage(file))
    setPhotoName(file.name)
    setError('')
  }

  function submit(event) {
    event.preventDefault()
    if (!preview) return setError('Add a photo of the incident before submitting.')
    if (!consent) return setError(`Confirm that you want to share this evidence with the ${department} review authority.`)

    onSubmit({
      title: complaintType,
      description: details.trim() || `Citizen reported ${complaintType.toLowerCase()} involving an official from the ${department}.`,
      category: 'Other',
      department,
      priority: 'High',
      severity: 9,
      status: 'Pending',
      misconduct: true,
      evidenceImage: preview,
      evidenceFileName: photoName,
      routingNote: `Confidential review requested by ${department}.`,
      address: 'Location to be verified by the receiving authority',
      lat: 31.2548,
      lng: 75.7042,
      verified: false,
      createdAt: Date.now(),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return <div className="page center-page"><div className="success-card misconduct-success"><div className="success-check"><Check size={35} /></div><div className="eyebrow"><ShieldCheck size={14} /> EVIDENCE ROUTED</div><h1>Report sent for review.</h1><p>Your photo and details were routed to the <strong>{department}</strong> review queue. Keep the original evidence safe and contact emergency services if anyone is in immediate danger.</p><div className="success-stats"><span>Photo attached</span><span>Confidential review</span><span>{department}</span></div><button className="primary-btn" onClick={() => { setPreview(''); setPhotoName(''); setDetails(''); setDepartment('Traffic Police'); setComplaintType('Illegal payment demand'); setConsent(false); setSubmitted(false) }}>Submit another report</button></div></div>
  }

  return <div className="page misconduct-page">
    <div className="section-heading"><div className="eyebrow"><FileWarning size={14} /> OFFICIAL ACCOUNTABILITY</div><h1>Report government official misconduct</h1><p>Report concerns involving traffic police or another government department. Share evidence only when it is safe; your submission is routed confidentially to the selected review authority.</p></div>
    <div className="misconduct-layout">
      <form className="panel misconduct-form" onSubmit={submit}>
        <div className="misconduct-warning"><ShieldCheck size={19} /><div><strong>Your safety comes first</strong><span>Do not confront anyone or take a photo if doing so could put you at risk.</span></div></div>
        <div className="misconduct-fields">
          <label><span>Official department</span><select value={department} onChange={event => setDepartment(event.target.value)}>{officialDepartments.map(item => <option key={item}>{item}</option>)}</select></label>
          <label><span>Complaint type</span><select value={complaintType} onChange={event => setComplaintType(event.target.value)}>{complaintTypes.map(item => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className={`misconduct-dropzone ${preview ? 'has-preview' : ''}`}>
          {preview ? <><img src={preview} alt="Evidence preview" /><button type="button" className="remove-photo" onClick={() => { setPreview(''); setPhotoName('') }}><X size={17} /></button><span className="misconduct-file-name">{photoName}</span></> : <button type="button" className="drop-content" onClick={() => inputRef.current?.click()}><div className="upload-icon"><ImagePlus size={28} /></div><strong>Add incident photo</strong><span>Use camera or choose a JPG/PNG image</span><div className="camera-btn"><Camera size={17} /> Use camera</div></button>}
          <input ref={inputRef} hidden type="file" accept="image/*" capture="environment" onChange={event => choosePhoto(event.target.files?.[0])} />
        </div>
        <label className="misconduct-details"><span>What happened? <small>(optional)</small></span><textarea value={details} onChange={event => setDetails(event.target.value)} placeholder="Share the time, place, and any relevant details without putting yourself at risk." rows="5" /></label>
        <label className="misconduct-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /><span>I confirm I want to share this photo and information with the {department} review authority.</span></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="login-submit misconduct-submit" type="submit"><Send size={16} /> Transfer evidence to {department}</button>
      </form>
      <aside className="panel misconduct-side"><div className="panel-kicker">REVIEW ROUTE</div><div className="misconduct-route"><b>01</b><span>Photo captured securely in this report</span></div><div className="misconduct-route"><b>02</b><span>Evidence marked for confidential review</span></div><div className="misconduct-route"><b>03</b><span>{department} receives the report</span></div><p>For immediate threats, use your local emergency number. This tool does not replace emergency services or a formal police complaint.</p></aside>
    </div>
  </div>
}
