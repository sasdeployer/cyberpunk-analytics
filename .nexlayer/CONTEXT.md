# cyberpunk-analytics — production context

Written by the Nexlayer agent so any coding agent that opens this repo
starts with the same picture. Read this before proposing infrastructure
changes.

- **Repo** `https://github.com/sasdeployer/cyberpunk-analytics` on `main`
- **Analyzed** 2026-10-13T21:06:33.411Z

## Stack

| Component | Version | How we know |
| --- | --- | --- |
| Node.js | 20 | read from `Dockerfile`, `package.json` |
| React | 18.2 | read from `package.json` |
| Vite | 5.0 | read from `package.json`, `vite.config.js` |
| Tailwind CSS | 3.4 | read from `package.json`, `tailwind.config.js` |
| Recharts | 2.10 | read from `package.json` |
| Nginx | alpine | read from `Dockerfile`, `nginx.conf` |

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

**Stage.** This is a side project.

Said by a person, not derived from the code. Where this contradicts what
the repo looks like, the person is right about intent and the repo is
right about what exists today.

## Notes from the analysis

- This is a static frontend application; the build step (vite build) produces dist/ which nginx serves as static files.
- The production Dockerfile is multi-stage: node:20-alpine builds the assets, nginx:alpine serves them. For Nexlayer, the runtime pod only needs the nginx stage.
- No inter-pod communication is needed as there is no backend or database.
- No database pod is required — all data is client-side (mock or embedded).

## Talking to Nexlayer

Nexlayer is reachable over MCP. Call `nexlayer_get_deployment_workflow`
before deploying — it is the current procedure, and it changes more often
than this file does.
