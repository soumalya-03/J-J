# Mentor Login App

A React login UI backed by an Express API. Credentials are validated against
`server/users.json` — a file committed to this repository (i.e. stored in
GitHub once pushed). On success the user is redirected to a dashboard that
shows "Welcome Soumalya".

## Structure

- `server/` — Express API (`POST /api/login`, `GET /api/me`) that reads
  `users.json`, checks the bcrypt password hash, and issues a JWT.
- `client/` — React (Vite) app with a Login page and a protected Dashboard
  page. Dev server proxies `/api/*` to the backend on port 4000.

## Default credentials

- Username: `soumalya`
- Password: `Mentor@123`

To change the password, generate a new bcrypt hash and replace
`passwordHash` in `server/users.json`:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD', 10))"
```

Never commit plaintext passwords — only the bcrypt hash is stored.

## Run locally

```bash
# Terminal 1 — API (http://localhost:4000)
cd server
npm install
npm start

# Terminal 2 — UI (http://localhost:5173)
cd client
npm install
npm run dev -- --host
```

Open http://localhost:5173/login in the browser, sign in, and you'll land on
the dashboard.

## Publishing / sharing a live URL

To share a working link instead of just localhost:

1. Push this repo to GitHub.
2. Deploy `server/` to a Node host (Render, Railway, Fly.io, etc.) — set the
   `JWT_SECRET` environment variable there instead of using the dev default.
3. Deploy `client/` to a static host (Vercel, Netlify, GitHub Pages) with
   `npm run build`, and point its API calls at the deployed server URL
   (update the `proxy` target in `vite.config.js` or add a `VITE_API_URL`
   env var).
4. Share the deployed client URL as the login link.

## Security notes

- Passwords are hashed with bcrypt; only the hash lives in `users.json`.
- Login issues a short-lived JWT (2h) used to access `/api/me` and gate the
  dashboard route on the client.
- Set a strong `JWT_SECRET` via environment variable in any real deployment.
