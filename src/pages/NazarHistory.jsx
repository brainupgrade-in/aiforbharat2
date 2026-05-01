import { useQuery } from '@apollo/client'
import { t } from '../lib/i18n'
import LotusSeverity from '../components/LotusSeverity'
import { LIST_RETINA_SCANS } from '../lib/queries'

const CLASS_TO_SEVERITY = {
  'No DR': 0,
  'Mild NPDR': 1,
  'Moderate NPDR': 2,
  'Severe NPDR': 3,
  'Proliferative DR': 4,
}

const RISK_TONE = {
  low: { bg: 'bg-mango-light', text: 'text-mango-green' },
  moderate: { bg: 'bg-amber-light', text: 'text-amber-deep' },
  high: { bg: 'bg-kumkum-light', text: 'text-kumkum-red' },
}

function formatScanDate(iso) {
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
}

export default function NazarHistory({ lang, onSelectScan }) {
  const { data, loading } = useQuery(LIST_RETINA_SCANS, { variables: { limit: 50 } })
  const scans = data?.retina_scan || []

  return (
    <div className="space-y-4 animate-fade-up">
      <h1 className="font-display text-heading font-bold text-teal-deep">{t('scanHistoryTitle', lang)}</h1>

      {loading && scans.length === 0 ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
        </div>
      ) : scans.length === 0 ? (
        <div className="card-warm text-center py-10">
          <p className="text-caption text-ink-muted">{t('scanHistoryEmpty', lang)}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scans.map((scan) => {
            const severity = CLASS_TO_SEVERITY[scan.classification] ?? 0
            const tone = RISK_TONE[scan.risk_level] || RISK_TONE.low
            return (
              <button
                key={scan.id}
                onClick={() => onSelectScan?.(scan)}
                className="card-warm w-full flex items-center gap-4 !py-3 text-left active:scale-[0.99] transition-transform hover:border-teal-pale border-2 border-transparent"
                aria-label={`View ${scan.classification} scan from ${formatScanDate(scan.created_at)}`}
              >
                <LotusSeverity petals={severity} size={42} animate={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-ink truncate">
                    {scan.classification}
                  </p>
                  <p className="text-[11px] text-ink-muted">{formatScanDate(scan.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${tone.bg} ${tone.text}`}>
                    {scan.risk_level}
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    {Math.round((scan.confidence || 0) * 100)}%
                  </span>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A8A9A" strokeWidth="2" className="shrink-0" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
