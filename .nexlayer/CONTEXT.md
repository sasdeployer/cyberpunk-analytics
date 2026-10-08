# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-08T02:31:49.238Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| JavaScript | ES modules | read from `package.json`, `app.jsx`, `main.jsx` |
| React | 18.2 | read from `package.json` |
| Vite | 5.0 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | 3.4 | read from `package.json`, `tailwind.config.js`, `postcss.config.js` |
| PostCSS | 8.4 | read from `package.json`, `postcss.config.js` |
| Recharts | 2.10 | read from `package.json` |
| lucide-react | 0.263 | read from `package.json` |
| nginx | alpine | read from `Dockerfile`, `nginx.conf` |
| Docker | multi-stage | read from `Dockerfile` |

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

## What the human told us

**Stage.** This is an experiment.

Said by a person, not derived from the code. Where this contradicts what
the repo looks like, the person is right about intent and the repo is
right about what exists today.

## Notes from the analysis

- Single static frontend pod: the Dockerfile builds with node:20-alpine and serves dist via nginx on port 80. The Dockerfile base images should be mirrored (mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine) for the cluster.
- No backend, database, or cache is present; data appears to be generated client-side, so no other pods are needed.
- No environment variables are required.

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
