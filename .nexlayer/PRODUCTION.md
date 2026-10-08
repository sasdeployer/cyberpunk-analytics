# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-08T02:31:49.238Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

Cyberpunk Analytics is a client-side React dashboard. Vite builds it into static files, and nginx serves them on port 80 as one web service, with no backend, database or keys. The one thing that matters most for production is that the existing Dockerfile runs `npm ci`, but the repo has no package-lock.json, so the image build will fail until that is fixed.

- **services: One web service named 'web': the repo's multi-stage Dockerfile builds the app, and nginx serves dist/ on port 80 at path /.** — The Dockerfile builds with Vite and copies dist into nginx, which listens on 80 per nginx.conf. (`Dockerfile`, `nginx.conf`, `package.json`)
- **database: No database, cache or volume.** — package.json has only UI dependencies (react, recharts, lucide-react) and no server code, so nothing needs to survive a restart. (`package.json`)
- **build: Use the existing Dockerfile, with mirrored base images and an install step that works without a lockfile.** — The Dockerfile pulls node:20-alpine and nginx:alpine straight from Docker Hub and runs `npm ci`, but package-lock.json is not in the repo. (`Dockerfile`, `package.json`)
- **networking: nginx falls back to index.html so client-side routes resolve, and Nexlayer routes public traffic to port 80.** — nginx.conf uses try_files $uri $uri/ /index.html. (`nginx.conf`)
- **keys: No keys or environment variables.** — The app is a static bundle with no runtime configuration read from the environment. (`package.json`, `vite.config.js`)

### Fix before production

- **Blocker** — Commit package-lock.json or switch the Dockerfile to npm install: `npm ci` errors out when no package-lock.json exists, so the image build fails. (`Dockerfile`)
- Prefix base images with mirror.gcr.io/library/: Pulling node:20-alpine and nginx:alpine straight from Docker Hub can fail or hit rate limits on the build cluster. (`Dockerfile`)
- Repeat the security headers inside the static-asset location block: nginx drops server-level add_header lines in any location that defines its own add_header, so JS and CSS responses lose X-Frame-Options and nosniff. (`nginx.conf`)

### Verify after the deploy

1. GET / on the app URL returns 200 with an HTML body containing a <div id="root"> mount point or a script tag for /assets/
2. GET /some/unknown/route on the app URL returns 200 (the SPA fallback to index.html works)
3. GET one of the /assets/*.js files referenced by index.html returns 200 with a Cache-Control header containing 'immutable'
4. GET / response headers include X-Content-Type-Options: nosniff

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

The `verify` list in `.nexlayer/pipeline.yaml` is what to check. Check it — do not
assume a deploy worked.

## Stop and ask the human

- A required key is missing (send the link above — never take the value).
- Something would become publicly reachable that is internal in this plan.
- Anything that deletes data or tears down a running deployment.

Everything else is yours to do. When something breaks, start at
`.nexlayer/TROUBLESHOOTING.md`.
