import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { initials } from '../utils/initials'
import type { Role } from '../types'

interface NavItem {
  to: string
  label: string
  icon: string
  roles: Role[]
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'] },
  { to: '/students', label: 'Students', icon: '🎓', roles: ['ADMIN', 'TEACHER'] },
  { to: '/teachers', label: 'Teachers', icon: '👩‍🏫', roles: ['ADMIN'] },
  { to: '/classes', label: 'Classes', icon: '📚', roles: ['ADMIN', 'TEACHER', 'STUDENT'] },
  { to: '/users', label: 'Users & Roles', icon: '🔐', roles: ['ADMIN'] },
]

export default function Layout() {
  const { profile, logout } = useAuth()
  const role = profile?.role ?? 'STUDENT'
  const visibleItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🏫</span>
          <div>
            <h1>SchoolMS</h1>
            <p>Real-time System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <span className="avatar">{initials(profile?.displayName ?? profile?.email)}</span>
          <div className="user-meta">
            <p className="user-name">{profile?.displayName ?? profile?.email}</p>
            <span className={`role-badge role-${role}`}>{role}</span>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={() => logout()}>
          Sign out
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
