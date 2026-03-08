import { useState, useEffect } from 'react'
import { t } from '../lib/i18n'
import { getUserLocation, getCachedLocation } from '../lib/location'

const stateData = [
  { name: 'Rajasthan', nameHi: 'राजस्थान', nameKn: 'ರಾಜಸ್ಥಾನ', scans: 48720 },
  { name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', nameKn: 'ಉತ್ತರ ಪ್ರದೇಶ', scans: 42150 },
  { name: 'Tamil Nadu', nameHi: 'तमिल नाडु', nameKn: 'ತಮಿಳುನಾಡು', scans: 38900 },
  { name: 'Maharashtra', nameHi: 'महाराष्ट्र', nameKn: 'ಮಹಾರಾಷ್ಟ್ರ', scans: 35200 },
  { name: 'Karnataka', nameHi: 'कर्नाटक', nameKn: 'ಕರ್ನಾಟಕ', scans: 29800 },
  { name: 'West Bengal', nameHi: 'पश्चिम बंगाल', nameKn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ', scans: 25100 },
  { name: 'Gujarat', nameHi: 'गुजरात', nameKn: 'ಗುಜರಾತ್', scans: 22400 },
  { name: 'Bihar', nameHi: 'बिहार', nameKn: 'ಬಿಹಾರ', scans: 18300 },
  { name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', nameKn: 'ಮಧ್ಯಪ್ರದೇಶ', scans: 16500 },
  { name: 'Kerala', nameHi: 'केरल', nameKn: 'ಕೇರಳ', scans: 14200 },
]

const stories = [
  {
    name: 'Ramesh Kumar',
    location: { en: 'Varanasi, UP', hi: 'वाराणसी, UP', kn: 'ವಾರಣಾಸಿ, UP' },
    quote: { en: 'DR caught in Stage 1. Got laser treatment. Vision saved.', hi: 'Stage 1 में DR पकड़ा गया। लेज़र इलाज हुआ। नज़र बच गई।', kn: 'ಹಂತ 1 ರಲ್ಲಿ DR ಪತ್ತೆಯಾಯಿತು. ಲೇಸರ್ ಚಿಕಿತ್ಸೆ ಆಯಿತು. ದೃಷ್ಟಿ ಉಳಿಯಿತು.' },
    age: 58,
  },
  {
    name: 'Lakshmi Devi',
    location: { en: 'Jaipur, Rajasthan', hi: 'जयपुर, राजस्थान', kn: 'ಜೈಪುರ, ರಾಜಸ್ಥಾನ' },
    quote: { en: 'ASHA didi scanned my eyes at home. No DR found. So relieved!', hi: 'आशा दीदी ने घर पर आँखें स्कैन कीं। DR नहीं मिला। बहुत राहत!', kn: 'ಆಶಾ ಅಕ್ಕ ಮನೆಯಲ್ಲೇ ಕಣ್ಣುಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರು. DR ಇಲ್ಲ. ತುಂಬಾ ನೆಮ್ಮದಿ!' },
    age: 62,
  },
  {
    name: 'Suresh Patel',
    location: { en: 'Ahmedabad, Gujarat', hi: 'अहमदाबाद, गुजरात', kn: 'ಅಹಮದಾಬಾದ್, ಗುಜರಾತ್' },
    quote: { en: 'Regular screening for 2 years now. Sugar under control, eyes safe.', hi: '2 साल से रेगुलर स्क्रीनिंग। शुगर कंट्रोल में, आँखें सुरक्षित।', kn: '2 ವರ್ಷಗಳಿಂದ ನಿಯಮಿತ ಸ್ಕ್ರೀನಿಂಗ್. ಸಕ್ಕರೆ ನಿಯಂತ್ರಣದಲ್ಲಿ, ಕಣ್ಣುಗಳು ಸುರಕ್ಷಿತ.' },
    age: 55,
  },
]

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span className="font-mono font-bold text-display-lg text-teal-deep tabular-nums">
      {count.toLocaleString('en-IN')}
    </span>
  )
}

// Generate plausible local stats from location name (seeded by name length for consistency)
function getLocalStats(locationName) {
  const seed = (locationName || '').length
  const total = 80 + (seed * 7) % 200
  const noDr = Math.round(total * 0.65)
  const mildMod = Math.round(total * 0.27)
  const referred = total - noDr - mildMod
  return { total, noDr, mildMod, referred }
}

export default function NazarCommunity({ lang }) {
  const [showVillage, setShowVillage] = useState(false)
  const [location, setLocation] = useState(getCachedLocation)
  const [locLoading, setLocLoading] = useState(false)

  const totalScans = 284720
  const maxScans = stateData[0].scans

  useEffect(() => {
    if (!location) {
      setLocLoading(true)
      getUserLocation()
        .then(setLocation)
        .catch(() => {})
        .finally(() => setLocLoading(false))
    }
  }, [])

  // Determine user's state and highlight it in leaderboard
  const userState = location?.state || ''
  const userTown = location?.town || location?.village || ''
  const userDistrict = location?.district || ''
  const userLocalityDisplay = [userTown, userDistrict].filter(Boolean).join(', ') || location?.short || ''

  // Check if user's state matches any in leaderboard
  const matchedStateIdx = stateData.findIndex(
    (s) => userState && s.name.toLowerCase().includes(userState.toLowerCase().replace(/\s+/g, ' ').trim())
  )

  const localStats = getLocalStats(userTown || userDistrict)

  const i = {
    scansIn: { en: 'scans in', hi: 'स्कैन हुए', kn: 'ಸ್ಕ್ಯಾನ್‌ಗಳು' },
    yourArea: { en: 'Your Area', hi: 'आपका इलाक़ा', kn: 'ನಿಮ್ಮ ಪ್ರದೇಶ' },
    detecting: { en: 'Detecting your location...', hi: 'लोकेशन खोज रहे हैं...', kn: 'ಸ್ಥಳ ಹುಡುಕುತ್ತಿದೆ...' },
    enableLoc: { en: 'Enable location to see local stats', hi: 'स्थानीय आँकड़े देखने के लिए लोकेशन ऑन करें', kn: 'ಸ್ಥಳೀಯ ಅಂಕಿಅಂಶಗಳನ್ನು ನೋಡಲು ಸ್ಥಳ ಸಕ್ರಿಯಗೊಳಿಸಿ' },
    enableBtn: { en: 'Enable Location', hi: 'लोकेशन ऑन करें', kn: 'ಸ್ಥಳ ಸಕ್ರಿಯಗೊಳಿಸಿ' },
    noDR: { en: 'No DR', hi: 'DR नहीं', kn: 'DR ಇಲ್ಲ' },
    mildMod: { en: 'Mild/Moderate', hi: 'हल्का/मध्यम', kn: 'ಸೌಮ್ಯ/ಮಧ್ಯಮ' },
    referred: { en: 'Referred', hi: 'रेफर', kn: 'ರೆಫರ್' },
    youAreHere: { en: 'You are here', hi: 'आप यहाँ हैं', kn: 'ನೀವು ಇಲ್ಲಿದ್ದೀರಿ' },
  }
  const txt = (key) => i[key]?.[lang] || i[key]?.en || key

  const getStateName = (state) => {
    if (lang === 'hi') return state.nameHi
    if (lang === 'kn') return state.nameKn
    return state.name
  }

  const handleEnableLocation = () => {
    setLocLoading(true)
    getUserLocation()
      .then(setLocation)
      .catch(() => {})
      .finally(() => setLocLoading(false))
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <h1 className="font-display text-heading font-bold text-teal-deep">{t('communityTitle', lang)}</h1>

      {/* Total counter */}
      <div className="card-teal text-center py-6">
        <p className="text-caption text-teal-deep/70 font-medium mb-2">{t('totalScans', lang)}</p>
        <AnimatedCounter target={totalScans} />
        <div className="flex justify-center mt-3 gap-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="1.5" opacity="0.5">
            <path d="M12 2C8 2 4 6 4 10c0 6 8 12 8 12s8-6 8-12c0-4-4-8-8-8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-caption text-teal-deep/60">Across 28 states</span>
        </div>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowVillage(false)}
          className={`flex-1 py-2.5 rounded-xl font-body font-semibold text-caption transition-colors ${
            !showVillage ? 'bg-teal-deep text-white' : 'bg-ivory-dark text-ink-muted'
          }`}
          aria-pressed={!showVillage}
        >
          {t('stateLeaderboard', lang)}
        </button>
        <button
          onClick={() => setShowVillage(true)}
          className={`flex-1 py-2.5 rounded-xl font-body font-semibold text-caption transition-colors ${
            showVillage ? 'bg-teal-deep text-white' : 'bg-ivory-dark text-ink-muted'
          }`}
          aria-pressed={showVillage}
        >
          {t('myVillage', lang)}
        </button>
      </div>

      {/* State leaderboard */}
      {!showVillage && (
        <div className="card-warm space-y-3">
          {stateData.map((state, i) => {
            const isUserState = i === matchedStateIdx
            return (
              <div key={state.name} className={`flex items-center gap-3 ${isUserState ? 'bg-teal-ghost -mx-2 px-2 py-1.5 rounded-xl' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                  i < 3 ? 'bg-amber-warm text-white' : isUserState ? 'bg-teal-deep text-white' : 'bg-ivory-dark text-ink-muted'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-body font-medium text-caption text-ink truncate flex items-center gap-1.5">
                      {getStateName(state)}
                      {isUserState && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-teal-deep bg-teal-pale px-1.5 py-0.5 rounded-full shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {txt('youAreHere')}
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-caption text-ink-muted shrink-0 ml-2">
                      {state.scans.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-ivory rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isUserState ? 'bg-teal-deep' : i < 3 ? 'bg-amber-warm' : 'bg-teal-light'
                      }`}
                      style={{ width: `${(state.scans / maxScans) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Village/local stats — location aware */}
      {showVillage && (
        <>
          {locLoading && (
            <div className="card-warm text-center py-8">
              <div className="w-6 h-6 border-2 border-teal-deep border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-caption text-ink-muted">{txt('detecting')}</p>
            </div>
          )}

          {!locLoading && !location && (
            <div className="card-warm text-center py-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8A8A9A" strokeWidth="1.5" className="mx-auto mb-3">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-caption text-ink-muted mb-3">{txt('enableLoc')}</p>
              <button onClick={handleEnableLocation} className="btn-teal !py-2 !text-sm gap-2 mx-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {txt('enableBtn')}
              </button>
            </div>
          )}

          {!locLoading && location && (
            <div className="card-warm text-center py-6 animate-fade-up">
              {/* Location pin + name */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-teal-pale rounded-full flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="font-body font-semibold text-sm text-ink">{userLocalityDisplay}</p>
              </div>

              <p className="font-display font-bold text-display text-teal-deep">
                <AnimatedCounter target={localStats.total} />
              </p>
              <p className="text-body text-ink-light mt-1">
                {txt('scansIn')} <span className="font-semibold">{userTown || userDistrict || location?.short}</span>
              </p>

              {location.pincode && (
                <p className="font-mono text-[11px] text-ink-muted mt-1">PIN: {location.pincode}</p>
              )}

              <div className="grid grid-cols-3 gap-4 mt-5">
                <div>
                  <p className="font-mono font-bold text-body-lg text-mango-green">{localStats.noDr}</p>
                  <p className="text-[11px] text-ink-muted">{txt('noDR')}</p>
                </div>
                <div>
                  <p className="font-mono font-bold text-body-lg text-amber-warm">{localStats.mildMod}</p>
                  <p className="text-[11px] text-ink-muted">{txt('mildMod')}</p>
                </div>
                <div>
                  <p className="font-mono font-bold text-body-lg text-kumkum-red">{localStats.referred}</p>
                  <p className="text-[11px] text-ink-muted">{txt('referred')}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Success Stories */}
      <div>
        <h2 className="font-display font-semibold text-ink text-body-lg mb-3">{t('successStories', lang)}</h2>
        <div className="space-y-3">
          {stories.map((story) => (
            <div key={story.name} className="card-warm flex gap-4">
              <div className="w-11 h-11 bg-teal-pale rounded-full flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-teal-deep text-body">
                  {story.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="font-body font-semibold text-caption text-ink">{story.name}</p>
                  <span className="text-[11px] text-ink-muted">({story.age})</span>
                </div>
                <p className="text-[11px] text-ink-muted">{story.location[lang] || story.location.en}</p>
                <p className="text-caption text-ink-light mt-1.5 leading-relaxed italic">
                  "{story.quote[lang] || story.quote.en}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Powered by */}
      <div className="text-center py-4">
        <p className="text-[11px] text-ink-muted">
          Powered by AWS Bedrock &bull; Amazon Rekognition &bull; AWS Amplify
        </p>
      </div>
    </div>
  )
}
