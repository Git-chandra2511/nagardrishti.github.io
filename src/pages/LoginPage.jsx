import { useState } from 'react'
import { ShieldCheck, UserRound, LockKeyhole, Mail, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n'

const DEMO_ADMIN = {
  email: 'admin@nagar.local',
  password: 'admin123',
  name: 'Area Administrator',
}

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const { isHindi, toggleLanguage } = useLanguage()
  const [role, setRole] = useState('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Enter your email and password to continue.')
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
        <div className="login-orbit" />
        <div className="login-brand"><span className="login-brand-mark">N</span><span>NAGAR DRISHTI<small>THE AREA'S EYE</small></span></div>
        <div className="login-visual-copy">
          <div className="eyebrow"><span className="live-dot" /> CIVIC CONTROL CENTER</div>
          <h1>Make your area <em>visible.</em></h1>
          <p>Report civic issues, verify them with AI, and help your community move from observation to action.</p>
        </div>
      </section>

      <section className="login-card-wrap">
        <div className="login-card">
          <button className="login-language-toggle" type="button" onClick={toggleLanguage}>{isHindi ? 'EN' : 'हिंदी'}</button>
          <div className="login-heading">
            <div className="eyebrow">WELCOME BACK</div>
            <h2>Sign in to Nagar Drishti</h2>
            <p>Choose your workspace to continue.</p>
          </div>

          <div className="login-role-tabs" role="tablist" aria-label="Account type">
            <button type="button" className={role === 'user' ? 'active' : ''} onClick={() => { setRole('user'); setError('') }}><UserRound size={16} /> Citizen</button>
            <button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => { setRole('admin'); setError('') }}><ShieldCheck size={16} /> Admin</button>
          </div>

          <form className="login-form" onSubmit={submit}>
            <label><span>Email address</span><div className="login-input"><Mail size={16} /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder={role === 'admin' ? 'admin@nagar.local' : 'you@example.com'} /></div></label>
            <label><span>Password</span><div className="login-input"><LockKeyhole size={16} /><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" /></div></label>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit">Continue to {role === 'admin' ? 'admin' : 'citizen'} workspace <ArrowRight size={16} /></button>
          </form>

          <div className="login-demo">
            {role === 'admin'
              ? <><strong>Demo admin access</strong><span>Email: admin@nagar.local</span><span>Password: admin123</span></>
              : <><strong>Citizen access</strong><span>Use any email and password for this local preview.</span></>}
          </div>
        </div>
      </section>
    </main>
  )
}
