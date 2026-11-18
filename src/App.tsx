import { useState } from 'react'
import { getSession, logout, saveSession } from './api'
import { Interests } from './Interests'
import { Login } from './Login'
import { AllNotes, MyNotes } from './Notes'
import { Posts } from './Posts'
import { Users } from './Users'

const USER_TABS = ['My notes', 'Posts'] as const
const ADMIN_TABS = [...USER_TABS, 'All notes', 'Users', 'Interests'] as const
type Tab = (typeof ADMIN_TABS)[number]

export default function App() {
  const [session, setSession] = useState(getSession)
  const [tab, setTab] = useState<Tab>('My notes')
  const [postsUserId, setPostsUserId] = useState<string>()

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

  const me = session.user
  const tabs = me.role === 'admin' ? ADMIN_TABS : USER_TABS
  const postsFor = postsUserId ?? me._id

  // The Users table opens Posts for a given user; the nav always opens your own.
  function openTab(next: Tab, userId?: string) {
    setTab(next)
    setPostsUserId(userId)
  }

  return (
    <main>
      <header>
        <span>
          {me.name} ({me.role})
        </span>
        <nav>
          {tabs.map((t) => (
            <button key={t} disabled={t === tab && !postsUserId} onClick={() => openTab(t)}>
              {t}
            </button>
          ))}
        </nav>
        <button onClick={logout}>Log out</button>
      </header>
      {tab === 'My notes' && <MyNotes />}
      {tab === 'Posts' && <Posts key={postsFor} userId={postsFor} mine={postsFor === me._id} />}
      {tab === 'All notes' && <AllNotes />}
      {tab === 'Users' && <Users onShowPosts={(id) => openTab('Posts', id)} />}
      {tab === 'Interests' && <Interests />}
    </main>
  )
}
