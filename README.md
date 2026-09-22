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

This repo includes [render.yaml](render.yaml), a Render Blueprint that deploys
both pieces in one step:

1. Go to https://dashboard.render.com → **New +** → **Blueprint**.
2. Connect your GitHub account and select the `soumalya-03/J-J` repo.
3. Render reads `render.yaml` and creates two services:
   - `mentor-login-api` — the Express API (Node web service)
   - `mentor-login-client` — the React app (static site), wired to call the
     API automatically via the `VITE_API_HOST` build variable.
4. Click **Apply** / **Create**. After both services finish deploying, open
   the `mentor-login-client` service URL (something like
   `https://mentor-login-client.onrender.com`) — that's your public login
   link.

Free Render web services spin down after inactivity, so the first request
after idling may take ~30-60s to respond while it wakes up.

## Security notes

- Passwords are hashed with bcrypt; only the hash lives in `users.json`.
- Login issues a short-lived JWT (2h) used to access `/api/me` and gate the
  dashboard route on the client.
- Set a strong `JWT_SECRET` via environment variable in any real deployment.
