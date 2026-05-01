import { useState, useEffect } from 'react'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import MarigoldCelebration from '../components/MarigoldCelebration'
import NearbyDoctors from '../components/NearbyDoctors'

const GRADE_LABELS_EN = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Proliferative DR']
const REFERRAL_MONTHS = [12, 6, 3, 1, 0]

export default function NazarResult({ lang, result, onNavigate }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(timer)
  }, [])

  if (!result) return null

  const {
    severity,
    confidence,
    patientId,
    hasDr,
    recommendations = [],
  } = result

  const isOk = !hasDr
  const nextMonths = REFERRAL_MONTHS[severity]

  return (
    <>
      <MarigoldCelebration active={revealed && isOk} />

      <div className={revealed ? 'animate-iris-expand' : 'opacity-0'}>
        <div className="space-y-5 animate-fade-up">
          <div className={`rounded-3xl p-6 text-center ${
            isOk
              ? 'bg-mango-light border-2 border-mango-green/30'
              : 'bg-kumkum-light border-2 border-kumkum-red/30 animate-pulse-border'
          }`}>
            <div className="flex justify-center mb-3">
              <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                <ellipse cx="28" cy="28" rx="26" ry="16" fill="none" stroke={isOk ? '#4CAF50' : '#D32F2F'} strokeWidth="2.5" />
                <circle cx="28" cy="28" r="8" fill={isOk ? '#4CAF50' : '#D32F2F'} />
                <circle cx="28" cy="28" r="3" fill="white" opacity="0.7" />
              </svg>
            </div>

            <h1 className={`font-display text-display font-bold ${isOk ? 'text-mango-green' : 'text-kumkum-red'}`}>
              {isOk ? t('eyesOk', lang) : t('seeDoctor', lang)}
            </h1>

            <div className="flex justify-center my-4">
              <LotusSeverity petals={severity} size={80} animate={true} />
            </div>

            <p className="font-body text-body text-ink-light leading-relaxed max-w-sm mx-auto">
              {isOk
                ? t('eyesOkDetail', lang)
                : t('seeDoctorDetail', lang, { stage: severity.toString() })}
            </p>
          </div>

          {recommendations.length > 0 && (
            <div className="card-warm">
              <h2 className="font-display font-semibold text-ink mb-3">{t('recommendations', lang)}</h2>
              <ul className="space-y-2">
                {recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-caption text-ink-light">
                    <span className="text-teal-deep mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!isOk && (
            <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
              <NearbyDoctors
                lang={lang}
                scanResult={{ patientId, confidence, gradeLabel: GRADE_LABELS_EN[severity] }}
              />
            </div>
          )}

          <div className="card-teal flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-deep rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="font-body text-body text-ink">
              {t('nextScanIn', lang)}{' '}
              <span className="font-display font-bold text-teal-deep">{nextMonths} {t('months', lang)}</span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('scan')}
            className="btn-amber w-full gap-2"
            aria-label={t('scanAgain', lang)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {t('scanAgain', lang)}
          </button>

          <p className="text-[11px] text-ink-muted text-center leading-relaxed px-4">
            AI screening for early detection only. Not a medical diagnosis.
            Always consult a qualified ophthalmologist.
          </p>
        </div>
      </div>
    </>
  )
}
