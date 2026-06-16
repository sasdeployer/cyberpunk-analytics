# Nexlayer — cyberpunk-analytics

<!-- nexlayer:meta version=1 analyzed=2026-06-14T18:16:28Z repo=https://github.com/sasdeployer/cyberpunk-analytics branch=main -->

> **For AI agents (Claude Code, Cursor, Gemini CLI, Copilot):**
> This file is the **project context** for this Nexlayer deployment — tech stack, env vars, secrets, live URL.
> For full platform detail (nexlayer.yaml schema, Dockerfile rules, CI/CD, task recipes) read **`nexlayer.skills`** in this repo.
>
> **Critical rules (full detail in `nexlayer.skills`):**
> - Inter-pod refs: `${podName:port}` only — never `localhost` or bare hostnames
> - Docker Hub images: prefix with `mirror.gcr.io/library/` — bare tags fail on the cluster
> - Secrets: set in the Nexlayer dashboard — never commit to `nexlayer.yaml` or Dockerfile
>
> **This file:** `agent-managed` sections update automatically. `user-editable` sections (Local Development Setup, Nexlayer Deployment Plan, Build Notes) are yours — preserved across re-analysis.

## Project Summary
<!-- nexlayer:section agent-managed=project_summary -->
A futuristic, cyberpunk-themed product analytics dashboard built with React, Vite, and Recharts for real-time metrics display and engagement analytics.
<!-- nexlayer:end -->

## Technology Stack
<!-- nexlayer:section agent-managed=tech_stack -->
| Name | Kind | Version | Detected From |
|------|------|---------|---------------|
| React | framework | 18.2.0 | package.json |
| Vite | build | 5.0.8 | package.json |
| Tailwind CSS | tool | 3.4.0 | package.json |
| Nginx | infra | alpine | Dockerfile |
<!-- nexlayer:end -->

## Repository Structure
<!-- nexlayer:section agent-managed=structure_map -->
- root — Vite project root
- app.jsx — Main application logic and dashboard components
- main.jsx — React entry point
- index.html — Root HTML template
- nginx.conf — Custom Nginx configuration for production assets
- Dockerfile — Multi-stage build for Node.js and Nginx
<!-- nexlayer:end -->

## External Services Required
<!-- nexlayer:section agent-managed=external_deps -->
_No external services detected._
<!-- nexlayer:end -->

## Local Development Setup
<!-- nexlayer:section user-editable=local_setup -->
### Prerequisites

- Node.js >= 20

### Steps

1. `npm install` — Install project dependencies
2. `npm run dev` — Start Vite development server

<!-- nexlayer:end -->

## Nexlayer Setup
<!-- nexlayer:section agent-managed=nexlayer_setup -->
### Pod Environment Variables

| Pod | Variable | Value | Kind |
|-----|----------|-------|------|
| `app` | `NODE_ENV` | `production` | plain |
| `app` | `PORT` | `"80"` | plain |
| `app` | `HOSTNAME` | `"0.0.0.0"` | plain |

### nexlayer.yaml

```yaml
application:
  name: deep-drift-cyberpunk-analytics
  pods:
    - name: app
      image: "# filled by pipeline"
      path: /
      servicePorts:
        - 80
      vars:
        NODE_ENV: production
        PORT: "80"
        HOSTNAME: "0.0.0.0"
```

<!-- nexlayer:end -->

## Nexlayer Deployment Plan
<!-- nexlayer:section user-editable=deployment_plan -->
### Pod Topology

| Pod | Image | Port | Role |
|-----|-------|------|------|
| analytics-web | mirror.gcr.io/library/nginx:alpine | 80 | web |

### Deployment notes

- The application is a static frontend served by Nginx; no backend or database pods are required based on the provided repository files.
- Docker image is updated to use mirror.gcr.io/library/nginx:alpine per Nexlayer platform rules.

<!-- nexlayer:end -->

## Build Notes
<!-- nexlayer:section user-editable=build_notes -->
<!-- Add notes for future builds here — preserved across re-analysis -->
<!-- nexlayer:end -->

## Nexlayer Configuration
<!-- nexlayer:section agent-managed=nexlayer_config -->
**Last deployed:** 2026-06-14T18:17:23Z  
**Live URL:** https://zen-antelope-deep-drift-cyberpunk-analytics.cloud.nexlayer.ai  
**Runtime:** node · **Port:** 80  
**Deploy branch:** main  

```yaml
application:
  name: deep-drift-cyberpunk-analytics
  pods:
    - name: app
      image: "# filled by pipeline"
      path: /
      servicePorts:
        - 80
      vars:
        NODE_ENV: production
        PORT: "80"
        HOSTNAME: "0.0.0.0"
```
<!-- nexlayer:end -->

## Build History
<!-- nexlayer:section agent-managed=build_history -->
| Date | Status | Notes |
|------|--------|-------|
| 2026-06-14T18:16:28Z | analyzed | initial repo analysis |
| 2026-06-14T18:17:23Z | success | deployed https://zen-antelope-deep-drift-cyberpunk-analytics.cloud.nexlayer.ai |
<!-- nexlayer:end -->
