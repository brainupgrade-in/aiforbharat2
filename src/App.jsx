import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useAuth } from './lib/auth.jsx'
import { GET_MY_PROFILE } from './lib/queries'
import NazarApp from './pages/NazarApp'
import NazarAuthScreen from './components/NazarAuthScreen'
import OtpLoginForm from './components/OtpLoginForm'
import ProfileForm from './components/ProfileForm'

const LANG_KEY = 'nazarai.lang'

function ProfileGate({ lang, setLang, signOut }) {
  const { data, loading } = useQuery(GET_MY_PROFILE, { fetchPolicy: 'cache-and-network' })
  const profile = data?.user_profile?.[0]

  // Sync language from profile once it loads (server is the source of truth across devices)
  useEffect(() => {
    if (profile?.language && profile.language !== lang) {
      setLang(profile.language)
    }
  }, [profile?.language])

  if (loading && !profile) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-ivory">
        <div className="w-10 h-10 border-2 border-teal-deep border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // First-time users (or anyone with no name yet) → onboarding form
  if (!profile?.name) {
    return <ProfileForm mode="onboarding" lang={lang} setLang={setLang} initial={profile} />
  }

  return <NazarApp profile={profile} lang={lang} setLang={setLang} signOut={signOut} />
}

function AuthGate() {
  const { isAuthenticated, signOut } = useAuth()
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'hi')

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
  }, [lang])

  if (!isAuthenticated) {
    return (
      <NazarAuthScreen lang={lang} setLang={setLang}>
        <OtpLoginForm lang={lang} />
      </NazarAuthScreen>
    )
  }

  return <ProfileGate lang={lang} setLang={setLang} signOut={signOut} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthGate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
