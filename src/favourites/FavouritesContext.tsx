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

type FavouritesContextValue = {
  isFavourite: (id: number) => boolean;
  toggleFavourite: (id: number) => void;
};

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

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

  const toggleFavourite = useCallback((id: number) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(
        FAVOURITE_HOUSE_IDS_STORAGE_KEY,
        serializeFavouriteHouseIds(next),
      );
      return next;
    });
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

/** Colocated with provider so context stays private to this module. */
// eslint-disable-next-line react-refresh/only-export-components -- hook paired with Provider
export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }
  return ctx;
}
