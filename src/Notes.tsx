import { useState, type FormEvent } from 'react'
import { api, type Note, type Page } from './api'
import { Pager } from './Pager'
import { usePaged } from './usePaged'

export function MyNotes() {
  const { result, page, setPage, error, reload } = usePaged<Page<Note>>('/notes')
  const [editing, setEditing] = useState<Note>()

  async function remove(note: Note) {
    if (!confirm(`Delete "${note.title}"?`)) return
    await api(`/notes/${note._id}`, { method: 'DELETE' })
    reload()
  }

  return (
    <section>
      <NoteForm
        key={editing?._id}
        note={editing}
        onDone={() => {
          setEditing(undefined)
          reload()
        }}
        onCancel={() => setEditing(undefined)}
      />
      {error && <p className="error">{error}</p>}
      {result?.data.map((note) => (
        <article key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => setEditing(note)}>Edit</button>
          <button onClick={() => remove(note)}>Delete</button>
        </article>
      ))}
      <Pager page={page} hasNext={result?.hasNext} onChange={setPage} />
    </section>
  )
}

// Used for both create and edit; the parent remounts it (key) to switch notes.
function NoteForm({ note, onDone, onCancel }: { note?: Note; onDone: () => void; onCancel: () => void }) {
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const body = { title: form.get('title'), content: form.get('content') }
    try {
      await api(note ? `/notes/${note._id}` : '/notes', { method: note ? 'PATCH' : 'POST', body })
      formEl.reset()
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{note ? 'Edit note' : 'New note'}</h2>
      <input name="title" placeholder="Title" defaultValue={note?.title} required />
      <textarea name="content" placeholder="Content" defaultValue={note?.content} required />
      <button>{note ? 'Save' : 'Add note'}</button>
      {note && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </form>
  )
}
