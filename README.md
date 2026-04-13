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

Vite only exposes variables prefixed with **`VITE_`** to the client. Start from **`.env.example`**, then copy and edit:

```bash
cp .env.example .env
```

See [Vite env files](https://vitejs.dev/guide/env-and-mode.html) for modes (`.env.development`, etc.). You can also set variables inline for a one-off command (below).

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

### Using env vars with Docker

The Docker image serves a **static** build. Vite inlines `VITE_*` when **`npm run build`** runs inside the image, so those values are decided **when the image is built**, not when the container starts. Adding `environment:` under the Compose service does **not** change the bundled app.

Use a **`.env`** at the **repo root** (next to **`docker-compose.yml`**), same as for **`npm run dev`**. Create it from **`.env.example`** if you have not already (`cp .env.example .env`).

[Docker Compose loads that file](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/) on your machine and passes `VITE_API_BASE`, `VITE_INQUIRY_EMAIL`, and `VITE_INQUIRY_SUBJECT` into the image build as build args. That is separate from **`.dockerignore`**, which only means `.env` is not `COPY`’d into the build context—the Compose process still reads it from disk.

For a **one-off override** without editing `.env`, set variables in the shell when you run Compose (they take precedence over entries in `.env` for interpolation):

```bash
VITE_INQUIRY_EMAIL=hello@example.com make up
```

After you add or change `VITE_*` in `.env`, rebuild the image:

```bash
make restart
```

(`make up` runs `docker compose up -d --build`.) Leave a variable out of `.env` (or unset it) to keep the built-in default from the table above; the Dockerfile only forwards non-empty values so empty entries do not override those defaults.

## Documentation

- **[Error handling and user recovery](./docs/ERROR_HANDLING.md)** — Retries, error normalization, and UI recovery paths for the houses list (initial load vs. load more).
- **[Future enhancements](./docs/FUTURE_ENHANCEMENTS.md)** — Planned directions (favourites page, filtering/sorting, house details) and how today’s **API limits** affect them.
