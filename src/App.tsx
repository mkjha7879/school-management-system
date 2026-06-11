import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Layout from './components/Layout'
import ClassesPage from './pages/ClassesPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import StudentsPage from './pages/StudentsPage'
import TeachersPage from './pages/TeachersPage'
import UsersPage from './pages/UsersPage'
import type { Role } from './types'
import type { ReactNode } from 'react'

function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { profile } = useAuth()
  if (profile && !roles.includes(profile.role)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function AppRoutes() {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="login-page">
        <p className="status-msg">Loading…</p>
      </div>
    )
  }

  if (!firebaseUser) {
    return <LoginPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route
            path="students"
            element={
              <RequireRole roles={['ADMIN', 'TEACHER']}>
                <StudentsPage />
              </RequireRole>
            }
          />
          <Route
            path="teachers"
            element={
              <RequireRole roles={['ADMIN']}>
                <TeachersPage />
              </RequireRole>
            }
          />
          <Route
            path="classes"
            element={
              <RequireRole roles={['ADMIN', 'TEACHER', 'STUDENT']}>
                <ClassesPage />
              </RequireRole>
            }
          />
          <Route
            path="users"
            element={
              <RequireRole roles={['ADMIN']}>
                <UsersPage />
              </RequireRole>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
