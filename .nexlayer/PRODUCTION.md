# Nexlayer — how `cyberpunk-analytics` ships

You were asked to work on or deploy this app. The state below is already
resolved — do not re-derive it from the code. The procedure is not here;
ask Nexlayer for it (see "How to deploy").

## The app

| | |
| --- | --- |
| Name | `cyberpunk-analytics` |
| Repo | `https://github.com/sasdeployer/cyberpunk-analytics` on `main` |
| Planned | 2026-10-07T20:25:27.676Z |
| Registered with Nexlayer | yes |

`.nexlayer/plan.lock` pins the commit this plan was written against. If HEAD
has moved and you changed how the app starts, runs, or what it needs,
re-check before deploying.

## The production plan

Written by the Nexlayer agent from this repo. Every decision cites the files it
rests on; if the code has changed since, re-check those files first.

A static React + Vite + Tailwind analytics dashboard, built once and served by nginx on port 80 from a single web service. There is no backend, database or keys, so nothing needs a volume. The one thing that matters most: the existing Dockerfile runs `npm ci`, but the repo has no package-lock.json, so the build fails until that is fixed.

- **services: One web service, built from the repo's Dockerfile, serving the built SPA with nginx** — The app is a client-only React dashboard with no server code, database or external services, and the Dockerfile builds to dist/ and serves it with nginx. (`Dockerfile`, `package.json`, `app.jsx`, `main.jsx`)
- **networking: Expose port 80 at path / and keep nginx.conf's try_files fallback to index.html** — nginx.conf listens on 80 and routes unknown paths to index.html, so client-side routes resolve. (`nginx.conf`, `Dockerfile`)
- **build: Keep the multi-stage Dockerfile, move the base images to mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine, and use `npm install` instead of `npm ci`** — The Dockerfile uses Docker Hub images and `npm ci`, but there is no package-lock.json in the tree, so `npm ci` fails. (`Dockerfile`, `package.json`)
- **storage: No volumes** — The app stores no data at runtime. nginx only serves static files baked into the image. (`Dockerfile`, `nginx.conf`)
- **scaling: Run the web service at 1 instance by default; it can scale out freely** — Static files served by nginx keep no session state. (`nginx.conf`)

### Fix before production

- **Blocker** — Commit a package-lock.json or replace `npm ci` with `npm install` in the Dockerfile: `npm ci` exits with an error when no lockfile is present, so the image build fails and nothing deploys. (`Dockerfile`)
- Change the FROM lines to use mirror.gcr.io/library/: Pulling from Docker Hub directly can hit rate limits and fail the build. (`Dockerfile`)

### Verify after the deploy

1. GET / on the app URL returns 200 with an HTML body containing a div with id root
2. GET /some/unknown/route on the app URL returns 200 (served by the index.html fallback)
3. A JS asset referenced in index.html returns 200 with a Cache-Control header containing 'immutable'
4. The response to / includes the X-Content-Type-Options: nosniff header

### Ask the human

- The dashboard shows metrics but the repo has no data source. Is it meant to stay demo/mock data, or should it later connect to a real analytics API?

## Drafts in this pull request

This repo had no deploy config, so this plan adds drafts where files were
missing (never over an existing file):

- `nexlayer.yaml` — what runs, written by the Nexlayer agent (see "The production plan"). It passes the Nexlayer validator.

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
