import { Routes, Route, Navigate } from 'react-router-dom'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import NazarApp from './pages/NazarApp'

function AuthenticatedApp() {
  return (
    <Authenticator>
      {({ signOut }) => <NazarApp signOut={signOut} />}
    </Authenticator>
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
