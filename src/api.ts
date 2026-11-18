export type Role = 'user' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  interests: string[]
}

export interface Note {
  _id: string
  title: string
  content: string
}

// GET /notes/all populates the owner (null only if the user is gone).
export interface OwnedNote extends Note {
  owner: Pick<User, '_id' | 'name' | 'email'> | null
}

export interface Post {
  _id: string
  title: string
  body: string
}

export interface Page<T> {
  data: T[]
  page: number
  limit: number
  hasNext: boolean
}

export interface Session {
  accessToken: string
  user: User
}

const SESSION_KEY = 'session'

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  window.location.reload()
}

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = getSession()?.accessToken
  const res = await fetch(import.meta.env.VITE_API_URL + path, {
    method: init.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })

  // An expired or invalid token: drop the session (a failed login has no token yet).
  if (res.status === 401 && token) logout()
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    // Validation errors come back as an array of messages.
    throw new Error([error.message ?? res.statusText].flat().join(', '))
  }
  return res.status === 204 ? (undefined as T) : res.json()
}

export const toList = (value: FormDataEntryValue | null) =>
  String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
