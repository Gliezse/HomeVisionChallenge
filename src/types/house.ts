export interface House {
  id: number;
  address: string;
  homeowner: string;
  price: number;
  photoURL: string;
}

/** Raw JSON from GET /houses */
export interface HousesApiResponse {
  houses: House[];
}

export interface HousesPageResult {
  houses: House[];
  /** True when this response had `perPage` items (next page may exist). */
  hasMore: boolean;
  page: number;
}
