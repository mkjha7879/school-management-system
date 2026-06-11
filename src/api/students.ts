import { api } from './client'
import type { Student } from '../types'

export const studentsApi = {
  getAll: () => api.get<Student[]>('/students'),
  create: (student: Student) => api.post<Student>('/students', student),
  update: (id: string, student: Student) => api.put<Student>(`/students/${id}`, student),
  delete: (id: string) => api.delete(`/students/${id}`),
}
