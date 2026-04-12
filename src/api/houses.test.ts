import { describe, expect, it, vi, beforeEach } from 'vitest';

const getMock = vi.hoisted(() => vi.fn());

vi.mock('./client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./client')>();
  return {
    ...mod,
    apiClient: { get: getMock },
  };
});

import { AppApiError } from './client';
import { fetchHousesPage } from './houses';

const house = (id: number) => ({
  id,
  address: '',
  homeowner: '',
  price: 0,
  photoURL: '',
});

beforeEach(() => {
  getMock.mockReset();
});

describe('fetchHousesPage', () => {
  it('returns houses array and hasMore when length equals perPage', async () => {
    const houses = [house(1), house(2)];
    getMock.mockResolvedValue({ data: { houses } });
    const result = await fetchHousesPage(3, 2);
    expect(result).toEqual({ houses, hasMore: true, page: 3 });
    expect(getMock).toHaveBeenCalledWith(expect.any(String), {
      params: { page: 3, per_page: 2 },
    });
  });

  it('sets hasMore false when fewer than perPage', async () => {
    getMock.mockResolvedValue({ data: { houses: [house(1)] } });
    const result = await fetchHousesPage(1, 12);
    expect(result.hasMore).toBe(false);
  });

  it('uses empty array when houses is not an array', async () => {
    getMock.mockResolvedValue({ data: { houses: null } });
    const result = await fetchHousesPage(1, 12);
    expect(result.houses).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  it('wraps rejection with AppApiError', async () => {
    getMock.mockRejectedValue(new Error('network'));
    await expect(fetchHousesPage(1, 12)).rejects.toBeInstanceOf(AppApiError);
  });
});
