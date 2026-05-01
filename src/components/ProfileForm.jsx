import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LANGS, t } from '../lib/i18n'
import { UPSERT_PROFILE, GET_MY_PROFILE } from '../lib/queries'

/**
 * Same form used for first-time onboarding (fullscreen) and later edits (modal).
 * Pass `mode='onboarding'` to show the welcome header; `mode='edit'` for a tighter form.
 * `initial` is an existing user_profile row (if any).
 * `onComplete` fires with the saved profile after a successful upsert.
 * `onCancel` is only honored in edit mode.
 */
const DIABETES_TYPES = [
  { value: 'Type 2', labels: { en: 'Type 2 (most common)', hi: 'टाइप 2 (सबसे आम)', kn: 'ಟೈಪ್ 2 (ಸಾಮಾನ್ಯ)' } },
  { value: 'Type 1', labels: { en: 'Type 1', hi: 'टाइप 1', kn: 'ಟೈಪ್ 1' } },
  { value: 'Pre-diabetic', labels: { en: 'Pre-diabetic', hi: 'प्री-डायबिटीज़', kn: 'ಪೂರ್ವ ಮಧುಮೇಹ' } },
  { value: 'Gestational', labels: { en: 'Gestational', hi: 'गर्भकालीन', kn: 'ಗರ್ಭಾವಸ್ಥೆಯ' } },
  { value: 'Not sure', labels: { en: 'Not sure / prefer not to say', hi: 'पता नहीं / नहीं बताना', kn: 'ಗೊತ್ತಿಲ್ಲ / ಹೇಳಬಾರದು' } },
]

export default function ProfileForm({ mode = 'onboarding', lang, setLang, initial = null, onComplete, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [age, setAge] = useState(initial?.age?.toString() || '')
  const [diabetesType, setDiabetesType] = useState(initial?.diabetes_type || 'Type 2')
  const [error, setError] = useState('')

  const [upsert, { loading }] = useMutation(UPSERT_PROFILE, {
    refetchQueries: [{ query: GET_MY_PROFILE }],
    awaitRefetchQueries: true,
  })

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setError(t('profileNameRequired', lang))
      return
    }
    setError('')
    try {
      const ageNum = age ? parseInt(age, 10) : null
      const { data } = await upsert({
        variables: {
          name: name.trim(),
          age: Number.isFinite(ageNum) && ageNum > 0 && ageNum < 130 ? ageNum : null,
          diabetes_type: diabetesType,
          language: lang,
        },
      })
      onComplete?.(data?.insert_user_profile_one)
    } catch (err) {
      setError(err.message || 'Could not save profile')
    }
  }

  const isOnboarding = mode === 'onboarding'

  return (
    <div className={isOnboarding ? 'min-h-screen min-h-[100dvh] bg-ivory flex flex-col' : ''}>
      {isOnboarding && (
        <div className="px-6 pt-10 pb-4 text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-teal-deep rounded-2xl flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <ellipse cx="12" cy="12" rx="10" ry="6" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <h1 className="font-display text-display font-bold text-teal-deep">{t('welcomeToNazar', lang)}</h1>
          <p className="text-caption text-ink-muted mt-2 max-w-sm mx-auto">{t('onboardingSub', lang)}</p>
        </div>
      )}

      {/* Language selector — small, top-right in onboarding */}
      {isOnboarding && (
        <div className="flex justify-center mb-2">
          <div className="flex bg-ivory-dark rounded-lg overflow-hidden">
            {Object.entries(LANGS).map(([code, label]) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 text-[11px] font-semibold transition-colors min-w-[40px] ${
                  lang === code ? 'bg-teal-deep text-white' : 'text-ink-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={submit} className={`space-y-4 ${isOnboarding ? 'flex-1 px-6 pb-8 max-w-md mx-auto w-full' : ''}`}>
        <div>
          <label className="block text-caption font-medium text-ink-light mb-1.5">{t('profileNameLabel', lang)}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('profileNamePlaceholder', lang)}
            className="input-nazar"
            autoFocus={isOnboarding}
            maxLength={80}
          />
        </div>

        <div>
          <label className="block text-caption font-medium text-ink-light mb-1.5">{t('profileAgeLabel', lang)}</label>
          <input
            type="number"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 45"
            className="input-nazar"
            min={1}
            max={129}
          />
        </div>

        <div>
          <label className="block text-caption font-medium text-ink-light mb-1.5">{t('profileDiabetesLabel', lang)}</label>
          <div className="space-y-1.5">
            {DIABETES_TYPES.map((opt) => (
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                diabetesType === opt.value ? 'border-teal-deep bg-teal-pale' : 'border-ivory-dark bg-white hover:border-teal-light'
              }`}>
                <input
                  type="radio"
                  name="diabetes_type"
                  value={opt.value}
                  checked={diabetesType === opt.value}
                  onChange={(e) => setDiabetesType(e.target.value)}
                  className="accent-teal-deep"
                />
                <span className="text-caption text-ink">{opt.labels[lang] || opt.labels.en}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-sm text-kumkum-red bg-kumkum-light px-3 py-2 rounded-lg">{error}</div>
        )}

        <div className="flex gap-2 pt-1">
          {!isOnboarding && (
            <button type="button" onClick={onCancel} className="btn-outline flex-1">
              {t('cancel', lang)}
            </button>
          )}
          <button type="submit" disabled={loading} className="btn-teal flex-1">
            {loading ? t('saving', lang) : isOnboarding ? t('continueBtn', lang) : t('saveProfile', lang)}
          </button>
        </div>

        {isOnboarding && (
          <p className="text-[11px] text-ink-muted text-center pt-2">{t('profilePrivacyNote', lang)}</p>
        )}
      </form>
    </div>
  )
}
