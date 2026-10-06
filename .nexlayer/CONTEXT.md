# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-06T08:47:47.317Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| JavaScript | ES modules | read from `package.json`, `app.jsx`, `main.jsx` |
| React | ^18.2.0 | read from `package.json` |
| Vite | ^5.0.8 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | ^3.4.0 | read from `package.json`, `tailwind.config.js`, `postcss.config.js` |
| PostCSS | ^8.4.32 | read from `package.json`, `postcss.config.js` |
| Autoprefixer | ^10.4.16 | read from `package.json` |
| Recharts | ^2.10.3 | read from `package.json` |
| lucide-react | ^0.263.1 | read from `package.json` |
| nginx | alpine | read from `Dockerfile`, `nginx.conf` |
| Docker | multi-stage build | read from `Dockerfile` |
| Node.js | 20 (build stage) | read from `Dockerfile` |

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

- Pure static frontend with no backend, database or cache, so a single web pod is enough.
- Build with the repo Dockerfile: the node:20-alpine builder stage should use mirror.gcr.io/library/node:20-alpine, and the runtime stage mirror.gcr.io/library/nginx:alpine, to avoid Docker Hub pull failures on the cluster.
- nginx serves the Vite dist output on port 80 (nginx.conf is copied to /etc/nginx/conf.d/default.conf).
- No environment variables are read by the app, so none need to be configured.

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
