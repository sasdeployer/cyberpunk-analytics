# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-06T08:46:55.380Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

This app is one static React dashboard. Vite builds it, and the repo's own Dockerfile serves the result with nginx on port 80. There is no backend, database or key to wire up. What matters most is the image build: the Dockerfile runs `npm ci`, but the repo has no package-lock.json, so the build fails until that is fixed.

- **services: A single 'web' service: nginx serving the built Vite single-page app. No database, cache or other service.** — package.json only has front-end dependencies (react, recharts, lucide-react) and no server code, so the app runs entirely in the browser. (`package.json`, `Dockerfile`, `nginx.conf`)
- **build: Build the 'web' image from the existing multi-stage Dockerfile at the repo root. Stage one is node:20-alpine running `npm run build`; stage two is nginx:alpine with dist/ in /usr/share/nginx/html. Push it as registry.nexlayer.io/YOUR_USER_ID/cyberpunk-analytics-web:planned.** — The Dockerfile already produces a working nginx image from `vite build` output. It only needs the lockfile fix and mirrored base images. (`Dockerfile`, `package.json`, `vite.config.js`)
- **networking: Expose port 80 at path '/'. The Vite dev port 3000 is not used in production.** — nginx.conf listens on 80 and the Dockerfile EXPOSEs 80. Port 3000 in vite.config.js applies only to the dev server. (`nginx.conf`, `Dockerfile`, `vite.config.js`)
- **storage: No volumes.** — The app writes no data. Everything it serves is baked into the image at build time. (`Dockerfile`, `package.json`)
- **health: Use GET / returning 200 as the health signal, and rely on nginx's try_files fallback to index.html for client-side routes.** — nginx.conf sends every unknown path to /index.html, so any path should return the app shell. (`nginx.conf`)

### Fix before production

- **Blocker** — Commit package-lock.json or change `npm ci` to `npm install` in the Dockerfile: The repo has no package-lock.json, and `npm ci` exits with an error without one, so the image build fails. (`Dockerfile`)
- Point the Dockerfile base images at the mirror: Unprefixed Docker Hub images (node:20-alpine, nginx:alpine) can hit pull limits or fail. Use mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine. (`Dockerfile`)
- Add application/javascript to gzip_types: nginx sends .js files as application/javascript, which is not in the current gzip_types list. The main JS bundle is therefore served uncompressed. (`nginx.conf`)
- Repeat the security add_header lines inside the static-asset location block (or use `always` headers via an include): The add_header inside the asset location block cancels the server-level headers, so JS, CSS and image responses go out without X-Frame-Options and X-Content-Type-Options. (`nginx.conf`)

### Verify after the deploy

1. GET / on the app URL returns 200 with an HTML body containing a <script type="module"> tag that points to /assets/
2. GET /some/unknown/route on the app URL returns 200 with the same index.html (SPA fallback works)
3. Fetch one /assets/*.js file referenced by index.html: it returns 200 with header Cache-Control containing 'immutable'
4. GET / response includes the headers X-Frame-Options: SAMEORIGIN and X-Content-Type-Options: nosniff

### Ask the human

- The dashboard runs purely client-side today. Should it later show live data from a real analytics API? If so, that API needs its own service and a browser-reachable URL, not a .pod address.

## Drafts in this pull request

This repo had no deploy config, so this plan adds drafts where files were
missing (never over an existing file):

- `nexlayer.yaml` — what runs, written by the Nexlayer agent (see "The production plan"). Not yet checked by the Nexlayer validator — run `nexlayer_validate_yaml` first.

Build them once, fix what fails, then deploy with `.nexlayer/pipeline.yaml`.
After the first successful deploy, these files are the source of truth.

## Can this deploy right now?

**Yes.** Nothing is blocking.

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
