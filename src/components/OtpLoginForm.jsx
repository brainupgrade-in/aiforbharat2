import { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'

export default function OtpLoginForm() {
  const { requestLogin, verifyOtp } = useAuth()
  const [stage, setStage] = useState('email')   // email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const submitEmail = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await requestLogin(email.trim())
      setStage('otp')
    } catch (err) {
      setError(err.message || 'Could not send code')
    } finally {
      setBusy(false)
    }
  }

  const submitOtp = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await verifyOtp(email.trim(), otp.trim())
    } catch (err) {
      setError(err.message || 'Invalid code')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-ink">Sign in</h2>
        <p className="text-sm text-ink-muted mt-1">
          {stage === 'email' ? 'We\'ll email you a 6-digit code' : `Enter the code sent to ${email}`}
        </p>
      </div>

      {stage === 'email' && (
        <form onSubmit={submitEmail} className="space-y-3">
          <input
            type="email"
            required
            autoFocus
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="input-nazar w-full"
          />
          <button type="submit" disabled={busy || !email} className="btn-teal w-full">
            {busy ? 'Sending…' : 'Send code'}
          </button>
        </form>
      )}

      {stage === 'otp' && (
        <form onSubmit={submitOtp} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="input-nazar w-full text-center tracking-[0.5em] font-display text-xl"
          />
          <button type="submit" disabled={busy || otp.length !== 6} className="btn-teal w-full">
            {busy ? 'Verifying…' : 'Verify & sign in'}
          </button>
          <button
            type="button"
            onClick={() => { setStage('email'); setOtp(''); setError('') }}
            className="text-sm text-teal-deep hover:underline w-full text-center"
          >
            Use a different email
          </button>
        </form>
      )}

      {error && (
        <div className="text-sm text-kumkum-red bg-kumkum-light px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
