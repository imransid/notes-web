# notes-web

Minimal React frontend for [notes-api](https://github.com/imransid/notes-api). React 19, Vite and TypeScript, using `fetch` only, with no router and no UI library.

## Setup

```bash
cp .env.example .env.local     # VITE_API_URL=http://localhost:3000
npm install
npm run dev                    # http://localhost:5173
```

The API's `CORS_ORIGIN` must include this app's origin.

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the API, without a trailing slash. Vite inlines it at build time, so redeploy after changing it. |

The hosted API runs on Render's free tier. It sleeps when idle, so the first request (usually the login) can take up to a minute.

Demo admin: `admin@notes.dev` / `Admin123!`. Demo user: `alice@example.com` / `Password123`.

## What is where

| File | Purpose |
|---|---|
| `src/api.ts` | `fetch` wrapper: base URL, Bearer token, throws the API's error message, logs out on 401. Session (token and user) in `localStorage`. |
| `src/usePaged.ts`, `src/Pager.tsx` | Loads one page of any list endpoint, plus Prev/Next |
| `src/App.tsx` | Login gate and tabs by role |
| `src/Login.tsx` | Log in / register (interests comma-separated) |
| `src/Notes.tsx` | My notes (create, edit and delete, sharing one form) and All notes (admin) |
| `src/Posts.tsx` | Write a post and list a user's posts. Shows your own by default; the admin Users table links here. |
| `src/Users.tsx` | Admin: list, create, edit (password optional) and delete users |
| `src/Interests.tsx` | Admin: interest, user count, user names |

## Trade-offs

- The token is in `localStorage`, so any XSS could read it. An httpOnly cookie would avoid that, but needs CSRF handling.
- Tabs are chosen from the role stored at login. The API enforces roles on every request, so the tabs are only a convenience.
