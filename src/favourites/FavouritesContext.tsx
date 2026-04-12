import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  FAVOURITE_HOUSE_IDS_STORAGE_KEY,
  parseFavouriteHouseIds,
  serializeFavouriteHouseIds,
} from './favouriteHouseIdsStorage';
import toast from 'react-hot-toast';

type FavouritesContextValue = {
  isFavourite: (id: number) => boolean;
  toggleFavourite: (id: number) => void;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

type TogglePersistOutcome =
  | { kind: 'success'; wasFavourite: boolean }
  | { kind: 'error' };

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set();
    return parseFavouriteHouseIds(
      localStorage.getItem(FAVOURITE_HOUSE_IDS_STORAGE_KEY),
    );
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key !== FAVOURITE_HOUSE_IDS_STORAGE_KEY ||
        e.storageArea !== localStorage
      ) {
        return;
      }
      setIds(parseFavouriteHouseIds(e.newValue));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // We mutate `outcome` from inside the `setIds` updater, which is not textbook-pure.
  // `toast.*` must run after the updater (not inside it) because it drives external UI state.
  // We still need a functional updater so rapid toggles see the latest `prev`; this pattern
  // captures persist success/failure synchronously, then shows one toast immediately after.
  const toggleFavourite = useCallback((id: number) => {
    const outcome: { current: TogglePersistOutcome | null } = {
      current: null,
    };

    setIds((prev) => {
      const wasFavourite = prev.has(id);
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      try {
        localStorage.setItem(
          FAVOURITE_HOUSE_IDS_STORAGE_KEY,
          serializeFavouriteHouseIds(next),
        );
        outcome.current = { kind: 'success', wasFavourite };
        return next;
      } catch {
        outcome.current = { kind: 'error' };
        return prev;
      }
    });

    const toastId = `favourites-toggle-${id}`;
    const o = outcome.current;
    if (o?.kind === 'error') {
      toast.error(
        "Couldn't save favourites. Storage may be full or unavailable.",
        { id: toastId },
      );
    } else if (o?.kind === 'success') {
      toast.success(
        o.wasFavourite
          ? 'House removed from favourites'
          : 'House added to favourites',
        { id: toastId },
      );
    }
  }, []);

  const isFavourite = useCallback((id: number) => ids.has(id), [ids]);

  const value = useMemo(
    () => ({ isFavourite, toggleFavourite }),
    [isFavourite, toggleFavourite],
  );

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook exported next to Provider
export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }
  return ctx;
}
