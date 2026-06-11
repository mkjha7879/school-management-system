import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { isFirebaseConfigured } from '../firebase'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(
        message
          .replace('Firebase: ', '')
          .replace(/\(auth.*\)\.?/, '')
          .trim() || 'Invalid email or password'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-logo">🏫</span>
          <h1>Welcome back</h1>
          <p>Sign in to your School Management account</p>
        </div>

        {!isFirebaseConfigured && (
          <p className="error banner">
            Firebase web config missing. Add your keys to a <code>.env</code> file
            (see <code>.env.example</code>) and restart the dev server.
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@school.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="input-with-action">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="reveal-btn"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn primary full-width" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-footer">
          School Management System &middot; Secure sign-in
        </p>
      </div>
    </div>
  )
}
