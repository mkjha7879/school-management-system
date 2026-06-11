import { useEffect, useState, type FormEvent } from 'react'
import { studentsApi } from '../api/students'
import EntityModal from '../components/EntityModal'
import { initials } from '../utils/initials'
import type { Student } from '../types'

const emptyStudent: Student = {
  firstName: '',
  lastName: '',
  email: '',
  grade: '',
  phone: '',
  dateOfBirth: '',
  enrollmentDate: '',
  address: '',
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState<Student>(emptyStudent)

  function loadStudents() {
    setLoading(true)
    studentsApi
      .getAll()
      .then(setStudents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadStudents()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyStudent)
    setModalOpen(true)
  }

  function openEdit(student: Student) {
    setEditing(student)
    setForm({ ...student })
    setModalOpen(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      if (editing?.id) {
        await studentsApi.update(editing.id, form)
      } else {
        await studentsApi.create(form)
      }
      setModalOpen(false)
      loadStudents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save student')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this student?')) return
    try {
      await studentsApi.delete(id)
      loadStudents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete student')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Students</h1>
          <p>Manage student records</p>
        </div>
        <button type="button" className="btn primary" onClick={openCreate}>
          + Add Student
        </button>
      </header>

      {error && <p className="error banner">{error}</p>}
      {loading && <p className="status-msg">Loading students...</p>}

      {!loading && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Grade</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-row">
                    No students yet. Add your first student.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <div className="cell-user">
                        <span className="avatar">
                          {initials(`${student.firstName} ${student.lastName}`)}
                        </span>
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.grade}</td>
                    <td>{student.phone || '—'}</td>
                    <td className="actions">
                      <button type="button" className="btn link" onClick={() => openEdit(student)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn link danger"
                        onClick={() => student.id && handleDelete(student.id)}
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
        title={editing ? 'Edit Student' : 'Add Student'}
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
            Grade
            <input
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              required
            />
          </label>
          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>
          <label>
            Date of birth
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            />
          </label>
          <label className="full-width">
            Address
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
        </div>
      </EntityModal>
    </div>
  )
}
