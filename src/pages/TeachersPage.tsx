import { useEffect, useState, type FormEvent } from 'react'
import { teachersApi } from '../api/teachers'
import EntityModal from '../components/EntityModal'
import { initials } from '../utils/initials'
import type { Teacher } from '../types'

const emptyTeacher: Teacher = {
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  department: '',
  phone: '',
  hireDate: '',
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)
  const [form, setForm] = useState<Teacher>(emptyTeacher)

  function loadTeachers() {
    setLoading(true)
    teachersApi
      .getAll()
      .then(setTeachers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyTeacher)
    setModalOpen(true)
  }

  function openEdit(teacher: Teacher) {
    setEditing(teacher)
    setForm({ ...teacher })
    setModalOpen(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      if (editing?.id) {
        await teachersApi.update(editing.id, form)
      } else {
        await teachersApi.create(form)
      }
      setModalOpen(false)
      loadTeachers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save teacher')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this teacher?')) return
    try {
      await teachersApi.delete(id)
      loadTeachers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete teacher')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Teachers</h1>
          <p>Manage teaching staff</p>
        </div>
        <button type="button" className="btn primary" onClick={openCreate}>
          + Add Teacher
        </button>
      </header>

      {error && <p className="error banner">{error}</p>}
      {loading && <p className="status-msg">Loading teachers...</p>}

      {!loading && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-row">
                    No teachers yet. Add your first teacher.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar">
                          {initials(`${teacher.firstName} ${teacher.lastName}`)}
                        </span>
                        {teacher.firstName} {teacher.lastName}
                      </div>
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.subject}</td>
                    <td>{teacher.department || '—'}</td>
                    <td className="actions">
                      <button type="button" className="btn link" onClick={() => openEdit(teacher)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn link danger"
                        onClick={() => teacher.id && handleDelete(teacher.id)}
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
        title={editing ? 'Edit Teacher' : 'Add Teacher'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <label>
            First name
            <input
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </label>
          <label>
            Last name
            <input
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
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
            Subject
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
            />
          </label>
          <label>
            Department
            <input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
        </div>
      </EntityModal>
    </div>
  )
}
