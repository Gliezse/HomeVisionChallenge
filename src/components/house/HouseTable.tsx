import { useWindowVirtualizer, measureElement } from '@tanstack/react-virtual';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  useState,
} from 'react';
import { useInfiniteHouses } from '../../hooks/useInfiniteHouses';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import { HouseCard } from './HouseCard';

const MD_QUERY = '(min-width: 768px)';
const LG_QUERY = '(min-width: 1024px)';

/** Guessed row height before ResizeObserver (square card + copy; varies by column count). */
const ROW_ESTIMATE_1_COL = 580;
const ROW_ESTIMATE_2_COL = 520;
const ROW_ESTIMATE_3_COL = 400;

function subscribeLayoutColumns(cb: () => void) {
  const mqMd = window.matchMedia(MD_QUERY);
  const mqLg = window.matchMedia(LG_QUERY);
  mqMd.addEventListener('change', cb);
  mqLg.addEventListener('change', cb);
  return () => {
    mqMd.removeEventListener('change', cb);
    mqLg.removeEventListener('change', cb);
  };
}

function getItemsPerRowSnapshot(): number {
  const md = window.matchMedia(MD_QUERY).matches;
  const lg = window.matchMedia(LG_QUERY).matches;
  if (lg) return 3;
  if (md) return 2;
  return 1;
}

function getItemsPerRowServerSnapshot() {
  return 1;
}

function useItemsPerRow() {
  return useSyncExternalStore(
    subscribeLayoutColumns,
    getItemsPerRowSnapshot,
    getItemsPerRowServerSnapshot,
  );
}

const GRID_ROW_CLASS =
  'grid grid-cols-1 gap-6 pb-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8';

function SkeletonCard() {
  return (
    <div className="flex h-full min-h-0 animate-pulse flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-100">
      <div className="aspect-square w-full shrink-0 rounded-xl bg-[var(--base--light-gray)]" />
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
        <div className="h-5 w-4/5 rounded bg-[var(--base--light-gray)] sm:h-6" />
        <div className="h-4 w-3/5 rounded bg-[var(--base--light-gray)] sm:h-5" />
        <div className="h-7 w-1/2 rounded bg-[var(--base--light-gray)] sm:h-8" />
      </div>
    </div>
  );
}

function TableSkeleton({ cards = 12 }: { cards?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8"
      aria-busy="true"
      aria-label="Loading houses"
    >
      {Array.from({ length: cards }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function HouseTable() {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const itemsPerRow = useItemsPerRow();

  const {
    houses,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetchNextPageError,
    refetch,
    error,
  } = useInfiniteHouses();

  const rowCount = useMemo(
    () => (houses.length === 0 ? 0 : Math.ceil(houses.length / itemsPerRow)),
    [houses.length, itemsPerRow],
  );

  const rowEstimate =
    itemsPerRow === 3
      ? ROW_ESTIMATE_3_COL
      : itemsPerRow === 2
        ? ROW_ESTIMATE_2_COL
        : ROW_ESTIMATE_1_COL;

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => rowEstimate,
    overscan: 6,
    scrollMargin,
    measureElement,
    useFlushSync: false,
  });

  const measureScrollMargin = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    setScrollMargin(Math.round(top));
  }, []);

  useLayoutEffect(() => {
    measureScrollMargin();
    const header = document.querySelector('[data-site-header]');
    const ro = new ResizeObserver(() => {
      measureScrollMargin();
    });
    if (header) ro.observe(header);
    window.addEventListener('resize', measureScrollMargin);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureScrollMargin);
    };
  }, [measureScrollMargin]);

  useLayoutEffect(() => {
    measureScrollMargin();
  }, [measureScrollMargin, houses.length, isLoading, rowCount]);

  useLayoutEffect(() => {
    virtualizer.measure();
  }, [itemsPerRow, virtualizer]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || houses.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        if (!hasNextPage || isFetchingNextPage) return;
        if (isFetchNextPageError) return;
        fetchNextPage();
      },
      { root: null, rootMargin: '720px', threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [
    houses.length,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    fetchNextPage,
  ]);

  return (
    <div ref={listRef} className="w-full">
      {isLoading && houses.length === 0 ? (
        <TableSkeleton cards={12} />
      ) : isError && houses.length === 0 ? (
        <ErrorMessage
          title="Failed to load houses"
          message={
            error?.message ?? 'The request failed after several retries.'
          }
        >
          <Button type="button" variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </ErrorMessage>
      ) : !isLoading && houses.length === 0 && !isError ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-600 shadow-md ring-1 ring-slate-100">
          No houses to display.
        </p>
      ) : (
        <>
          <div
            className="relative w-full"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const margin = virtualizer.options.scrollMargin;
              const startIdx = virtualRow.index * itemsPerRow;
              const rowHouses = houses.slice(startIdx, startIdx + itemsPerRow);
              if (rowHouses.length === 0) return null;

              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  className="absolute left-0 top-0 w-full"
                  style={{
                    transform: `translateY(${virtualRow.start - margin}px)`,
                  }}
                >
                  <div className={GRID_ROW_CLASS}>
                    {rowHouses.map((house) => (
                      <HouseCard key={house.id} house={house} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {hasNextPage && (
            <div
              ref={sentinelRef}
              className="h-0 w-full shrink-0"
              aria-hidden
            />
          )}

          {isFetchingNextPage && !isFetchNextPageError ? (
            <div className="mt-2">
              <TableSkeleton cards={6} />
            </div>
          ) : null}

          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 border-t border-slate-200/80 bg-slate-50/50 px-4 py-4">
            {isFetchNextPageError ? (
              <div className="w-full max-w-md">
                <ErrorMessage
                  title="Failed to load more houses"
                  message="We couldn’t load more homes. Please try again."
                >
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => fetchNextPage()}
                  >
                    Retry
                  </Button>
                </ErrorMessage>
              </div>
            ) : null}

            {!hasNextPage && (
              <p className="text-center text-xs text-gray-500">End of list</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
