import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/auth.jsx'
import NazarApp from './pages/NazarApp'
import NazarAuthScreen from './components/NazarAuthScreen'
import OtpLoginForm from './components/OtpLoginForm'

function AuthGate() {
  const { isAuthenticated, signOut } = useAuth()

  if (isAuthenticated) {
    return <NazarApp signOut={signOut} />
  }

  return (
    <NazarAuthScreen>
      <OtpLoginForm />
    </NazarAuthScreen>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthGate />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
