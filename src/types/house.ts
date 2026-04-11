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
  /** Whether another page may exist (derived when API omits explicit flag). */
  hasMore: boolean;
  page: number;
}
