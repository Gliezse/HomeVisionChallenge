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
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview   # optional: serve production build locally
```

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
