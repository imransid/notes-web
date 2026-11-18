import { useState, type FormEvent } from 'react'
import { api, type Page, type Post, type User } from './api'
import { Pager } from './Pager'
import { usePaged } from './usePaged'

type UserPosts = Page<Post> & { user: Pick<User, '_id' | 'name'> }

export function Posts({ userId, mine }: { userId: string; mine: boolean }) {
  const { result, page, setPage, error, reload } = usePaged<UserPosts>(`/users/${userId}/posts`)

  return (
    <section>
      {mine && <PostForm onDone={reload} />}
      <h2>Posts by {result?.user.name}</h2>
      {error && <p className="error">{error}</p>}
      {result?.data.map((post) => (
        <article key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </article>
      ))}
      <Pager page={page} hasNext={result?.hasNext} onChange={setPage} />
    </section>
  )
}

function PostForm({ onDone }: { onDone: () => void }) {
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    try {
      await api('/posts', { method: 'POST', body: { title: form.get('title'), body: form.get('body') } })
      formEl.reset()
      onDone()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>New post</h2>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Write something" required />
      <button>Publish</button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
