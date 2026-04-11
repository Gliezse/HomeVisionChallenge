import axios, { type AxiosError } from 'axios';

const DEFAULT_TIMEOUT_MS = 8_000;

export const HOUSES_API_URL =
  import.meta.env.VITE_API_BASE ??
  'https://staging.homevision.co/api_project/houses';

export class AppApiError extends Error {
  readonly status?: number;
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'AppApiError';
    this.status = status;
    this.code = code;
  }
}

export function toAppApiError(err: unknown): AppApiError {
  if (err instanceof AppApiError) return err;
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<{ message?: string }>;
    const status = ax.response?.status;
    const bodyMsg =
      typeof ax.response?.data === 'object' &&
      ax.response?.data !== null &&
      'message' in ax.response.data &&
      typeof ax.response.data.message === 'string'
        ? ax.response.data.message
        : undefined;
    return new AppApiError(
      bodyMsg ?? ax.message ?? 'Request failed',
      status,
      ax.code,
    );
  }
  if (err instanceof Error) {
    return new AppApiError(err.message);
  }
  return new AppApiError('Unknown error');
}

export const apiClient = axios.create({
  baseURL: '',
  timeout: DEFAULT_TIMEOUT_MS,
  validateStatus: (status) => status >= 200 && status < 300,
});
