import { useState, type FormEvent } from 'react'
import { api, toList, type Page, type User } from './api'
import { Pager } from './Pager'
import { usePaged } from './usePaged'

export function Users({ onShowPosts }: { onShowPosts: (userId: string) => void }) {
  const { result, page, setPage, error, reload } = usePaged<Page<User>>('/users')
  const [editing, setEditing] = useState<User>()

  async function remove(user: User) {
    if (!confirm(`Delete ${user.name} and all their notes and posts?`)) return
    try {
      await api(`/users/${user._id}`, { method: 'DELETE' })
      reload()
    } catch (err) {
      alert((err as Error).message)
    }
  }

  return (
    <section>
      <UserForm
        key={editing?._id}
        user={editing}
        onDone={() => {
          setEditing(undefined)
          reload()
        }}
        onCancel={() => setEditing(undefined)}
      />
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Interests</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {result?.data.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.interests.join(', ')}</td>
              <td>
                <button onClick={() => onShowPosts(user._id)}>Posts</button>
                <button onClick={() => setEditing(user)}>Edit</button>
                <button onClick={() => remove(user)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} hasNext={result?.hasNext} onChange={setPage} />
    </section>
  )
}

// Create and edit; on edit an empty password means "keep the current one".
function UserForm({ user, onDone, onCancel }: { user?: User; onDone: () => void; onCancel: () => void }) {
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const password = form.get('password')
    const body = {
      name: form.get('name'),
      email: form.get('email'),
      role: form.get('role'),
      interests: toList(form.get('interests')),
      ...(password && { password }),
    }
    try {
      await api(user ? `/users/${user._id}` : '/users', { method: user ? 'PATCH' : 'POST', body })
      formEl.reset()
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{user ? `Edit ${user.name}` : 'New user'}</h2>
      <input name="name" placeholder="Name" defaultValue={user?.name} required />
      <input name="email" type="email" placeholder="Email" defaultValue={user?.email} required />
      <select name="role" defaultValue={user?.role ?? 'user'}>
        <option value="user">user</option>
        <option value="admin">admin</option>
      </select>
      <input name="interests" placeholder="Interests, comma-separated" defaultValue={user?.interests.join(', ')} />
      <input
        name="password"
        type="password"
        placeholder={user ? 'New password (optional)' : 'Password'}
        required={!user}
      />
      <button>{user ? 'Save' : 'Add user'}</button>
      {user && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  )
}
