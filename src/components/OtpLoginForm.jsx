import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../lib/auth.jsx'
import { t } from '../lib/i18n'

const COOLDOWN_MS = 60_000

export default function OtpLoginForm({ lang = 'en' }) {
  const { requestLogin, verifyOtp } = useAuth()
  const [stage, setStage] = useState('email')   // email | otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const infoTimerRef = useRef(null)

  useEffect(() => {
    if (cooldownUntil <= Date.now()) {
      setSecondsLeft(0)
      return
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000))
      setSecondsLeft(remaining)
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [cooldownUntil])

  const flashInfo = (msg) => {
    setInfo(msg)
    if (infoTimerRef.current) clearTimeout(infoTimerRef.current)
    infoTimerRef.current = setTimeout(() => setInfo(''), 4000)
  }

  const startCooldown = () => setCooldownUntil(Date.now() + COOLDOWN_MS)

  const submitEmail = async (e) => {
    e.preventDefault()
    setError(''); setInfo(''); setBusy(true)
    try {
      await requestLogin(email.trim())
      startCooldown()
      setStage('otp')
    } catch (err) {
      setError(err.message || t('couldNotSendCode', lang))
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
      setError(err.message || t('invalidCode', lang))
    } finally {
      setBusy(false)
    }
  }

  const handleResend = async () => {
    if (secondsLeft > 0 || busy) return
    setError(''); setBusy(true)
    try {
      await requestLogin(email.trim())
      startCooldown()
      setOtp('')
      flashInfo(t('codeResent', lang))
    } catch (err) {
      setError(err.message || t('couldNotSendCode', lang))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-ink">{t('signIn', lang)}</h2>
        <p className="text-sm text-ink-muted mt-1">
          {stage === 'email' ? t('emailIntro', lang) : t('otpIntro', lang, { email })}
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
            placeholder={t('emailPlaceholder', lang)}
            className="input-nazar w-full"
          />
          <button type="submit" disabled={busy || !email} className="btn-teal w-full">
            {busy ? t('sending', lang) : t('sendCode', lang)}
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
            {busy ? t('verifying', lang) : t('verifyAndSignIn', lang)}
          </button>

          <div className="flex items-center justify-between text-sm pt-1">
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || busy}
              className="text-teal-deep hover:underline disabled:text-ink-muted disabled:no-underline disabled:cursor-not-allowed"
            >
              {secondsLeft > 0 ? t('resendIn', lang, { seconds: secondsLeft }) : t('resendCode', lang)}
            </button>
            <button
              type="button"
              onClick={() => { setStage('email'); setOtp(''); setError(''); setInfo('') }}
              className="text-teal-deep hover:underline"
            >
              {t('useDifferentEmail', lang)}
            </button>
          </div>
        </form>
      )}

      {info && (
        <div className="text-sm text-mango-green bg-mango-light px-3 py-2 rounded-lg">
          {info}
        </div>
      )}

      {error && (
        <div className="text-sm text-kumkum-red bg-kumkum-light px-3 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
