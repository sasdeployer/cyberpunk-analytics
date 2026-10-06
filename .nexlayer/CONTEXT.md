# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-06T08:52:00.643Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| JavaScript (ES modules) | ES2020+ | read from `package.json`, `main.jsx`, `app.jsx` |
| Node.js | 20 | read from `Dockerfile` |
| React | ^18.2.0 | read from `package.json`, `README.md` |
| Vite | ^5.0.8 | read from `package.json`, `vite.config.js` |
| @vitejs/plugin-react | ^4.2.1 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | ^3.4.0 | read from `package.json`, `tailwind.config.js`, `index.css` |
| PostCSS / Autoprefixer | ^8.4.32 / ^10.4.16 | read from `package.json`, `postcss.config.js` |
| Recharts | ^2.10.3 | read from `package.json`, `README.md` |
| lucide-react | ^0.263.1 | read from `package.json` |
| nginx | alpine | read from `Dockerfile`, `nginx.conf` |
| Docker (multi-stage build) | n/a | read from `Dockerfile` |

## How Nexlayer will run it

| Service | Reachable | Image | How we know |
| --- | --- | --- | --- |
| `web` | public | `registry.nexlayer.io/YOUR_USER_ID/cyberpunk-analytics-web:planned` | read from `.nexlayer/drafts/nexlayer.yaml` |

Reachability is inferred from service names and roles, not stated by the
analysis. Check it before relying on it — exposing something that should
be internal is not recoverable by editing this file afterwards.

Networking, HTTPS, and service discovery are handled.

## Secrets

This app needs no secrets to run.

## Notes from the analysis

- This is a static SPA, so one pod is enough. nginx serves the Vite build output on port 80, and no database, cache or worker pod is needed.
- The web pod is built from the repo Dockerfile. Change its base images to the mirror form: 'FROM mirror.gcr.io/library/node:20-alpine AS builder' and 'FROM mirror.gcr.io/library/nginx:alpine'.
- The container listens on port 80. nginx.conf was not provided, so check that it has 'listen 80' and an SPA fallback ('try_files $uri /index.html').
- The dev server uses port 3000, but the production container uses port 80. Use 80 for the Nexlayer pod.
- The build relies on 'npm ci', so package-lock.json must be committed. The root listing does not show one, and the Docker build will fail without it. If it is missing, generate one or switch the Dockerfile to 'npm install'.
- The source files sit at the repo root (app.jsx, main.jsx), not under src/. Check that index.html's script path and main.jsx's import of the app component match the filename casing exactly, because the Linux build is case-sensitive (app.jsx vs App.jsx).
- No environment variables or secrets are used. Any data shown appears to be generated client-side, and no API calls are visible in the files provided.

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
