# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-06T08:48:19.943Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

Cyberpunk Analytics is a static React and Vite dashboard. It has no backend, database or keys. The repo's Dockerfile builds the bundle with Node and serves the dist folder from nginx on port 80, so one web service is all it needs. The thing that matters most is that the Dockerfile runs `npm ci` but the repo has no package-lock.json, so the build will fail until that is fixed.

- **services: One web service: the nginx image built from the repo Dockerfile, serving the built static site on port 80 at path /** — The app is a pure client-side React bundle. Its package.json scripts are only `vite`, `vite build` and `vite preview`, and the Dockerfile ends in nginx serving /usr/share/nginx/html. (`package.json`, `Dockerfile`, `nginx.conf`)
- **build: Build with the existing multi-stage Dockerfile at the repo root, after changing `npm ci` to `npm install` and moving both FROM lines to mirror.gcr.io/library images** — `npm ci` requires a package-lock.json, and the repo tree has none. Unmirrored Docker Hub base images risk pull failures. (`Dockerfile`, `package.json`)
- **networking: Port 80, the nginx listen port, is the only port. The Vite dev port 3000 is ignored in production.** — nginx.conf listens on 80 and the Dockerfile exposes 80. The vite.config.js server block (0.0.0.0:3000) only affects `npm run dev`. (`nginx.conf`, `Dockerfile`, `vite.config.js`)
- **keys: No keys or environment variables are needed** — The app has no backend and no env vars were found. The service's vars are empty. (`package.json`, `vite.config.js`)
- **storage: No volume is needed** — Nothing is written at runtime. nginx only serves files baked into the image at build time. (`Dockerfile`, `nginx.conf`)

### Fix before production

- **Blocker** — Replace `npm ci` with `npm install` in the Dockerfile, or commit a package-lock.json: The repo has no package-lock.json, so `npm ci` exits with an error and the image never builds. (`Dockerfile`)
- Use mirrored base images: mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine: Pulling node:20-alpine and nginx:alpine directly from Docker Hub can hit rate limits and fail the build. (`Dockerfile`)
- Repeat the security headers inside the static-asset location block (or add them with `always` there too): nginx drops server-level add_header directives in any location that defines its own add_header. JS, CSS and image responses therefore currently go out without X-Frame-Options or X-Content-Type-Options. (`nginx.conf`)

### Verify after the deploy

1. GET / on the app URL returns 200 with Content-Type text/html and the page includes a <script> tag pointing at /assets/
2. GET /some/unknown/route on the app URL returns 200 and the same index.html (SPA fallback via try_files)
3. GET one of the /assets/*.js files referenced by index.html returns 200 with header `Cache-Control: public, immutable`
4. GET / response headers include X-Frame-Options: SAMEORIGIN and X-Content-Type-Options: nosniff

## Drafts in this pull request

This repo had no deploy config, so this plan adds drafts where files were
missing (never over an existing file):

- `nexlayer.yaml` — what runs, written by the Nexlayer agent (see "The production plan"). Not yet checked by the Nexlayer validator — run `nexlayer_validate_yaml` first.

Build them once, fix what fails, then deploy with `.nexlayer/pipeline.yaml`.
After the first successful deploy, these files are the source of truth.

## What this app is for

just testing

The human calls this a side project.

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
