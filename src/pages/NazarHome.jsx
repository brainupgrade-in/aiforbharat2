import { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import { getUserLocation, getCachedLocation } from '../lib/location'
import { LIST_RETINA_SCANS, LIST_GLUCOSE_READINGS } from '../lib/queries'

const CLASS_TO_SEVERITY = {
  'No DR': 0,
  'Mild NPDR': 1,
  'Moderate NPDR': 2,
  'Severe NPDR': 3,
  'Proliferative DR': 4,
}
const GRADE_KEYS = ['noDR', 'mild', 'moderate', 'severe', 'proliferative']

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function relativeTime(dateStr) {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  if (diff < 60_000) return 'just now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} h ago`
  return `${Math.floor(diff / 86_400_000)}d ago`
}

export default function NazarHome({ lang, onNavigate }) {
  const [location, setLocation] = useState(getCachedLocation)

  useEffect(() => {
    if (!location) {
      getUserLocation().then(setLocation).catch(() => {})
    }
  }, [])

  const { data: scansData } = useQuery(LIST_RETINA_SCANS, { variables: { limit: 1 } })
  const { data: glucoseData } = useQuery(LIST_GLUCOSE_READINGS, { variables: { limit: 5 } })

  const lastScan = scansData?.retina_scan?.[0]
  const lastSeverity = lastScan ? (CLASS_TO_SEVERITY[lastScan.classification] ?? 0) : null
  const recentReadings = glucoseData?.glucose_reading || []

  const locationName = location?.short?.split(',')[0] || location?.town || location?.village || null

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Hero greeting */}
      <div className="text-center pt-2">
        <h1 className="font-display text-display font-bold text-teal-deep leading-tight">
          {t('greeting', lang)}
        </h1>
        <p className="font-body text-body text-ink-muted mt-1">
          {t('greetingSub', lang)}
        </p>
        {locationName && (
          <p className="font-body text-caption text-ink-muted mt-1.5 inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {locationName}
          </p>
        )}
      </div>

      {/* Scan CTA */}
      <button
        onClick={() => onNavigate('scan')}
        className="btn-amber w-full text-xl gap-3 py-5 rounded-2xl"
        aria-label={t('scanToday', lang)}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        {t('scanToday', lang)}
      </button>

      {/* Last scan */}
      {lastScan ? (
        <div className="card-warm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-ink-muted font-medium">{t('lastScan', lang)}</p>
              <p className="font-body font-semibold text-ink mt-0.5">{formatDate(lastScan.created_at)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-caption text-ink-muted font-medium text-right">{t('result', lang)}</p>
                <p className={`font-display font-bold text-right ${
                  lastSeverity === 0 ? 'text-mango-green' : lastSeverity > 2 ? 'text-kumkum-red' : 'text-amber-deep'
                }`}>
                  {t(GRADE_KEYS[lastSeverity], lang)}
                </p>
              </div>
              <LotusSeverity petals={lastSeverity} size={48} animate={false} />
            </div>
          </div>
        </div>
      ) : (
        <div className="card-warm text-center py-5">
          <div className="w-12 h-12 mx-auto mb-2 bg-teal-pale rounded-full flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2">
              <ellipse cx="12" cy="12" rx="10" ry="6" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <p className="font-display font-semibold text-ink">{t('noScansYet', lang)}</p>
          <p className="font-body text-caption text-ink-muted mt-1">{t('noScansYetSub', lang)}</p>
        </div>
      )}

      {/* Recent glucose */}
      {recentReadings.length > 0 ? (
        <div className="card-warm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-ink text-body-lg">{t('recentGlucose', lang)}</h2>
            <button
              onClick={() => onNavigate('glucose')}
              className="text-caption font-medium text-teal-deep hover:underline"
            >
              {t('seeAll', lang)} →
            </button>
          </div>
          <div className="space-y-2">
            {recentReadings.map((r) => {
              const status = r.status || 'normal'
              return (
                <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-ivory-dark/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      status === 'high' ? 'bg-kumkum-light' : status === 'low' ? 'bg-amber-light' : 'bg-mango-light'
                    }`}>
                      <span className={`font-mono font-bold text-[13px] ${
                        status === 'high' ? 'text-kumkum-red' : status === 'low' ? 'text-amber-deep' : 'text-mango-green'
                      }`}>{r.value}</span>
                    </div>
                    <div>
                      <p className="font-body text-caption text-ink">{r.context}</p>
                      <p className="text-[11px] text-ink-muted">{relativeTime(r.reading_at)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card-warm text-center py-5">
          <p className="font-display font-semibold text-ink">{t('noGlucoseYet', lang)}</p>
          <p className="font-body text-caption text-ink-muted mt-1 mb-3">{t('noGlucoseYetSub', lang)}</p>
          <button onClick={() => onNavigate('glucose')} className="btn-teal !py-2 !px-4 !text-sm gap-1.5 mx-auto">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('logReadingShort', lang)}
          </button>
        </div>
      )}
    </div>
  )
}
