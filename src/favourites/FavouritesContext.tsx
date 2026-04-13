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

type PendingToggle = {
  id: number;
  wasFavourite: boolean;
  prevIds: Set<number>;
  nextIds: Set<number>;
};

type FavouritesState = {
  /** In-memory source of truth used by consumers. */
  ids: Set<number>;
  /** FIFO queue of optimistic toggles waiting to persist. */
  pending: PendingToggle[];
};

function createInitialState(): FavouritesState {
  if (typeof window === 'undefined') {
    return { ids: new Set(), pending: [] };
  }
  return {
    ids: parseFavouriteHouseIds(
      localStorage.getItem(FAVOURITE_HOUSE_IDS_STORAGE_KEY),
    ),
    pending: [],
  };
}

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FavouritesState>(createInitialState);
  const { ids, pending } = state;

  useEffect(() => {
    /** Keep this tab in sync when another tab updates favourites. */
    const onStorage = (e: StorageEvent) => {
      if (
        e.key !== FAVOURITE_HOUSE_IDS_STORAGE_KEY ||
        e.storageArea !== localStorage
      ) {
        return;
      }
      setState({
        ids: parseFavouriteHouseIds(e.newValue),
        pending: [],
      });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleFavourite = useCallback((id: number) => {
    /** Pure optimistic update: compute next ids + enqueue persist task. */
    setState((prevState) => {
      const prevIds = prevState.ids;
      const wasFavourite = prevIds.has(id);
      const nextIds = new Set(prevIds);
      if (wasFavourite) nextIds.delete(id);
      else nextIds.add(id);
      return {
        ids: nextIds,
        pending: [...prevState.pending, { id, wasFavourite, prevIds, nextIds }],
      };
    });
  }, []);

  useEffect(() => {
    /** Persist one queued toggle at a time, then dequeue. */
    const first = pending[0];
    if (!first) return;

    const toastId = `favourites-toggle-${first.id}`;
    let outcome: TogglePersistOutcome;
    try {
      localStorage.setItem(
        FAVOURITE_HOUSE_IDS_STORAGE_KEY,
        serializeFavouriteHouseIds(first.nextIds),
      );
      outcome = { kind: 'success', wasFavourite: first.wasFavourite };
      setState((prevState) => ({
        ids: prevState.ids,
        pending: prevState.pending.slice(1),
      }));
    } catch {
      outcome = { kind: 'error' };
      /** Roll back optimistic state if persistence fails. */
      setState((prevState) => {
        const currentFirst = prevState.pending[0];
        if (!currentFirst) return prevState;
        return {
          ids: currentFirst.prevIds,
          pending: [],
        };
      });
    }

    if (outcome.kind === 'error') {
      toast.error(
        "Couldn't save favourites. Storage may be full or unavailable.",
        { id: toastId },
      );
      return;
    }

    toast.success(
      outcome.wasFavourite
        ? 'House removed from favourites'
        : 'House added to favourites',
      { id: toastId },
    );
  }, [pending]);

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
