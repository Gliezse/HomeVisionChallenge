# Future enhancements

Ideas for evolving the app beyond the current interview scope. Each item notes what would be needed on the **API** side, because today’s staging endpoint is intentionally limited.

---

## Better favourites list

**Goal:** After favouriting a house, the user can open a dedicated route (for example `/favourites`) and see every saved listing in one place.

**Approach today:** The app only persists **numeric ids** in `localStorage` (comma-separated). To render a full favourites page without extra API support, you would have to store **entire house objects** locally.

**Current drawbacks**

- **Limited API:** There is no “fetch house by id” (or batch-by-ids) endpoint, so you cannot reliably rehydrate favourites from the server using only stored ids.
- **Stale data:** If you snapshot whole objects in `localStorage`, any change on the server (price, status, photos, etc.) will not be reflected until the user clears storage or you add sync logic backed by richer APIs.

**What would help:** Search or fetch-by-id (or a `POST /houses/by-ids` style contract), plus optional etag/updated-at fields for cache invalidation.

---

## Filtering and ordering

**Goal:** Let users narrow the list (e.g. by **area** and **price range** first), then extend to house size, amenities, etc. Let them **sort** (e.g. by price first, later by age, room count).

**Current drawbacks**

- **No query parameters:** The staging API does not expose filters or sort order on the list endpoint.
- **Infinite scroll + partial data:** The UI never holds the full dataset in memory, so **client-only** filtering/sorting across “all houses” is not correct—you would only be reordering/filtering the small window already loaded.

**What would help:** Server-side filter and sort query parameters (and stable pagination semantics that work with them), or a separate search endpoint that returns the same house shape.

---

## Extra house details

**Goal:** The user opens a detail view (clicking the card or a “View more” control) and sees richer fields: size, room count, age, amenities, etc.

**Current drawbacks**

- **Limited list payload:** The current API response only includes the fields used on the card (id, address, homeowner, price, photo URL).
- **No details endpoint:** There is no dedicated “get house by id” resource that returns an expanded schema.

**What would help:** Either embed optional detail fields in the list response, or add something like `GET /houses/:id` (or equivalent) with a documented detail DTO.
