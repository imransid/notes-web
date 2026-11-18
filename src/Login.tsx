import { useState, type FormEvent } from 'react'
import { api, toList, type Session } from './api'

export function Login({ onLogin }: { onLogin: (session: Session) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const credentials = { email: form.get('email'), password: form.get('password') }
    const body =
      mode === 'login' ? credentials : { ...credentials, name: form.get('name'), interests: toList(form.get('interests')) }
    try {
      onLogin(await api<Session>(`/auth/${mode}`, { method: 'POST', body }))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h1>{mode === 'login' ? 'Log in' : 'Register'}</h1>
      {mode === 'register' && <input name="name" placeholder="Name" required />}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {mode === 'register' && <input name="interests" placeholder="Interests, comma-separated" />}
      <button>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      {error && <p className="error">{error}</p>}
      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
      </button>
    </form>
  )
}
