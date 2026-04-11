# HomeVision — Houses (interview app)

React + TypeScript app that lists houses from the HomeVision staging API with **infinite scroll**, **virtualized rows**, and **resilience** when the API doesn’t respond (automatic retries, then manual retry).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+ (LTS recommended)
- npm 10+

## Setup

```bash
npm install
```

## Run locally

```bash
make dev          # npm install, then Vite dev server
# or
npm run dev       # after npm install from Setup
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview   # optional: serve production build locally
```

## Docker (production build locally)

Requires [Docker](https://docs.docker.com/get-docker/) with Compose (Docker Desktop includes it).

| Command | What it does |
|--------|----------------|
| `make up` | Build the image and start the app in the background (`docker compose up -d --build`). |
| `make down` | Stop and remove containers and the default network (`docker compose down`). |

**Run the dockerized build in your browser**

1. From the project root: `make up`
2. Wait for the image build and container start to finish (first run takes longer).
3. Open **http://localhost:8080** — nginx serves the production `dist/` output.

To use another host port: `PORT=3000 make up` (maps host `3000` → container `80`).

Equivalent without Make: `docker compose up -d --build` and `docker compose down`.

## Configuration

- **`VITE_API_BASE`** (optional): full URL to the houses endpoint. Defaults to `https://staging.homevision.co/api_project/houses`.

  Example:

  ```bash
  VITE_API_BASE=https://staging.homevision.co/api_project/houses npm run dev
  ```

## Future enhancements

See [FUTURE_ENHANCEMENTS.md](FUTURE_ENHANCEMENTS.md) for planned directions (favourites page, filtering/sorting, house details) and how today’s **API limits** affect them.

## Stack

- Vite, React 19, TypeScript
- Tailwind CSS v4, Inter (variable font via Fontsource)
- TanStack Query (`useInfiniteQuery`) and TanStack Virtual
- Axios for HTTP

## Lint

```bash
npm run lint
```
