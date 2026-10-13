# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-13T21:06:33.411Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

A single nginx pod serves the pre-built static Vite/React dashboard. There is no backend, database, or persistent data — the entire app is client-side with mock analytics. The one thing that matters most is ensuring the build step produces dist/ and nginx serves it correctly.

- **services: One web pod running nginx to serve the static Vite build output from /usr/share/nginx/html** — The Dockerfile's production stage is nginx:alpine serving static files, and the nginx.conf has SPA fallback (try_files $uri $uri/ /index.html) — no other services are needed (`Dockerfile`, `nginx.conf`)
- **build: Use the existing multi-stage Dockerfile: node:20-alpine runs vite build to produce dist/, then nginx:alpine serves it** — The Dockerfile already correctly builds the Vite app and copies dist/ into the nginx image at /usr/share/nginx/html (`Dockerfile`, `vite.config.js`)
- **networking: Single pod listens on port 80 and receives all external traffic at path /** — nginx.conf listens on port 80 and the nginx.conf SPA rewrite rule handles all routes (`nginx.conf`)
- **storage: No volumes — the app serves only static build artifacts with no uploads, no database, no state to persist** — There are no external_deps, no database, and all analytics data is client-side mock or embedded in the bundle (`package.json`, `app.jsx`)

### Fix before production

- **Blocker** — Commit package-lock.json or change npm ci to npm install in the Dockerfile: No package-lock.json appears in the repository tree, but the Dockerfile runs `npm ci` which fails without a lockfile — the build will crash (`Dockerfile`)

### Verify after the deploy

1. GET / on the app URL returns HTTP 200 and an HTML page containing the cyberpunk analytics dashboard markup
2. GET / returns Content-Type: text/html
3. GET /assets/index-*.js (or similar hashed JS bundle) returns HTTP 200 with Content-Type containing 'javascript'
4. A request to an unknown route like /nonexistent-page returns the same index.html (SPA fallback works)

## Running now

`cyberpunk-analytics` is already deployed on Nexlayer (running when this plan was written).

| | |
| --- | --- |
| applicationName | `cyberpunk-analytics` |
| environment | `zen-antelope` |
| URL | <https://zen-antelope-cyberpunk-analytics.cloud.nexlayer.ai> |

Every Nexlayer tool that targets this app — status, logs, events, the debug
proxy — takes these two values. Use them as written; do not ask for them.
A redeploy updates this deployment in place.

## Drafts in this plan

This repo had no deploy config, so this plan adds drafts where files were
missing (never over an existing file):

- `nexlayer.yaml` — what runs, written by the Nexlayer agent (see "The production plan"). It passes the Nexlayer validator.

Build them once, fix what fails, then deploy with `.nexlayer/pipeline.yaml`.
After the first successful deploy, these files are the source of truth.

## Can this deploy right now?

**Not yet — 1 blocker under "Fix before production" (yours).** Full list in `.nexlayer/todo.md`.

Fix those first. Deploying with them open ships a known problem.

## How to deploy

Call `nexlayer_get_deployment_workflow` first. It returns the current
procedure — building and pushing the image included — and it is kept up to
date in a way this file is not. Do not infer the steps from here, and do
not skip it because the app looks simple.

If Nexlayer tools are not available to you, the human runs
`npx @nexlayer/mcp-install` once.

## Secrets

This app needs no secrets.

## What was inferred rather than read

Nothing. Every claim in this plan was read from the repo.

## What "it worked" means

After every deploy, run `nexlayer_verify_deploy`. A deploy is accepted before it is
known to work; only "✓ Working" means it worked. It runs the `verify` list in
`.nexlayer/pipeline.yaml`, and when the app is broken it says what broke and why.

## Stop and ask the human

- A required key is missing (send the link above — never take the value).
- Something would become publicly reachable that is internal in this plan.
- Anything that deletes data or tears down a running deployment.

Everything else is yours to do. When something breaks, start at
`.nexlayer/TROUBLESHOOTING.md`.
