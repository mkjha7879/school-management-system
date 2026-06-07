import { useState } from 'react'
import Dashboard from './Dashboard'
import Login from './Login'

export default function App() {
  const [userEmail, setUserEmail] = useState<string | null>(null)

  if (userEmail) {
    return (
      <Dashboard
        email={userEmail}
        onLogout={() => setUserEmail(null)}
      />
    )
  }

  return <Login onSuccess={setUserEmail} />
}
