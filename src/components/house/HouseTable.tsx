import { useWindowVirtualizer } from "@tanstack/react-virtual";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useInfiniteHouses } from "../../hooks/useInfiniteHouses";
import { Button } from "../ui/Button";
import { ErrorMessage } from "../ui/ErrorMessage";
import { HouseCard } from "./HouseCard";

/** Fixed row height keeps virtualization simple and avoids layout shift. */
const ROW_HEIGHT = 140;

function TableSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading houses">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-[128px] mx-[4px] animate-pulse rounded-2xl bg-white shadow-md ring-1 ring-slate-100"
        >
          <div className="flex h-full gap-4 p-4">
            <div className="h-24 w-36 shrink-0 rounded-xl bg-slate-200" />
            <div className="flex flex-1 flex-col justify-center gap-1">
              <div className="h-[22px] w-2/3 rounded bg-slate-200" />
              <div className="h-[20px] w-1/2 rounded bg-slate-200" />
              <div className="h-[20px] w-1/3 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HouseTable() {
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrollMargin, setScrollMargin] = useState(0);

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

  const virtualizer = useWindowVirtualizer({
    count: houses.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
    scrollMargin,
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
    const header = document.querySelector("[data-site-header]");
    const ro = new ResizeObserver(() => {
      measureScrollMargin();
    });
    if (header) ro.observe(header);
    window.addEventListener("resize", measureScrollMargin);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measureScrollMargin);
    };
  }, [measureScrollMargin]);

  useLayoutEffect(() => {
    measureScrollMargin();
  }, [measureScrollMargin, houses.length, isLoading]);

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
      { root: null, rootMargin: "320px", threshold: 0 },
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
        <TableSkeleton />
      ) : isError && houses.length === 0 ? (
        <ErrorMessage
          title="Failed to load houses"
          message={
            error?.message ?? "The request failed after several retries."
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
            className="relative w-full rounded-2xl bg-slate-50/80 p-2"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
            }}
          >
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const house = houses[virtualRow.index];
              if (!house) return null;
              const margin = virtualizer.options.scrollMargin;
              return (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: ROW_HEIGHT,
                    transform: `translateY(${virtualRow.start - margin}px)`,
                  }}
                >
                  <div className="px-1 pb-2">
                    <HouseCard house={house} />
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
            <TableSkeleton count={3} />
          ) : null}

          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 border-t border-slate-200/80 bg-slate-50/50 px-4 py-4">
            {isFetchNextPageError ? (
              <div className="w-full max-w-md">
                <ErrorMessage
                  title="Failed to load more houses"
                  message="The flaky API did not respond. You can try again manually."
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
