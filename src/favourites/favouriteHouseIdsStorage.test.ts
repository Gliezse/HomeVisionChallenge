import { describe, expect, it } from 'vitest';
import {
  FAVOURITE_HOUSE_IDS_STORAGE_KEY,
  parseFavouriteHouseIds,
  serializeFavouriteHouseIds,
} from './favouriteHouseIdsStorage';

describe('parseFavouriteHouseIds', () => {
  it('returns empty set for null', () => {
    expect(parseFavouriteHouseIds(null).size).toBe(0);
  });

  it('returns empty set for blank string', () => {
    expect(parseFavouriteHouseIds('').size).toBe(0);
    expect(parseFavouriteHouseIds('   ').size).toBe(0);
  });

  it('parses comma-separated ids with optional spaces', () => {
    expect(
      [...parseFavouriteHouseIds('1, 2 ,3')].sort((a, b) => a - b),
    ).toEqual([1, 2, 3]);
  });

  it('skips non-numeric segments', () => {
    expect([...parseFavouriteHouseIds('1,xx,3')]).toEqual([1, 3]);
  });
});

describe('serializeFavouriteHouseIds', () => {
  it('sorts ascending and joins with commas', () => {
    expect(serializeFavouriteHouseIds(new Set([30, 2, 9]))).toBe('2,9,30');
  });

  it('returns empty string for empty set', () => {
    expect(serializeFavouriteHouseIds(new Set())).toBe('');
  });
});

describe('storage key', () => {
  it('is stable', () => {
    expect(FAVOURITE_HOUSE_IDS_STORAGE_KEY).toBe('hv-favourite-house-ids');
  });
});

describe('parse / serialize round-trip', () => {
  it('preserves ids as a set', () => {
    const original = new Set([5, 1, 5, 2]);
    const again = parseFavouriteHouseIds(serializeFavouriteHouseIds(original));
    expect([...again].sort((a, b) => a - b)).toEqual([1, 2, 5]);
  });
});
