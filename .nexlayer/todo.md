# cyberpunk-analytics — before this ships

Two lists, split by who can actually close the item.

## Needs code — the coding agent

- [ ] **Blocker:** Commit a package-lock.json or replace `npm ci` with `npm install` in the Dockerfile (`Dockerfile`)
      _`npm ci` exits with an error when no lockfile is present, so the image build fails and nothing deploys._
- [ ] Change the FROM lines to use mirror.gcr.io/library/ (`Dockerfile`)
      _Pulling from Docker Hub directly can hit rate limits and fail the build._
- [ ] Build the drafted image(s) once and fix what fails; check `nexlayer.yaml`.

## Needs the human

- [ ] Decide: The dashboard shows metrics but the repo has no data source. Is it meant to stay demo/mock data, or should it later connect to a real analytics API?
- Nothing. This app needs no secrets.

## Check after the deploy — the coding agent

- [ ] GET / on the app URL returns 200 with an HTML body containing a div with id root
- [ ] GET /some/unknown/route on the app URL returns 200 (served by the index.html fallback)
- [ ] A JS asset referenced in index.html returns 200 with a Cache-Control header containing 'immutable'
- [ ] The response to / includes the X-Content-Type-Options: nosniff header

---

Machine-readable: `.nexlayer/findings.json`.
