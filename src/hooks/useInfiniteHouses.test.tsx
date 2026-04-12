import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInfiniteHouses } from './useInfiniteHouses';

const fetchMock = vi.hoisted(() => vi.fn());

vi.mock('../api/houses', () => ({
  fetchHousesPage: (page: number, perPage: number) => fetchMock(page, perPage),
}));

const house = (id: number) => ({
  id,
  address: '',
  homeowner: '',
  price: 0,
  photoURL: '',
});

describe('useInfiniteHouses', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    fetchMock.mockReset();
  });

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  it('fetches first page and flattens houses', async () => {
    fetchMock.mockResolvedValue({
      houses: [house(1)],
      hasMore: false,
      page: 1,
    });

    const { result } = renderHook(() => useInfiniteHouses(12), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(1, 12);
    expect(result.current.houses).toEqual([house(1)]);
    expect(result.current.hasNextPage).toBe(false);
  });

  it('appends next page when fetchNextPage runs', async () => {
    fetchMock
      .mockResolvedValueOnce({
        houses: [house(1), house(2)],
        hasMore: true,
        page: 1,
      })
      .mockResolvedValueOnce({
        houses: [house(3)],
        hasMore: false,
        page: 2,
      });

    const { result } = renderHook(() => useInfiniteHouses(2), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasNextPage).toBe(true);

    act(() => result.current.fetchNextPage());

    await waitFor(() => expect(result.current.isFetchingNextPage).toBe(false));

    expect(fetchMock).toHaveBeenNthCalledWith(1, 1, 2);
    expect(fetchMock).toHaveBeenNthCalledWith(2, 2, 2);
    expect(result.current.houses.map((h) => h.id)).toEqual([1, 2, 3]);
  });
});
