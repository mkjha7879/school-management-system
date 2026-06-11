import { api } from './client'
import type { SchoolClass } from '../types'

export const classesApi = {
  getAll: () => api.get<SchoolClass[]>('/classes'),
  create: (schoolClass: SchoolClass) => api.post<SchoolClass>('/classes', schoolClass),
  update: (id: string, schoolClass: SchoolClass) =>
    api.put<SchoolClass>(`/classes/${id}`, schoolClass),
  delete: (id: string) => api.delete(`/classes/${id}`),
}
