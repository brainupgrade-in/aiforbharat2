import { useState, useEffect } from 'react'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import MarigoldCelebration from '../components/MarigoldCelebration'
import NearbyDoctors from '../components/NearbyDoctors'

const GRADES = ['noDR', 'mild', 'moderate', 'severe', 'proliferative']
const GRADE_LABELS_EN = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Proliferative DR']
const REFERRAL_MONTHS = [12, 6, 3, 1, 0]
const PROB_ORDER = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Proliferative DR']

export default function NazarResult({ lang, result, onNavigate }) {
  const [revealed, setRevealed] = useState(false)
  const [doctorMode, setDoctorMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(timer)
  }, [])

  if (!result) return null

  const {
    severity,
    confidence,
    patientId,
    classification,
    riskLevel,
    hasDr,
    probs = {},
    recommendations = [],
    scanId,
    inferenceMs,
  } = result

  const isOk = !hasDr
  const gradeKey = GRADES[severity]
  const nextMonths = REFERRAL_MONTHS[severity]

  return (
    <>
      <MarigoldCelebration active={revealed && isOk} />

      <div className={revealed ? 'animate-iris-expand' : 'opacity-0'}>
        <div className="space-y-5">

          <div className="flex justify-end">
            <button
              onClick={() => setDoctorMode(!doctorMode)}
              className="text-caption font-medium text-teal-deep bg-teal-pale px-4 py-2 rounded-full hover:bg-teal-ghost transition-colors"
              aria-label={doctorMode ? t('patientMode', lang) : t('doctorMode', lang)}
            >
              {doctorMode ? t('patientMode', lang) : t('doctorMode', lang)}
            </button>
          </div>

          {/* === PATIENT MODE === */}
          {!doctorMode && (
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

              {/* Recommendations from the model service */}
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
            </div>
          )}

          {/* === DOCTOR MODE === */}
          {doctorMode && (
            <div className="space-y-4 animate-fade-up">
              <div className={`card-warm border-2 ${severity > 2 ? 'border-kumkum-red/40' : 'border-teal-pale'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-caption text-ink-muted">Patient: {patientId}</p>
                    <p className="text-caption text-ink-muted">Scan: {new Date().toLocaleDateString('en-IN')}</p>
                    {scanId && <p className="text-[10px] text-ink-muted/60 font-mono mt-0.5">ID: {scanId.slice(0, 8)}…</p>}
                  </div>
                  <LotusSeverity petals={severity} size={56} animate={false} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-ivory rounded-xl p-3">
                    <p className="text-caption text-ink-muted">{t('drGrade', lang)}</p>
                    <p className={`font-display font-bold text-body-lg ${severity > 2 ? 'text-kumkum-red' : severity > 0 ? 'text-amber-deep' : 'text-mango-green'}`}>
                      {classification || t(gradeKey, lang)}
                    </p>
                  </div>
                  <div className="bg-ivory rounded-xl p-3">
                    <p className="text-caption text-ink-muted">{t('confidence', lang)}</p>
                    <p className="font-mono font-semibold text-body-lg text-teal-deep">{confidence}%</p>
                  </div>
                </div>

                {/* Class probability bars (real model output) */}
                <div className="bg-ivory rounded-xl p-3">
                  <h3 className="font-body font-semibold text-ink text-caption mb-2">Class probabilities</h3>
                  <div className="space-y-1.5">
                    {PROB_ORDER.map((cls) => {
                      const p = probs[cls] || 0
                      const pct = Math.round(p * 100)
                      const isTop = cls === classification
                      return (
                        <div key={cls} className="flex items-center gap-2 text-[11px]">
                          <span className={`w-32 shrink-0 ${isTop ? 'font-semibold text-ink' : 'text-ink-light'}`}>{cls}</span>
                          <div className="flex-1 h-1.5 bg-ivory-dark rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isTop ? 'bg-teal-deep' : 'bg-teal-medium/40'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className={`w-10 text-right font-mono ${isTop ? 'font-semibold text-ink' : 'text-ink-muted'}`}>{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                  {riskLevel && (
                    <div className="mt-3 pt-3 border-t border-ivory-dark/40 flex justify-between text-[11px]">
                      <span className="text-ink-muted">Risk level</span>
                      <span className={`font-semibold uppercase tracking-wide ${
                        riskLevel === 'high' ? 'text-kumkum-red' : riskLevel === 'moderate' ? 'text-amber-deep' : 'text-mango-green'
                      }`}>
                        {riskLevel}
                      </span>
                    </div>
                  )}
                  {inferenceMs != null && (
                    <p className="text-[10px] text-ink-muted/60 mt-2 text-right">Inference: {Math.round(inferenceMs)} ms</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button className="btn-teal !bg-kumkum-red !text-sm !px-3" aria-label={t('refer', lang)}>
                  {t('refer', lang)}
                </button>
                <button className="btn-outline !text-sm !px-3" aria-label={t('reviewLater', lang)}>
                  {t('reviewLater', lang)}
                </button>
                <button className="btn-teal !bg-mango-green !text-sm !px-3" aria-label={t('markNormal', lang)}>
                  {t('markNormal', lang)}
                </button>
              </div>

              <button className="btn-outline w-full gap-2" aria-label={t('exportEHR', lang)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                {t('exportEHR', lang)}
              </button>
            </div>
          )}

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
