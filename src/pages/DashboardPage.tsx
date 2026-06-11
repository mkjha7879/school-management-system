import { useEffect, useState } from 'react'
import { dashboardApi } from '../api/dashboard'
import { useAuth } from '../auth/AuthContext'
import { useTopic } from '../realtime/useTopic'
import type { DashboardStats } from '../types'

export default function DashboardPage() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  useEffect(() => {
    dashboardApi
      .getStats()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Live push updates over WebSocket
  useTopic<DashboardStats>('/topic/dashboard', (next) => {
    setStats(next)
    setLive(true)
  })

  const cards = [
    { label: 'Students', value: stats?.studentCount ?? 0, color: '#4f46e5', bg: '#eef2ff', icon: '🎓' },
    { label: 'Teachers', value: stats?.teacherCount ?? 0, color: '#0891b2', bg: '#ecfeff', icon: '👩‍🏫' },
    { label: 'Classes', value: stats?.classCount ?? 0, color: '#059669', bg: '#ecfdf5', icon: '📚' },
  ]

  const role = profile?.role ?? 'STUDENT'

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome, {profile?.displayName ?? profile?.email}
            {live && <span className="live-dot" title="Live updates active"> ● LIVE</span>}
          </p>
        </div>
      </header>

      {loading && <p className="status-msg">Loading…</p>}
      {error && <p className="error banner">{error}</p>}

      {!loading && (
        <>
          <div className="stats-grid">
            {cards.map((card) => (
              <article key={card.label} className="stat-card">
                <span className="stat-icon" style={{ background: card.bg }}>
                  {card.icon}
                </span>
                <div>
                  <p className="stat-label">{card.label}</p>
                  <p className="stat-value" style={{ color: card.color }}>
                    {card.value}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <section className="info-panel">
            <h2>{role} workspace</h2>
            {role === 'ADMIN' && (
              <ul>
                <li>Manage users and assign roles under <strong>Users &amp; Roles</strong></li>
                <li>Add teachers, then students, then create classes</li>
                <li>Counts above update live as anyone makes changes</li>
              </ul>
            )}
            {role === 'TEACHER' && (
              <ul>
                <li>View your students and classes</li>
                <li>Dashboard reflects changes in real time</li>
              </ul>
            )}
            {(role === 'STUDENT' || role === 'PARENT') && (
              <ul>
                <li>View your classes and school information</li>
                <li>More features (attendance, grades) coming next</li>
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
