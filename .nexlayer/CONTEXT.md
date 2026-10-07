# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-07T20:24:50.937Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| JavaScript | ES modules | read from `package.json` |
| React | 18.2 | read from `package.json` |
| Vite | 5.0 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | 3.4 | read from `package.json`, `tailwind.config.js`, `postcss.config.js` |
| Recharts | 2.10 | read from `package.json` |
| Lucide React | 0.263 | read from `package.json` |
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

## Notes from the analysis

- Static SPA with no backend or database, so a single pod is enough
- The Dockerfile uses a multi-stage build; the base images should be mirrored as mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine
- nginx serves the built assets on port 80
- The Dockerfile references nginx.conf, which is present in the repo
- The Dockerfile runs npm ci, which requires a package-lock.json that is not in the root listing. Add one or switch to npm install

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
