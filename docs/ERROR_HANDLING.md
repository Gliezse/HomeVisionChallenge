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

`toggleFavourite` (`src/favourites/FavouritesContext.tsx`) uses a **functional `setIds` updater** that builds the next `Set`, then **`try` / `catch`** around **`localStorage.setItem`**. On success it returns the new set; on failure it returns **`prev`**, so **in-memory favourites stay aligned with what was persisted** (no optimistic UI if storage throws). The updater also assigns a small **`outcome`** object (not textbook-pure) so we know success vs failure without calling **`toast.success` / `toast.error` inside the updater**—those run **immediately after** `setIds` returns (same synchronous turn, not `queueMicrotask`). Error copy explains storage may be full or unavailable; toasts use a stable **`id`** so rapid toggles replace the same toast.

---

## Flow

`HTTP failure` → `AppApiError` → Query retries → if still failing: `isError` / `isFetchNextPageError` → user **Retry** (`refetch` vs `fetchNextPage`).
