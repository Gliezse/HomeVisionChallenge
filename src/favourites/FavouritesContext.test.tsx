import React from 'react';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  FAVOURITE_HOUSE_IDS_STORAGE_KEY,
  serializeFavouriteHouseIds,
} from './favouriteHouseIdsStorage';
import { FavouritesProvider, useFavourites } from './FavouritesContext';

function wrapper({ children }: { children: ReactNode }) {
  return <FavouritesProvider>{children}</FavouritesProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('useFavourites', () => {
  it('throws without provider', () => {
    expect(() => {
      renderHook(() => useFavourites());
    }).toThrow('useFavourites must be used within FavouritesProvider');
  });

  it('hydrates from localStorage on mount', () => {
    localStorage.setItem(FAVOURITE_HOUSE_IDS_STORAGE_KEY, '10, 20');
    const { result } = renderHook(() => useFavourites(), { wrapper });
    expect(result.current.isFavourite(10)).toBe(true);
    expect(result.current.isFavourite(20)).toBe(true);
  });

  it('persists toggled ids with storage key and serialized value', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useFavourites(), { wrapper });

    act(() => result.current.toggleFavourite(5));

    expect(setItem).toHaveBeenCalledWith(
      FAVOURITE_HOUSE_IDS_STORAGE_KEY,
      serializeFavouriteHouseIds(new Set([5])),
    );
    setItem.mockRestore();
  });

  it('applies storage event for same key and localStorage', () => {
    const { result } = renderHook(() => useFavourites(), { wrapper });

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: FAVOURITE_HOUSE_IDS_STORAGE_KEY,
          newValue: '7',
          storageArea: localStorage,
        }),
      );
    });

    expect(result.current.isFavourite(7)).toBe(true);
  });

  it('ignores storage event when key differs', () => {
    const { result } = renderHook(() => useFavourites(), { wrapper });
    act(() => result.current.toggleFavourite(1));

    act(() => {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'other',
          newValue: '',
          storageArea: localStorage,
        }),
      );
    });

    expect(result.current.isFavourite(1)).toBe(true);
  });
});
