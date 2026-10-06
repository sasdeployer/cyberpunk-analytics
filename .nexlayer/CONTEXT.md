# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-06T08:46:55.380Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| JavaScript (ES modules) |  | read from `package.json` |
| React | ^18.2.0 | read from `package.json` |
| Vite | ^5.0.8 | read from `package.json`, `vite.config.js` |
| @vitejs/plugin-react | ^4.2.1 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | ^3.4.0 | read from `package.json`, `tailwind.config.js` |
| PostCSS / Autoprefixer | ^8.4.32 / ^10.4.16 | read from `package.json`, `postcss.config.js` |
| Recharts | ^2.10.3 | read from `package.json` |
| lucide-react | ^0.263.1 | read from `package.json` |
| Node.js | 20 (build stage) | read from `Dockerfile` |
| nginx | alpine | read from `Dockerfile`, `nginx.conf` |
| Docker (multi-stage build) |  | read from `Dockerfile` |

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

- Single-pod deployment: the app is a static SPA with no backend, database, or cache, so no other pods are needed.
- The web pod is built from the repo Dockerfile and nginx serves the Vite build output on port 80.
- Change the Dockerfile base images to the mirror: 'FROM mirror.gcr.io/library/node:20-alpine AS builder' and 'FROM mirror.gcr.io/library/nginx:alpine'. Unprefixed Docker Hub references may fail on the cluster.
- The root listing shows no package-lock.json, but the Dockerfile runs 'npm ci', which fails without a lockfile (the .gitignore may be excluding it). Commit package-lock.json or switch to 'npm install'.
- Source files sit at the repo root (app.jsx, main.jsx). Check that import paths match file-name case exactly (e.g. './app.jsx' vs './App.jsx'), since Linux builds are case-sensitive.
- The Vite dev server uses port 3000 locally, but the production container listens on port 80, so the Nexlayer pod port is 80.
- Any backend API added later must be addressed as <podName>.pod:<port> from server-side code. Browser code cannot reach .pod hostnames.

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
