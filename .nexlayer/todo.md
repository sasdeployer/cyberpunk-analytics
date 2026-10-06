# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Commit a package-lock.json or change 'npm ci' to 'npm install' in the Dockerfile (`Dockerfile`)
      _'npm ci' exits with an error when no package-lock.json exists. The repository has none, so the image build fails and nothing deploys._
- [ ] Use mirrored base images in the Dockerfile (`Dockerfile`)
      _'FROM node:20-alpine' and 'FROM nginx:alpine' pull from Docker Hub directly, which the Nexlayer build rules require to be mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine. Bare Docker Hub pulls also risk rate-limit failures._
- [ ] Add application/javascript to gzip_types in nginx.conf (`nginx.conf`)
      _Vite's .js bundles are served as application/javascript, which isn't in the gzip_types list, so the largest assets (React and Recharts) go out uncompressed._
- [ ] Repeat the security headers inside the static-asset location block (`nginx.conf`)
      _In nginx, an add_header inside a location replaces the server-level ones. JS, CSS and image responses from the caching block therefore lose X-Frame-Options and X-Content-Type-Options._
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200 with an HTML body containing the Vite-built script tag
- [ ] GET /some/unknown/route on the app URL returns 200 and the same index.html (SPA fallback works)
- [ ] Fetch one /assets/*.js file referenced by index.html with 'Accept-Encoding: gzip' and confirm a 200 with a 'Cache-Control: public, immutable' header
- [ ] Load the app URL in a headless browser and confirm there are no console errors and the dashboard charts render

---

Machine-readable: `.nexlayer/findings.json`.
