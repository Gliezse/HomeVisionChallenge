import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchHousesPage } from '../api/houses';
import type { House } from '../types/house';

/** Page size 12: e.g. 4 rows at 3 cols (lg), 6 rows at 2 cols (md), 12 rows at 1 col (mobile). */
const DEFAULT_PER_PAGE = 12;

/** Automatic retries before the list surfaces an error / Retry. */
const RETRY_ATTEMPTS = 3;

export interface UseInfiniteHousesResult {
  houses: House[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  isFetchNextPageError: boolean;
  refetch: () => void;
  /** From React Query: how many times the current query has failed in a row. */
  failureCount: number;
  error: Error | null;
}

export function useInfiniteHouses(
  perPage: number = DEFAULT_PER_PAGE,
): UseInfiniteHousesResult {
  const query = useInfiniteQuery({
    queryKey: ['houses', perPage],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchHousesPage(pageParam, perPage),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    retry: RETRY_ATTEMPTS,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
  });

  const houses = useMemo(
    () => query.data?.pages.flatMap((p) => p.houses) ?? [],
    [query.data?.pages],
  );

  return {
    houses,
    fetchNextPage: () => {
      void query.fetchNextPage();
    },
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    isLoading: query.isLoading,
    isError: query.isError,
    isFetchNextPageError: query.isFetchNextPageError,
    refetch: () => {
      void query.refetch();
    },
    failureCount: query.failureCount,
    error: query.error,
  };
}
