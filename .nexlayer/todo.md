# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Replace `npm ci` with `npm install` in the Dockerfile, or commit a package-lock.json (`Dockerfile`)
      _The repo has no package-lock.json, so `npm ci` exits with an error and the image never builds._
- [ ] Use mirrored base images: mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine (`Dockerfile`)
      _Pulling node:20-alpine and nginx:alpine directly from Docker Hub can hit rate limits and fail the build._
- [ ] Repeat the security headers inside the static-asset location block (or add them with `always` there too) (`nginx.conf`)
      _nginx drops server-level add_header directives in any location that defines its own add_header. JS, CSS and image responses therefore currently go out without X-Frame-Options or X-Content-Type-Options._
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200 with Content-Type text/html and the page includes a <script> tag pointing at /assets/
- [ ] GET /some/unknown/route on the app URL returns 200 and the same index.html (SPA fallback via try_files)
- [ ] GET one of the /assets/*.js files referenced by index.html returns 200 with header `Cache-Control: public, immutable`
- [ ] GET / response headers include X-Frame-Options: SAMEORIGIN and X-Content-Type-Options: nosniff

---

Machine-readable: `.nexlayer/findings.json`.
