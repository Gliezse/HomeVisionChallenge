# 📄 Cursor Plan Document — HomeVision Frontend Challenge

## 1. Overview

Build a modern React + TypeScript web app that displays an **infinite scrolling list of houses** fetched from a **flaky API**, with robust error handling and retry mechanisms.

The UI should be **clean, modern, and reusable**, emphasizing component design and production-level patterns.

---

## 2. Tech Stack

### Core

- React (Vite)
- TypeScript

### Styling

- Tailwind CSS
- Font: **Inter** (modern, clean, highly readable)

### Data Fetching

- Axios
- TanStack React Query

### State / Architecture

- Server state: React Query
- UI state: React hooks

## Virtualization

- Tanstack Virtual

---

## 3. API Contract (IMPORTANT)

Base URL:

```
https://staging.homevision.co/api_project/houses
```

Query params:

- `page` (number, default: 1)
- `per_page` (number, default: 10)

### Example Response

```json
{
  "houses": [
    {
      "id": 0,
      "address": "4 Pumpkin Hill Street Antioch, TN 37013",
      "homeowner": "Nicole Bone",
      "price": 105124,
      "photoURL": "https://image.shutterstock.com/image-photo/big-custom-made-luxury-house-260nw-374099713.jpg"
    }
  ]
}
```

⚠️ The API is **flaky**:

- Can return non-200 responses
- Must implement retry + graceful recovery
- Must ensure images eventually load

---

## 4. Project Structure

```
src/
  api/
    client.ts
    houses.ts

  components/
    ui/
      Button.tsx
      Spinner.tsx
      ErrorMessage.tsx

    house/
      HouseCard.tsx
      HouseTable.tsx

    layout/
      Container.tsx

  hooks/
    useInfiniteHouses.ts

  pages/
    Home.tsx

  types/
    house.ts

  utils/
    format.ts

  App.tsx
  main.tsx
```

---

## 5. Data Layer

### Axios Client

- Base URL configured
- Timeout (e.g. 5–10s)
- Response error normalization

---

### React Query Setup

Use `useInfiniteQuery`:

```ts
useInfiniteQuery({
  queryKey: ["houses"],
  queryFn: fetchHouses,
  getNextPageParam: (lastPage, allPages) => {
    return lastPage.hasMore ? allPages.length + 1 : undefined;
  },
  retry: 3,
});
```

---

## 6. Custom Hook

### `useInfiniteHouses`

Responsibilities:

- Fetch paginated data
- Flatten pages
- Handle retry logic
- Expose:

```ts
{
  houses: House[]
  fetchNextPage: () => void
  hasNextPage: boolean
  isFetchingNextPage: boolean
  isError: boolean
  refetch: () => void
  retryCount: number
}
```

---

## 7. Infinite Scroll Strategy

Use Virtualization (IMPORTANT):
When get to the bottom, call next page.

---

### Retry Logic (CRITICAL REQUIREMENT)

Behavior:

1. Automatically retry **up to 3 times**
2. If still failing:
   - Stop auto-fetch
   - Show **manual retry button**

---

### UI Flow

| State                   | Behavior                                  |
| ----------------------- | ----------------------------------------- |
| Loading first page      | Full table skeleton                       |
| Fetching next page      | 5 records spinner at the end of the table |
| Error (< 3 retries)     | Silent retry                              |
| Error (after 3 retries) | Show retry button                         |

---

## 8. Components Design

### Reusable UI Components

#### Button

- Variants: primary, secondary
- Props:
  - `onClick`
  - `loading`
  - `disabled`

---

#### Spinner

- Centered or inline
- Tailwind animated

---

#### ErrorMessage

- Simple reusable error block

---

## 9. Domain Components

### HouseCard

Displays:

- Image
- Address
- Homeowner
- Price

---

### HouseTable

Responsibilities:

- Render list of houses
- Render infinite scroll sentinel
- Show:
  - Loading state (SKELETON)
  - Retry button (after 3 failures)

---

## 10. UI / Styling Guidelines

### Design Goals

- Minimal
- Clean spacing
- Soft shadows
- Rounded corners (rounded-2xl)

### Tailwind Patterns

- Container:
  - `max-w-5xl mx-auto px-4`

- Cards:
  - `bg-white shadow-md rounded-2xl`

- Typography:
  - Font: **Inter**
  - Headings: `text-xl font-semibold`
  - Body: `text-sm text-gray-600`

---

## 11. Image Handling (IMPORTANT)

Because API is flaky:

- Use:
  - `loading="lazy"`
  - Fallback image on error

- Prevent layout shifts:
  - Fixed height container
  - `object-cover`

---

## 12. Error Handling Strategy

### Levels

#### Network/API Errors

- Retry automatically (3 times)

#### Persistent Failure

- Show:
  - "Failed to load more houses"
  - Retry button

#### Image Errors

- Replace with placeholder image

---

## 13. Performance Considerations

- Memoize components where needed
- Use React Query caching
- Avoid unnecessary re-renders
- Lazy load images

---

## 14. Key Expectations (Interview Signal)

This project should demonstrate:

- Clean architecture
- Reusable components
- Proper async handling
- Real-world resilience (flaky API)
- Thoughtful UX decisions

---

## 15. Extra Notes for Cursor

- Prefer small, composable components
- Avoid monolithic files
- Strong typing everywhere
- Use interfaces for API responses
- Keep business logic in hooks, not components
