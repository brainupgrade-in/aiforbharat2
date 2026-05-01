import { useState, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { LANGS, t } from '../lib/i18n'
import { UPDATE_PROFILE_LANGUAGE } from '../lib/queries'
import NazarHome from './NazarHome'
import NazarScan from './NazarScan'
import NazarResult from './NazarResult'
import NazarChat from './NazarChat'
import NazarGlucose from './NazarGlucose'
import ProfileForm from '../components/ProfileForm'

const NAV_ITEMS = [
  { id: 'home', icon: 'home' },
  { id: 'scan', icon: 'scan' },
  { id: 'chat', icon: 'chat' },
  { id: 'glucose', icon: 'glucose' },
]

function NavIcon({ icon, active }) {
  const color = active ? '#0A6E6E' : '#8A8A9A'
  const sw = active ? '2.5' : '2'

  switch (icon) {
    case 'home':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'scan':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      )
    case 'chat':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      )
    case 'glucose':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      )
    case 'community':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    default:
      return null
  }
}

export default function NazarApp({ profile, lang, setLang, signOut }) {
  const [tab, setTab] = useState('home')
  const [highContrast, setHighContrast] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [showProfileEdit, setShowProfileEdit] = useState(false)

  const [updateLanguage] = useMutation(UPDATE_PROFILE_LANGUAGE)

  const handleNavigate = useCallback((target) => {
    setTab(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleResult = useCallback((result) => {
    setScanResult(result)
    setTab('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleLangChange = (code) => {
    setLang(code)
    // Persist to profile so the choice follows the user across devices.
    updateLanguage({ variables: { language: code } }).catch(() => {})
  }

  return (
    <div className={`min-h-screen min-h-[100dvh] bg-ivory retinal-bg ${highContrast ? 'high-contrast' : ''}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur-sm border-b border-ivory-dark/50">
        <div className="max-w-lg mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-teal-deep rounded-xl flex items-center justify-center" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <ellipse cx="12" cy="12" rx="10" ry="6" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <h1 className="font-display font-bold text-body-lg text-teal-deep leading-none">
                  {t('appName', lang)}
                </h1>
                <p className="text-[10px] text-ink-muted font-body leading-none mt-0.5">
                  {t('tagline', lang)}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* High contrast */}
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  highContrast ? 'bg-ink text-white' : 'bg-ivory-dark text-ink-muted'
                }`}
                aria-label={t('highContrast', lang)}
                aria-pressed={highContrast}
                title={t('highContrast', lang)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
                </svg>
              </button>

              {/* Language */}
              <div className="flex bg-ivory-dark rounded-lg overflow-hidden">
                {Object.entries(LANGS).map(([code, label]) => (
                  <button
                    key={code}
                    onClick={() => handleLangChange(code)}
                    className={`px-2 py-1.5 text-[11px] font-semibold transition-colors min-w-[36px] ${
                      lang === code
                        ? 'bg-teal-deep text-white'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                    aria-label={`Switch to ${label}`}
                    aria-pressed={lang === code}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Profile edit */}
              <button
                onClick={() => setShowProfileEdit(true)}
                className="w-8 h-8 bg-teal-pale rounded-lg flex items-center justify-center text-teal-deep hover:bg-teal-ghost transition-colors"
                aria-label={t('editProfile', lang)}
                title={profile?.name ? `${profile.name} — ${t('editProfile', lang)}` : t('editProfile', lang)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {/* Sign out */}
              {signOut && (
                <button
                  onClick={signOut}
                  className="w-8 h-8 bg-teal-pale rounded-lg flex items-center justify-center text-teal-deep hover:bg-teal-ghost transition-colors"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-5 pb-24">
        {tab === 'home' && <NazarHome lang={lang} onNavigate={handleNavigate} />}
        {tab === 'scan' && <NazarScan lang={lang} onResult={handleResult} initialPatientId={profile?.name} />}
        {tab === 'results' && <NazarResult lang={lang} result={scanResult} onNavigate={handleNavigate} />}
        {tab === 'chat' && <NazarChat lang={lang} />}
        {tab === 'glucose' && <NazarGlucose lang={lang} />}
      </main>

      {/* Profile edit modal */}
      {showProfileEdit && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowProfileEdit(false)}
        >
          <div
            className="bg-ivory rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label={t('editProfile', lang)}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-heading font-bold text-teal-deep">{t('editProfile', lang)}</h2>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="w-8 h-8 rounded-lg text-ink-muted hover:bg-ivory-dark flex items-center justify-center"
                aria-label={t('cancel', lang)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <ProfileForm
              mode="edit"
              lang={lang}
              setLang={handleLangChange}
              initial={profile}
              onComplete={() => setShowProfileEdit(false)}
              onCancel={() => setShowProfileEdit(false)}
            />
          </div>
        </div>
      )}

      {/* Bottom nav — 5 tabs */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-ivory-dark/50 safe-bottom"
        role="tablist"
        aria-label="Main navigation"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around py-1.5">
          {NAV_ITEMS.map(({ id, icon }) => {
            const active = tab === id || (id === 'scan' && tab === 'results')
            return (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-colors min-w-[48px] min-h-[48px] justify-center ${
                  active ? 'text-teal-deep' : 'text-ink-muted hover:text-ink-light'
                }`}
                role="tab"
                aria-selected={active}
                aria-label={t(id, lang)}
              >
                <NavIcon icon={icon} active={active} />
                <span className={`text-[9px] font-medium ${active ? 'font-semibold' : ''}`}>
                  {t(id, lang)}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
