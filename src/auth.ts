export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'password123',
} as const

export function validateLogin(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  )
}
