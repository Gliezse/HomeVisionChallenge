# Error handling and user recovery

Short overview of how failures are handled and how users can recover.

---

## Principles

- **Retries first** — Transient API failures are retried automatically (bounded), then the UI offers a manual retry.
- **Partial success** — If page 1 loads but a later page fails, existing rows stay; only the “load more” flow shows an error.
- **One error shape** — `toAppApiError` in `src/api/client.ts` normalizes Axios/network/unknown failures into `AppApiError` so the UI can use `error.message` consistently.

---

## API and query layer

| Piece | Role |
|-------|------|
| **`api/client.ts`** | 8s timeout; only **2xx** counts as success. |
| **`api/houses.ts`** | Catches failures, rethrows `AppApiError`. Malformed `houses` in JSON becomes `[]` (empty list, not an error banner). |
| **`useInfiniteHouses.ts`** | `useInfiniteQuery` with **`retry: 3`** and exponential **`retryDelay`** (cap 10s) per page fetch. |

---

## UI recovery (`HouseTable`)

| Situation | What the user sees | Action |
|-----------|-------------------|--------|
| First load in progress | Skeleton grid | Wait |
| First load failed after retries | `ErrorMessage`: “Failed to load houses” | **Retry** → `refetch()` (restart from page 1) |
| Loaded OK but no rows | “No houses to display.” | — |
| Later page failed | Banner: “Failed to load more houses” | **Retry** → `fetchNextPage()` (keeps loaded data) |

Errors use **`ErrorMessage`** (`src/components/ui/ErrorMessage.tsx`): `role="alert"`, title + message, optional buttons.

---

## Favourites

`src/favourites/FavouritesContext.tsx`: if **`localStorage.setItem`** throws, in-memory favourites **roll back** so the UI matches storage; **`toast.error`** says storage may be full or unavailable. Success uses **`toast.success`**; each toast uses a stable **`id`** per house so rapid toggles don’t stack duplicate toasts.

---

## Flow

`HTTP failure` → `AppApiError` → Query retries → if still failing: `isError` / `isFetchNextPageError` → user **Retry** (`refetch` vs `fetchNextPage`).
