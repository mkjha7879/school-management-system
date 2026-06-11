import { useEffect, useState, type FormEvent } from 'react'
import { usersApi, type CreateUserRequest } from '../api/users'
import EntityModal from '../components/EntityModal'
import { initials } from '../utils/initials'
import type { Role, UserProfile } from '../types'

const ROLES: Role[] = ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']

const emptyUser: CreateUserRequest = {
  email: '',
  password: '',
  displayName: '',
  role: 'TEACHER',
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<CreateUserRequest>(emptyUser)

  // Pending (unsaved) role selections, keyed by uid
  const [pendingRoles, setPendingRoles] = useState<Record<string, Role>>({})
  const [savingUid, setSavingUid] = useState<string | null>(null)
  const [savedUid, setSavedUid] = useState<string | null>(null)

  function load() {
    setLoading(true)
    usersApi
      .getAll()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      await usersApi.create(form)
      setModalOpen(false)
      setForm(emptyUser)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    }
  }

  function selectRole(uid: string, role: Role) {
    setSavedUid(null)
    setPendingRoles((prev) => ({ ...prev, [uid]: role }))
  }

  function effectiveRole(user: UserProfile): Role {
    return pendingRoles[user.uid] ?? user.role
  }

  function isDirty(user: UserProfile): boolean {
    return pendingRoles[user.uid] != null && pendingRoles[user.uid] !== user.role
  }

  async function saveRole(user: UserProfile) {
    const newRole = pendingRoles[user.uid]
    if (!newRole || newRole === user.role) return
    setError('')
    setSavingUid(user.uid)
    try {
      const updated = await usersApi.updateRole(user.uid, newRole)
      // Update only this row locally — no full page reload
      setUsers((prev) =>
        prev.map((u) => (u.uid === user.uid ? { ...u, role: updated.role } : u))
      )
      setPendingRoles((prev) => {
        const next = { ...prev }
        delete next[user.uid]
        return next
      })
      setSavedUid(user.uid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role')
    } finally {
      setSavingUid(null)
    }
  }

  async function remove(uid: string) {
    if (!confirm('Delete this user account?')) return
    try {
      await usersApi.delete(uid)
      setUsers((prev) => prev.filter((u) => u.uid !== uid))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Users &amp; Roles</h1>
          <p>Create accounts and control access by role</p>
        </div>
        <button type="button" className="btn primary" onClick={() => setModalOpen(true)}>
          + Add User
        </button>
      </header>

      {error && <p className="error banner">{error}</p>}
      {loading && <p className="status-msg">Loading users…</p>}

      {!loading && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-row">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.uid}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar">{initials(user.displayName)}</span>
                        {user.displayName}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={effectiveRole(user)}
                        onChange={(e) => selectRole(user.uid, e.target.value as Role)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn primary"
                        disabled={!isDirty(user) || savingUid === user.uid}
                        onClick={() => saveRole(user)}
                      >
                        {savingUid === user.uid ? 'Saving…' : 'Save'}
                      </button>
                      {savedUid === user.uid && !isDirty(user) && (
                        <span className="saved-tag">Saved ✓</span>
                      )}
                      <button
                        type="button"
                        className="btn link danger"
                        onClick={() => remove(user.uid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <EntityModal
        title="Add User"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        submitLabel="Create"
      >
        <div className="form-grid">
          <label>
            Display name
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              required
            />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
        </div>
      </EntityModal>
    </div>
  )
}
