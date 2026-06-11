import { api } from './client'
import type { Role, UserProfile } from '../types'

export interface CreateUserRequest {
  email: string
  password: string
  displayName: string
  role: Role
  linkedId?: string
}

export const usersApi = {
  getAll: () => api.get<UserProfile[]>('/users'),
  create: (request: CreateUserRequest) => api.post<UserProfile>('/users', request),
  updateRole: (uid: string, role: Role) =>
    api.put<UserProfile>(`/users/${uid}/role`, { role }),
  delete: (uid: string) => api.delete(`/users/${uid}`),
}
