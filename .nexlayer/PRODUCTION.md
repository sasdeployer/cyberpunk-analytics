# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-06T08:52:00.643Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

Cyberpunk Analytics is a static React dashboard: Vite builds it into static files and nginx serves them on port 80 from a single web service, with no backend, database or keys. The most important thing for production is the build itself. The Dockerfile runs 'npm ci', but no package-lock.json is committed, so the image build will fail until a lockfile exists or the install command changes.

- **services: One web service, built from the repo, that serves the compiled SPA with nginx. No database, cache or worker.** — package.json has only frontend dependencies (react, recharts, lucide-react), and the Dockerfile's final stage is nginx serving /app/dist, so there is nothing else to run. (`package.json`, `Dockerfile`)
- **build: Use the repo's existing multi-stage Dockerfile: node:20-alpine runs 'npm run build' (vite build), then nginx:alpine serves dist with the repo's nginx.conf. Switch both base images to their mirror.gcr.io/library form and fix the install step.** — The Dockerfile already produces a working static image, but it calls 'npm ci' and no package-lock.json is in the repository, and its FROM lines use bare Docker Hub names. (`Dockerfile`, `package.json`, `nginx.conf`)
- **networking: Expose the web service on port 80 at path /. Ignore the Vite dev port 3000.** — nginx.conf has 'listen 80' and the Dockerfile EXPOSEs 80. Port 3000 in vite.config.js only applies to the dev server. (`nginx.conf`, `Dockerfile`, `vite.config.js`)
- **health: Use GET / as the health check. Client-side routes fall back to index.html.** — nginx.conf serves index.html at / and has 'try_files $uri $uri/ /index.html', so any path returns the SPA shell with 200. (`nginx.conf`)
- **storage: No volume. The service is stateless.** — The image only contains built static assets, and nothing in the repo writes data that must survive a restart. (`Dockerfile`, `package.json`)
- **keys: No keys or environment variables.** — No env vars or secrets are referenced in the config files read, and the dashboard has no backend to authenticate against. (`package.json`, `vite.config.js`)

### Fix before production

- **Blocker** — Commit a package-lock.json or change 'npm ci' to 'npm install' in the Dockerfile: 'npm ci' exits with an error when no package-lock.json exists. The repository has none, so the image build fails and nothing deploys. (`Dockerfile`)
- Use mirrored base images in the Dockerfile: 'FROM node:20-alpine' and 'FROM nginx:alpine' pull from Docker Hub directly, which the Nexlayer build rules require to be mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine. Bare Docker Hub pulls also risk rate-limit failures. (`Dockerfile`)
- Add application/javascript to gzip_types in nginx.conf: Vite's .js bundles are served as application/javascript, which isn't in the gzip_types list, so the largest assets (React and Recharts) go out uncompressed. (`nginx.conf`)
- Repeat the security headers inside the static-asset location block: In nginx, an add_header inside a location replaces the server-level ones. JS, CSS and image responses from the caching block therefore lose X-Frame-Options and X-Content-Type-Options. (`nginx.conf`)

### Verify after the deploy

1. GET / on the app URL returns 200 with an HTML body containing the Vite-built script tag
2. GET /some/unknown/route on the app URL returns 200 and the same index.html (SPA fallback works)
3. Fetch one /assets/*.js file referenced by index.html with 'Accept-Encoding: gzip' and confirm a 200 with a 'Cache-Control: public, immutable' header
4. Load the app URL in a headless browser and confirm there are no console errors and the dashboard charts render

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
