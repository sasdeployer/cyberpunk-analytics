# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Commit package-lock.json or change `npm ci` to `npm install` in the Dockerfile (`Dockerfile`)
      _The repo has no package-lock.json, and `npm ci` exits with an error without one, so the image build fails._
- [ ] Point the Dockerfile base images at the mirror (`Dockerfile`)
      _Unprefixed Docker Hub images (node:20-alpine, nginx:alpine) can hit pull limits or fail. Use mirror.gcr.io/library/node:20-alpine and mirror.gcr.io/library/nginx:alpine._
- [ ] Add application/javascript to gzip_types (`nginx.conf`)
      _nginx sends .js files as application/javascript, which is not in the current gzip_types list. The main JS bundle is therefore served uncompressed._
- [ ] Repeat the security add_header lines inside the static-asset location block (or use `always` headers via an include) (`nginx.conf`)
      _The add_header inside the asset location block cancels the server-level headers, so JS, CSS and image responses go out without X-Frame-Options and X-Content-Type-Options._
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- [ ] Decide: The dashboard runs purely client-side today. Should it later show live data from a real analytics API? If so, that API needs its own service and a browser-reachable URL, not a .pod address.
- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200 with an HTML body containing a <script type="module"> tag that points to /assets/
- [ ] GET /some/unknown/route on the app URL returns 200 with the same index.html (SPA fallback works)
- [ ] Fetch one /assets/*.js file referenced by index.html: it returns 200 with header Cache-Control containing 'immutable'
- [ ] GET / response includes the headers X-Frame-Options: SAMEORIGIN and X-Content-Type-Options: nosniff

---

Machine-readable: `.nexlayer/findings.json`.
