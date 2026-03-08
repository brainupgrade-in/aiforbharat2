import { Routes, Route, Navigate } from 'react-router-dom'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import NazarApp from './pages/NazarApp'
import NazarAuthScreen from './components/NazarAuthScreen'

function AuthGate() {
  const { authStatus } = useAuthenticator((ctx) => [ctx.authStatus])

  if (authStatus === 'authenticated') {
    return (
      <Authenticator>
        {({ signOut }) => <NazarApp signOut={signOut} />}
      </Authenticator>
    )
  }

  // Show branded auth screen wrapping the sign-in/sign-up form
  return (
    <NazarAuthScreen>
      <Authenticator />
    </NazarAuthScreen>
  )
}

function AuthenticatedApp() {
  return (
    <Authenticator.Provider>
      <AuthGate />
    </Authenticator.Provider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthenticatedApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
