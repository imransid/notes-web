export function Pager({ page, hasNext, onChange }: { page: number; hasNext?: boolean; onChange: (page: number) => void }) {
  return (
    <div className="pager">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      <span>Page {page}</span>
      <button disabled={!hasNext} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  )
}
