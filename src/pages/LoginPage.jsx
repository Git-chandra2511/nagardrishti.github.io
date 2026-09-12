import { useState } from 'react'
import { ShieldCheck, UserRound, LockKeyhole, Mail, ArrowRight, UserPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n'

const DEMO_ADMIN = {
  email: 'admin@nagar.local',
  password: 'admin123',
  name: 'Area Administrator',
}

function createCaptcha() {
  const first = Math.floor(Math.random() * 8) + 2
  const second = Math.floor(Math.random() * 8) + 1
  return { question: `${first} + ${second}`, answer: String(first + second) }
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const { isHindi, toggleLanguage } = useLanguage()
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [captcha, setCaptcha] = useState(createCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [website, setWebsite] = useState('')
  const [isCreateAccount, setIsCreateAccount] = useState(false)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function submit(event) {
    event.preventDefault()
    setError('')

    if (isCreateAccount) {
      if (!name.trim() || !email.trim() || !password || !confirmPassword) {
        setError('Complete all fields to create your citizen ID.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
    }

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
      return
    }

    if (website) return

    if (captchaInput.trim() !== captcha.answer) {
      setCaptcha(createCaptcha())
      setCaptchaInput('')
      setError('Complete the CAPTCHA correctly before continuing.')
      return
    }

    if (isCreateAccount) {
      setIsCreateAccount(false)
      setConfirmPassword('')
      setCaptcha(createCaptcha())
      setCaptchaInput('')
      setError('')
      return
    }

    if (role === 'admin' && (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password)) {
      setError('Use the admin demo credentials shown below.')
      return
    }

    const name = role === 'admin'
      ? DEMO_ADMIN.name
      : email.trim().split('@')[0].replace(/[._-]/g, ' ') || 'Citizen'

    onLogin({ name, email: email.trim(), role })
    navigate(role === 'admin' ? '/admin' : '/', { replace: true })
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <video className="login-visual-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/videos/login-background.mp4" type="video/mp4" />
        </video>
        <div className="login-visual-video-overlay" aria-hidden="true" />
        <div className="login-orbit" />
        <div className="login-brand"><span className="login-brand-mark">N</span><span className="login-brand-name">NAGAR DRISHTI<small>THE AREA'S EYE</small></span></div>
        <div className="login-visual-copy">
          <div className="eyebrow"><span className="live-dot" /> CIVIC CONTROL CENTER</div>
          <h1>Make your area <em>visible.</em></h1>
          <p>Report civic issues, verify them with AI, and help your community move from observation to action.</p>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className={`login-card${isCreateAccount ? ' create-mode' : ''}`}>
          <button className="login-language-toggle" type="button" onClick={toggleLanguage}>{isHindi ? 'EN' : 'हिंदी'}</button>
          <div className="login-heading">
            <div key={isCreateAccount ? 'create-eyebrow' : 'login-eyebrow'} className="eyebrow">{isCreateAccount ? 'JOIN THE CITY NETWORK' : 'WELCOME BACK'}</div>
            <h2 key={isCreateAccount ? 'create-title' : 'login-title'}>{isCreateAccount ? 'Create your citizen ID' : 'Sign in to Nagar Drishti'}</h2>
            <p key={isCreateAccount ? 'create-description' : 'login-description'}>{isCreateAccount ? 'Set up your account to report and track civic issues.' : 'Choose your workspace to continue.'}</p>
          </div>

          {!isCreateAccount && <div className="login-role-tabs" role="tablist" aria-label="Account type">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => { setRole('user'); setError('') }}><UserRound size={16} /> Citizen</button>
            <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => { setRole('admin'); setError('') }}><ShieldCheck size={16} /> Admin</button>
          </div>}

          <form className="login-form" onSubmit={submit}>
            {isCreateAccount && <label><span>Full name</span><div className="login-input"><UserRound size={16} /><input type="text" value={name} onChange={event => setName(event.target.value)} placeholder="Your name" /></div></label>}
            <label><span>Email address</span><div className="login-input"><Mail size={16} /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={role === 'admin' ? 'admin@nagar.local' : 'Enter your Email'} /></div></label>
            <label><span>Password</span><div className="login-input"><LockKeyhole size={16} /><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" /></div></label>
            {isCreateAccount && <label><span>Confirm password</span><div className="login-input"><LockKeyhole size={16} /><input type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Repeat your password" /></div></label>}
            <div className="captcha-box">
              <div><span className="captcha-label">SECURITY CHECK</span><strong>{captcha.question} = ?</strong></div>
              <input aria-label="CAPTCHA answer" inputMode="numeric" value={captchaInput} onChange={event => setCaptchaInput(event.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="Answer" />
              <button type="button" onClick={() => { setCaptcha(createCaptcha()); setCaptchaInput(''); setError('') }}>New code</button>
            </div>
            <label className="captcha-honeypot" aria-hidden="true"><span>Website</span><input tabIndex="-1" autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)} /></label>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button key={isCreateAccount ? 'create-submit' : 'login-submit'} className="login-submit" type="submit">{isCreateAccount ? 'Create citizen ID' : `Continue to ${role === 'admin' ? 'admin' : 'citizen'} workspace`} <ArrowRight size={16} /></button>
          </form>

          {!isCreateAccount && <div className="login-create-account">
            <span>New to Nagar Drishti?</span>
            <button type="button" onClick={() => { setIsCreateAccount(true); setRole('user'); setError('') }}><UserPlus size={14} /> Create new ID</button>
          </div>}

          {isCreateAccount && <div className="login-create-account">
            <span>Already have an ID?</span>
            <button type="button" onClick={() => { setIsCreateAccount(false); setConfirmPassword(''); setError('') }}>Back to sign in</button>
          </div>}

          {!isCreateAccount && <div className="login-demo">
            {role === 'admin'
              ? <><strong>Demo admin access</strong><span>Email: admin@nagar.local</span><span>Password: admin123</span></>
              : <><strong>Citizen access</strong><span>Use any email and password for this local preview.</span></>}
          </div>}
        </div>
      </section>
    </main>
  )
}
