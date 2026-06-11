import { useEffect, useState, type FormEvent } from 'react'
import { classesApi } from '../api/classes'
import { teachersApi } from '../api/teachers'
import EntityModal from '../components/EntityModal'
import type { SchoolClass, Teacher } from '../types'

const emptyClass: SchoolClass = {
  name: '',
  subject: '',
  teacherId: '',
  room: '',
  schedule: '',
  grade: '',
  capacity: 30,
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<SchoolClass | null>(null)
  const [form, setForm] = useState<SchoolClass>(emptyClass)

  function loadData() {
    setLoading(true)
    Promise.all([classesApi.getAll(), teachersApi.getAll()])
      .then(([classList, teacherList]) => {
        setClasses(classList)
        setTeachers(teacherList)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm(emptyClass)
    setModalOpen(true)
  }

  function openEdit(schoolClass: SchoolClass) {
    setEditing(schoolClass)
    setForm({ ...schoolClass })
    setModalOpen(true)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      if (editing?.id) {
        await classesApi.update(editing.id, form)
      } else {
        await classesApi.create(form)
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save class')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this class?')) return
    try {
      await classesApi.delete(id)
      loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete class')
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Classes</h1>
          <p>Manage class schedules and assignments</p>
        </div>
        <button type="button" className="btn primary" onClick={openCreate}>
          + Add Class
        </button>
      </header>

      {error && <p className="error banner">{error}</p>}
      {loading && <p className="status-msg">Loading classes...</p>}

      {!loading && (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Schedule</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-row">
                    No classes yet. Add your first class.
                  </td>
                </tr>
              ) : (
                classes.map((schoolClass) => (
                  <tr key={schoolClass.id}>
                    <td>{schoolClass.name}</td>
                    <td>{schoolClass.subject}</td>
                    <td>{schoolClass.teacherName || '—'}</td>
                    <td>{schoolClass.room || '—'}</td>
                    <td>{schoolClass.schedule || '—'}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn link"
                        onClick={() => openEdit(schoolClass)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn link danger"
                        onClick={() => schoolClass.id && handleDelete(schoolClass.id)}
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
        title={editing ? 'Edit Class' : 'Add Class'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <label>
            Class name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            Grade
            <input
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />
          </label>
          <label>
            Teacher
            <select
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            >
              <option value="">Select teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName} — {teacher.subject}
                </option>
              ))}
            </select>
          </label>
          <label>
            Room
            <input
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
            />
          </label>
          <label>
            Schedule
            <input
              placeholder="Mon/Wed 9:00 AM"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            />
          </label>
          <label>
            Capacity
            <input
              type="number"
              min={1}
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            />
          </label>
        </div>
      </EntityModal>
    </div>
  )
}
