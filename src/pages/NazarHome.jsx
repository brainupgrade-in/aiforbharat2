import { useState, useEffect } from 'react'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import { getUserLocation, getCachedLocation } from '../lib/location'

const sugarData = [
  { day: 'Mon', f: 118, p: 156 },
  { day: 'Tue', f: 112, p: 148 },
  { day: 'Wed', f: 126, p: 165 },
  { day: 'Thu', f: 108, p: 142 },
  { day: 'Fri', f: 115, p: 152 },
  { day: 'Sat', f: 122, p: 170 },
  { day: 'Sun', f: 110, p: 145 },
]

function Sparkline({ data, dataKey, color, height = 40 }) {
  const values = data.map((d) => d[dataKey])
  const min = Math.min(...values) - 10
  const max = Math.max(...values) + 10
  const range = max - min
  const w = 200
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${height - ((v - min) / range) * height}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => (
        <circle
          key={i}
          cx={(i / (values.length - 1)) * w}
          cy={height - ((v - min) / range) * height}
          r="3"
          fill={color}
        />
      ))}
    </svg>
  )
}

export default function NazarHome({ lang, onNavigate }) {
  const [location, setLocation] = useState(getCachedLocation)

  useEffect(() => {
    if (!location) {
      getUserLocation().then(setLocation).catch(() => {})
    }
  }, [])

  const lastScanDate = '28 Feb 2026'
  const lastScanResult = 0 // 0 = no DR
  const streakDays = 14
  const communityCount = 2847
  const locationName = location?.short?.split(',')[0] || location?.town || location?.village || null

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Hero Greeting */}
      <div className="text-center pt-2">
        <h1 className="font-display text-display font-bold text-teal-deep leading-tight">
          {t('greeting', lang)}
        </h1>
        <p className="font-body text-body text-ink-muted mt-1">
          {t('greetingSub', lang)}
        </p>
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

      {/* Last Scan Card */}
      <div className="card-warm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-ink-muted font-medium">{t('lastScan', lang)}</p>
            <p className="font-body font-semibold text-ink mt-0.5">{lastScanDate}</p>
          </div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-caption text-ink-muted font-medium text-right">{t('result', lang)}</p>
              <p className={`font-display font-bold text-right ${
                lastScanResult === 0 ? 'text-mango-green' : 'text-kumkum-red'
              }`}>
                {t(lastScanResult === 0 ? 'noDR' : 'mild', lang)}
              </p>
            </div>
            <LotusSeverity petals={lastScanResult} size={48} animate={false} />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="card-teal flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-warm rounded-xl flex items-center justify-center shrink-0">
          <span className="text-2xl" role="img" aria-hidden="true">🔥</span>
        </div>
        <div>
          <p className="font-display font-bold text-teal-deep text-xl">
            {streakDays} {t('streak', lang)}
          </p>
        </div>
      </div>

      {/* Blood Sugar Sparkline */}
      <div className="card-warm">
        <h2 className="font-display font-semibold text-ink text-body-lg mb-3">{t('bloodSugar', lang)}</h2>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-caption text-ink-muted">{t('fasting', lang)}</span>
              <span className="font-mono text-caption text-teal-deep font-medium">Avg 116 mg/dL</span>
            </div>
            <Sparkline data={sugarData} dataKey="f" color="#0A6E6E" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-caption text-ink-muted">{t('postMeal', lang)}</span>
              <span className="font-mono text-caption text-amber-deep font-medium">Avg 154 mg/dL</span>
            </div>
            <Sparkline data={sugarData} dataKey="p" color="#F5A623" />
          </div>
        </div>
        {/* Day labels */}
        <div className="flex justify-between mt-1 px-0.5">
          {sugarData.map((d) => (
            <span key={d.day} className="text-[10px] text-ink-muted">{d.day}</span>
          ))}
        </div>
      </div>

      {/* Community stat */}
      <div className="bg-teal-deep rounded-2xl p-4 text-white flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="font-body text-caption">
          <span className="font-display font-bold text-body-lg text-amber-warm">
            {communityCount.toLocaleString()}
          </span>{' '}
          {t('communityToday', lang)} {locationName || t('rajasthan', lang)}
        </p>
      </div>
    </div>
  )
}
