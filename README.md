# Technical Challenge — HomeVision

## Live Demo

https://home-vision-challenge.vercel.app/

## Task

Build a small React + TypeScript app that loads **house listings** from HomeVision’s staging API and presents them in a **scrollable list**. The API is **flaky** (non-200 responses are expected); the UI should **retry** failed requests and still end up showing data reliably.

### Required features

- List the houses returned by the API with **infinite scroll** (paginated loading).
- **Error handling** when the API fails (retries, then a path for the user to recover).

### Bonus features

- **Favourite** houses (persisted locally; API does not expose a favourites endpoint).
- **Mailto** link to contact HomeVision about a specific house (pre-filled subject/body).
- **Responsive** layout.
- **Accessibility** considerations (semantic structure, labels, keyboard-friendly controls).

## Tech stack

- **Vite 6**, **React 19**, **TypeScript**
- **Tailwind CSS v4**, **Inter** (variable font via Fontsource)
- **TanStack Query** (`useInfiniteQuery`) and **TanStack Virtual** (windowing)
- **Axios** for HTTP

## Local development

### Requirements

- **Node.js** 20+ (LTS recommended)
- **npm** 10+
- **Make** (optional; used by the root `Makefile` for common tasks)

### Setup

```bash
npm install
npm run dev
```

Or, from the repo root:

```bash
make dev    # runs npm install, then the Vite dev server
```

Open the URL Vite prints (default **http://localhost:5173**). To use another port:

```bash
npm run dev -- --port 3000
```

### Lint and format

```bash
npm run lint           # ESLint
npm run format         # Prettier — write
npm run format:check   # Prettier — check only (e.g. CI)
```

On **git commit**, a **Husky** hook runs **lint-staged**: **ESLint (`--fix`)** and **Prettier (`--write`)** on staged `*.ts`, `*.tsx`, `*.js`, plus Prettier on staged `*.css` and `*.json`. Fix any remaining ESLint errors, re-stage if files changed, and commit again.

### Testing

```bash
npm test
```

On **git push**, Husky runs **`npm test`** and **`npm run build`**; if either fails, the push is aborted.

## Local development (Docker)

### Requirements

- **Docker** with **Compose** (e.g. Docker Desktop)

### Setup

```bash
make up    # build image and start container in the background
make down  # stop and remove containers / default network
```

The app is served at **http://localhost:8080** by default (host port **8080** → container **80**).

Override the host port:

```bash
PORT=3000 make up
```

Without Make: `docker compose up -d --build` and `docker compose down` (same `PORT` variable applies in `docker-compose.yml`).

## Environment variables

Vite only exposes variables prefixed with **`VITE_`** to the client. Set them in a **`.env`** file (see [Vite env files](https://vitejs.dev/guide/env-and-mode.html)) or inline for a one-off command.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE` | No | Base URL for the houses API. Default: `https://staging.homevision.co/api_project/houses` |
| `VITE_INQUIRY_EMAIL` | No | **mailto** recipient for house inquiries. Default: `inquiry@homevision-fake-address.com` |
| `VITE_INQUIRY_SUBJECT` | No | **mailto** subject line. Default: `Inquiry about a house` |

Example:

```bash
VITE_API_BASE=https://staging.homevision.co/api_project/houses \
VITE_INQUIRY_EMAIL=hello@example.com \
VITE_INQUIRY_SUBJECT="Question about a listing" \
npm run dev
```

**Ports** are not controlled by these variables: use **`npm run dev -- --port <n>`** for the dev server, or **`PORT=<n> make up`** for the Docker host mapping.

## Documentation

- **[Error handling and user recovery](./docs/ERROR_HANDLING.md)** — Retries, error normalization, and UI recovery paths for the houses list (initial load vs. load more).
- **[Future enhancements](./docs/FUTURE_ENHANCEMENTS.md)** — Planned directions (favourites page, filtering/sorting, house details) and how today’s **API limits** affect them.
