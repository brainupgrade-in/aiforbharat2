import { useState, useEffect } from 'react'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import MarigoldCelebration from '../components/MarigoldCelebration'
import NearbyDoctors from '../components/NearbyDoctors'

const GRADES = ['noDR', 'mild', 'moderate', 'severe', 'proliferative']
const GRADE_LABELS_EN = ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Proliferative DR']
const REFERRAL_MONTHS = [12, 6, 3, 1, 0]

export default function NazarResult({ lang, result, onNavigate }) {
  const [revealed, setRevealed] = useState(false)
  const [doctorMode, setDoctorMode] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(timer)
  }, [])

  if (!result) return null

  const { severity, confidence, patientId, findings } = result
  const isOk = severity === 0
  const gradeKey = GRADES[severity]
  const nextMonths = REFERRAL_MONTHS[severity]

  return (
    <>
      <MarigoldCelebration active={revealed && isOk} />

      {/* Iris reveal wrapper */}
      <div className={revealed ? 'animate-iris-expand' : 'opacity-0'}>
        <div className="space-y-5">

          {/* Demo Mode indicator */}
          <div className="bg-amber-light/60 rounded-xl px-3 py-2 text-[11px] text-ink-light text-center">
            {t('demoMode', lang)} — Simulated AI results for demonstration
          </div>

          {/* Toggle Patient/Doctor */}
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
              {/* Big result */}
              <div className={`rounded-3xl p-6 text-center ${
                isOk
                  ? 'bg-mango-light border-2 border-mango-green/30'
                  : 'bg-kumkum-light border-2 border-kumkum-red/30 animate-pulse-border'
              }`}>
                {/* Eye icon */}
                <div className="flex justify-center mb-3">
                  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                    <ellipse cx="28" cy="28" rx="26" ry="16" fill="none"
                      stroke={isOk ? '#4CAF50' : '#D32F2F'} strokeWidth="2.5" />
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

              {/* Location-aware doctor finder */}
              {!isOk && (
                <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
                  <NearbyDoctors
                    lang={lang}
                    scanResult={{
                      patientId,
                      confidence,
                      gradeLabel: GRADE_LABELS_EN[severity],
                    }}
                  />
                </div>
              )}

              {/* Next scan timing */}
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
              {/* Clinical header */}
              <div className={`card-warm border-2 ${severity > 2 ? 'border-kumkum-red/40' : 'border-teal-pale'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-caption text-ink-muted">Patient: {patientId}</p>
                    <p className="text-caption text-ink-muted">Scan: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                  <LotusSeverity petals={severity} size={56} animate={false} />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-ivory rounded-xl p-3">
                    <p className="text-caption text-ink-muted">{t('drGrade', lang)}</p>
                    <p className={`font-display font-bold text-body-lg ${severity > 2 ? 'text-kumkum-red' : severity > 0 ? 'text-amber-deep' : 'text-mango-green'}`}>
                      {t(gradeKey, lang)}
                    </p>
                  </div>
                  <div className="bg-ivory rounded-xl p-3">
                    <p className="text-caption text-ink-muted">{t('confidence', lang)}</p>
                    <p className="font-mono font-semibold text-body-lg text-teal-deep">{confidence}%</p>
                  </div>
                </div>

                {/* Lesion annotations */}
                <div className="bg-ivory rounded-xl p-3">
                  <h3 className="font-body font-semibold text-ink text-caption mb-2">Lesion Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-caption">
                      <span className="text-ink-light">Microaneurysms (MA)</span>
                      <span className="font-mono font-medium text-ink">{findings.ma} detected</span>
                    </div>
                    <div className="flex justify-between text-caption">
                      <span className="text-ink-light">Hemorrhages (HE)</span>
                      <span className={`font-mono font-medium ${findings.he ? 'text-kumkum-red' : 'text-mango-green'}`}>
                        {findings.he ? 'Present' : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-caption">
                      <span className="text-ink-light">Neovascularization (NVE)</span>
                      <span className={`font-mono font-medium ${findings.nve ? 'text-kumkum-red' : 'text-mango-green'}`}>
                        {findings.nve ? 'Detected' : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between text-caption">
                      <span className="text-ink-light">New Vessels (NVD)</span>
                      <span className={`font-mono font-medium ${findings.neovasc ? 'text-kumkum-red font-bold' : 'text-mango-green'}`}>
                        {findings.neovasc ? 'PRESENT' : 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor actions */}
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

          {/* Scan another */}
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

          {/* Disclaimer */}
          <p className="text-[11px] text-ink-muted text-center leading-relaxed px-4">
            AI screening for early detection only. Not a medical diagnosis.
            Always consult a qualified ophthalmologist.
          </p>
        </div>
      </div>
    </>
  )
}
