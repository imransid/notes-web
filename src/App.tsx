import { useState } from 'react'
import { getSession, logout, saveSession } from './api'
import { Login } from './Login'
import { MyNotes } from './Notes'

const TABS = ['My notes'] as const
type Tab = (typeof TABS)[number]

export default function App() {
  const [session, setSession] = useState(getSession)
  const [tab, setTab] = useState<Tab>('My notes')

  if (!session) {
    return (
      <Login
        onLogin={(s) => {
          saveSession(s)
          setSession(s)
        }}
      />
    )
  }

  return (
    <main>
      <header>
        <span>
          {session.user.name} ({session.user.role})
        </span>
        <nav>
          {TABS.map((t) => (
            <button key={t} disabled={t === tab} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <button onClick={logout}>Log out</button>
      </header>
      {tab === 'My notes' && <MyNotes />}
    </main>
  )
}
