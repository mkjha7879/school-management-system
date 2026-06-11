import { api } from './client'
import type { Teacher } from '../types'

export const teachersApi = {
  getAll: () => api.get<Teacher[]>('/teachers'),
  create: (teacher: Teacher) => api.post<Teacher>('/teachers', teacher),
  update: (id: string, teacher: Teacher) => api.put<Teacher>(`/teachers/${id}`, teacher),
  delete: (id: string) => api.delete(`/teachers/${id}`),
}
