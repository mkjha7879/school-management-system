export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: Role
  linkedId?: string
  createdAt?: number
}

export interface Student {
  id?: string
  firstName: string
  lastName: string
  email: string
  grade: string
  phone?: string
  dateOfBirth?: string
  enrollmentDate?: string
  address?: string
}

export interface Teacher {
  id?: string
  firstName: string
  lastName: string
  email: string
  subject: string
  department?: string
  phone?: string
  hireDate?: string
}

export interface SchoolClass {
  id?: string
  name: string
  subject: string
  teacherId?: string
  teacherName?: string
  room?: string
  schedule?: string
  grade?: string
  capacity?: number
}

export interface DashboardStats {
  studentCount: number
  teacherCount: number
  classCount: number
}
