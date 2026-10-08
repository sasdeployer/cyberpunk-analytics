# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Commit package-lock.json or switch the Dockerfile to npm install (`Dockerfile`)
      _`npm ci` errors out when no package-lock.json exists, so the image build fails._
- [ ] Prefix base images with mirror.gcr.io/library/ (`Dockerfile`)
      _Pulling node:20-alpine and nginx:alpine straight from Docker Hub can fail or hit rate limits on the build cluster._
- [ ] Repeat the security headers inside the static-asset location block (`nginx.conf`)
      _nginx drops server-level add_header lines in any location that defines its own add_header, so JS and CSS responses lose X-Frame-Options and nosniff._
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200 with an HTML body containing a <div id="root"> mount point or a script tag for /assets/
- [ ] GET /some/unknown/route on the app URL returns 200 (the SPA fallback to index.html works)
- [ ] GET one of the /assets/*.js files referenced by index.html returns 200 with a Cache-Control header containing 'immutable'
- [ ] GET / response headers include X-Content-Type-Options: nosniff

---

Machine-readable: `.nexlayer/findings.json`.
