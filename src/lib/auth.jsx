import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const TOKEN_KEY = 'nazarai.token'
const USER_KEY  = 'nazarai.user'

const AUTH_BASE = import.meta.env.VITE_AUTH_URL || '/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null)
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') } catch { return null }
  })

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY)
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY)
  }, [user])

  const requestLogin = useCallback(async (email) => {
    const r = await fetch(`${AUTH_BASE}/request-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!r.ok) {
      const data = await r.json().catch(() => ({}))
      throw new Error(data.error || `Failed to send code (${r.status})`)
    }
  }, [])

  const verifyOtp = useCallback(async (email, otp) => {
    const r = await fetch(`${AUTH_BASE}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data.error || `Verification failed (${r.status})`)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setUser(null)
    // Clear any per-user client-side state so the next sign-in starts fresh
    localStorage.removeItem('nazarai.chat.sessionId')
  }, [])

  // When Apollo (or anyone) detects an expired/invalid JWT, force a signout so
  // the user is dropped back at the OTP screen instead of seeing opaque errors.
  useEffect(() => {
    const handler = () => { if (token) signOut() }
    window.addEventListener('nazarai:session-expired', handler)
    return () => window.removeEventListener('nazarai:session-expired', handler)
  }, [token, signOut])

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    requestLogin,
    verifyOtp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
