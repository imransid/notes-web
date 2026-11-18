import { useEffect, useState } from 'react'
import { api, type Page } from './api'

export function usePaged<R extends Page<unknown>>(path: string) {
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<R>()
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let ignore = false // drop responses for a page we already left
    api<R>(`${path}?page=${page}&limit=10`).then(
      (res) => {
        if (ignore) return
        setResult(res)
        setError('')
      },
      (err: Error) => !ignore && setError(err.message),
    )
    return () => {
      ignore = true
    }
  }, [path, page, version])

  return { result, page, setPage, error, reload: () => setVersion((v) => v + 1) }
}
