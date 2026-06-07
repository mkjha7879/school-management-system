import { FormEvent, useState } from 'react'
import { DEMO_CREDENTIALS, validateLogin } from './auth'

type LoginProps = {
  onSuccess: (email: string) => void
}

export default function Login({ onSuccess }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    // Simulate a short network delay
    setTimeout(() => {
      if (validateLogin(email, password)) {
        onSuccess(email.trim())
      } else {
        setError('Invalid email or password. Use the demo credentials below.')
      }
      setIsSubmitting(false)
    }, 400)
  }

  return (
    <div className="login-card">
      <header className="login-header">
        <h1>Welcome back</h1>
        <p>Sign in to your account</p>
      </header>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <aside className="demo-credentials">
        <h2>Demo login details</h2>
        <dl>
          <div>
            <dt>Email</dt>
            <dd>
              <code>{DEMO_CREDENTIALS.email}</code>
            </dd>
          </div>
          <div>
            <dt>Password</dt>
            <dd>
              <code>{DEMO_CREDENTIALS.password}</code>
            </dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}
