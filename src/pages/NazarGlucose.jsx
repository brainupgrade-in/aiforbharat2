import { useState, useEffect, useCallback } from 'react'
import { t } from '../lib/i18n'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const CONTEXTS = {
  en: ['Fasting', 'Before meal', 'After meal', 'Random', 'Bedtime'],
  hi: ['खाली पेट', 'खाने से पहले', 'खाने के बाद', 'कभी भी', 'सोने से पहले'],
  kn: ['ಖಾಲಿ ಹೊಟ್ಟೆ', 'ಊಟಕ್ಕೆ ಮುಂಚೆ', 'ಊಟದ ನಂತರ', 'ಯಾವಾಗಲಾದರೂ', 'ಮಲಗುವ ಮುಂಚೆ'],
}

// Context value mapping for DynamoDB (always store English)
const CONTEXT_MAP = {
  'खाली पेट': 'Fasting', 'खाने से पहले': 'Before meal', 'खाने के बाद': 'After meal',
  'कभी भी': 'Random', 'सोने से पहले': 'Bedtime',
  'ಖಾಲಿ ಹೊಟ್ಟೆ': 'Fasting', 'ಊಟಕ್ಕೆ ಮುಂಚೆ': 'Before meal', 'ಊಟದ ನಂತರ': 'After meal',
  'ಯಾವಾಗಲಾದರೂ': 'Random', 'ಮಲಗುವ ಮುಂಚೆ': 'Bedtime',
}

function getStatus(value, context) {
  const enContext = CONTEXT_MAP[context] || context
  if (enContext === 'Fasting' && value > 100) return 'high'
  if (enContext === 'After meal' && value > 140) return 'high'
  if (value > 140) return 'high'
  if (value < 70) return 'low'
  return 'normal'
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
  if (diff < 86400000) return `Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export default function NazarGlucose({ lang }) {
  const [showForm, setShowForm] = useState(false)
  const [readings, setReadings] = useState([])
  const [glucoseValue, setGlucoseValue] = useState('')
  const [mealContext, setMealContext] = useState((CONTEXTS[lang] || CONTEXTS.en)[0])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [client, setClient] = useState(null)

  // Initialize Amplify client and load readings on mount
  useEffect(() => {
    let cancelled = false
    async function init() {
      let c = null
      try {
        const mod = await import('aws-amplify/data')
        c = mod.generateClient()
        if (!cancelled) setClient(c)
      } catch {
        // Amplify Data not available
      }
      if (!cancelled) loadReadings(c)
    }
    init()
    return () => { cancelled = true }
  }, [])

  const loadReadings = useCallback(async (c) => {
    setLoading(true)
    if (c) {
      try {
        const { data } = await c.models.GlucoseReading.list({
          limit: 50,
        })
        const sorted = (data || []).sort((a, b) => new Date(b.readingAt) - new Date(a.readingAt))
        setReadings(sorted.map((r) => ({
          id: r.id,
          value: r.value,
          context: r.context,
          notes: r.notes,
          time: r.readingAt,
          status: r.status || getStatus(r.value, r.context),
        })))
      } catch (err) {
        console.error('Failed to load readings:', err)
      }
    }
    setLoading(false)
  }, [])

  const handleSave = async () => {
    if (!glucoseValue) return
    const val = parseInt(glucoseValue)
    if (isNaN(val) || val < 30 || val > 600) return

    const enContext = CONTEXT_MAP[mealContext] || mealContext
    const status = getStatus(val, enContext)
    const now = new Date().toISOString()

    setSaving(true)

    const newReading = {
      id: Date.now().toString(),
      value: val,
      context: enContext,
      notes: notes || undefined,
      time: now,
      status,
    }

    // Save to DynamoDB if Amplify client is available
    const dbClient = client
    if (dbClient) {
      try {
        const { data } = await dbClient.models.GlucoseReading.create({
          value: val,
          context: enContext,
          notes: notes || undefined,
          readingAt: now,
          status,
        })
        if (data) newReading.id = data.id
      } catch (err) {
        console.error('Failed to save reading:', err)
      }
    }

    setReadings((prev) => [newReading, ...prev])
    setGlucoseValue('')
    setNotes('')
    setShowForm(false)
    setSaving(false)
  }

  // Build trend data from last 7 readings
  const trendData = [...readings]
    .reverse()
    .slice(-8)
    .map((r) => ({
      date: new Date(r.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value: r.value,
    }))

  const contexts = CONTEXTS[lang] || CONTEXTS.en

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-heading font-bold text-teal-deep">
          {t('glucoseTitle', lang)}
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-amber !px-4 !py-2 gap-1.5 !text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('logReading', lang)}
        </button>
      </div>

      {/* DynamoDB connection indicator */}
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${client ? 'bg-mango-green' : 'bg-amber-warm'}`} />
        <span className="text-[10px] text-ink-muted">
          {client ? t('cloudSync', lang) : t('localOnly', lang)}
        </span>
      </div>

      {/* Add Reading Form */}
      {showForm && (
        <div className="card-warm space-y-3 animate-fade-up">
          <h2 className="font-display font-semibold text-ink">{t('recordReading', lang)}</h2>
          <div>
            <label className="block text-caption font-medium text-ink-light mb-1.5">
              {t('glucoseLevel', lang)}
            </label>
            <input
              type="number"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(e.target.value)}
              placeholder="e.g., 120"
              className="input-nazar"
              min="30"
              max="600"
            />
            <p className="text-[11px] text-ink-muted mt-1">{t('normalRange', lang)}</p>
          </div>
          <div>
            <label className="block text-caption font-medium text-ink-light mb-1.5">
              {t('mealContext', lang)}
            </label>
            <select
              value={mealContext}
              onChange={(e) => setMealContext(e.target.value)}
              className="input-nazar"
            >
              {contexts.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-caption font-medium text-ink-light mb-1.5">
              {t('notesOptional', lang)}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notesPlaceholder', lang)}
              className="input-nazar !min-h-[60px] resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-teal flex-1 !text-sm">
              {saving ? t('saving', lang) : t('saveReading', lang)}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-outline flex-1 !text-sm">
              {t('cancel', lang)}
            </button>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      {trendData.length > 1 && (
        <div className="card-warm">
          <h2 className="font-display font-semibold text-ink mb-3">{t('glucoseTrend', lang)}</h2>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D6" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8A8A9A' }} stroke="#E8E0D6" />
                <YAxis tick={{ fontSize: 10, fill: '#8A8A9A' }} stroke="#E8E0D6" domain={[60, 200]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <ReferenceLine y={100} stroke="#4CAF50" strokeDasharray="3 3" label={{ value: '100', fill: '#4CAF50', fontSize: 10 }} />
                <ReferenceLine y={140} stroke="#D32F2F" strokeDasharray="3 3" label={{ value: '140', fill: '#D32F2F', fontSize: 10 }} />
                <Line type="monotone" dataKey="value" stroke="#0A6E6E" strokeWidth={2.5} dot={{ r: 4, fill: '#0A6E6E' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Readings */}
      <div className="card-warm">
        <h2 className="font-display font-semibold text-ink mb-3">{t('recentReadings', lang)}</h2>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
          </div>
        ) : readings.length === 0 ? (
          <p className="text-center text-ink-muted text-sm py-6">{t('noReadings', lang)}</p>
        ) : (
          <div className="space-y-2">
            {readings.slice(0, 10).map((reading) => (
              <div key={reading.id} className="flex items-center justify-between py-2.5 border-b border-ivory-dark/30 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    reading.status === 'high' ? 'bg-kumkum-light' : reading.status === 'low' ? 'bg-amber-light' : 'bg-mango-light'
                  }`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={
                      reading.status === 'high' ? '#D32F2F' : reading.status === 'low' ? '#B87333' : '#4CAF50'
                    } strokeWidth="2">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-display font-bold text-ink">{reading.value} mg/dL</div>
                    <div className="text-[11px] text-ink-muted">{reading.context} &bull; {formatTime(reading.time)}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                  reading.status === 'high'
                    ? 'bg-kumkum-light text-kumkum-red'
                    : reading.status === 'low'
                    ? 'bg-amber-light text-amber-deep'
                    : 'bg-mango-light text-mango-green'
                }`}>
                  {reading.status === 'high' ? t('high', lang) : reading.status === 'low' ? t('low', lang) : t('normal', lang)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card-teal">
        <h2 className="font-display font-semibold text-ink mb-2 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {t('tipsTitle', lang)}
        </h2>
        <ul className="space-y-1.5 text-caption text-ink-light">
          <li>{t('tip1', lang)}</li>
          <li>{t('tip2', lang)}</li>
          <li>{t('tip3', lang)}</li>
          <li>{t('tip4', lang)}</li>
        </ul>
      </div>
    </div>
  )
}
