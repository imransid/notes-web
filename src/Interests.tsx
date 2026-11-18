import type { Page, User } from './api'
import { Pager } from './Pager'
import { usePaged } from './usePaged'

interface InterestGroup {
  _id: string // the interest
  count: number
  users: Pick<User, '_id' | 'name' | 'email'>[]
}

export function Interests() {
  const { result, page, setPage, error } = usePaged<Page<InterestGroup>>('/users/by-interest')

  return (
    <section>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Interest</th>
            <th>Users</th>
            <th>Names</th>
          </tr>
        </thead>
        <tbody>
          {result?.data.map((group) => (
            <tr key={group._id}>
              <td>{group._id}</td>
              <td>{group.count}</td>
              <td>{group.users.map((u) => u.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager page={page} hasNext={result?.hasNext} onChange={setPage} />
    </section>
  )
}
