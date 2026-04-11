/** Comma-separated numeric house ids in `localStorage`, e.g. `"12,34,56"`. */
export const FAVOURITE_HOUSE_IDS_STORAGE_KEY = 'hv-favourite-house-ids';

export function parseFavouriteHouseIds(raw: string | null): Set<number> {
  if (raw == null || raw.trim() === '') return new Set();
  const out = new Set<number>();
  for (const part of raw.split(',')) {
    const id = Number.parseInt(part.trim(), 10);
    if (!Number.isNaN(id)) out.add(id);
  }
  return out;
}

export function serializeFavouriteHouseIds(ids: Set<number>): string {
  return [...ids].sort((a, b) => a - b).join(',');
}
