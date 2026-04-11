import { apiClient, HOUSES_API_URL, toAppApiError } from './client';
import type { HousesApiResponse, HousesPageResult } from '../types/house';

export async function fetchHousesPage(
  page: number,
  perPage: number,
): Promise<HousesPageResult> {
  try {
    const { data } = await apiClient.get<HousesApiResponse>(HOUSES_API_URL, {
      params: { page, per_page: perPage },
    });
    const houses = Array.isArray(data.houses) ? data.houses : [];
    const hasMore = houses.length === perPage;
    return { houses, hasMore, page };
  } catch (err) {
    throw toAppApiError(err);
  }
}
