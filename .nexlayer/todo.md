# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Commit package-lock.json or change npm ci to npm install in the Dockerfile (`Dockerfile`)
      _No package-lock.json appears in the repository tree, but the Dockerfile runs `npm ci` which fails without a lockfile — the build will crash_
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns HTTP 200 and an HTML page containing the cyberpunk analytics dashboard markup
- [ ] GET / returns Content-Type: text/html
- [ ] GET /assets/index-*.js (or similar hashed JS bundle) returns HTTP 200 with Content-Type containing 'javascript'
- [ ] A request to an unknown route like /nonexistent-page returns the same index.html (SPA fallback works)

---

Machine-readable: `.nexlayer/findings.json`.
