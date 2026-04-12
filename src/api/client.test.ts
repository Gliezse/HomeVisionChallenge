import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';
import { AppApiError, toAppApiError } from './client';

function axiosError(
  partial: Partial<AxiosError<{ message?: string }>>,
): AxiosError {
  const err = new AxiosError(
    partial.message ?? 'axios message',
    partial.code,
    partial.config,
    partial.request,
    partial.response,
  );
  return err;
}

describe('toAppApiError', () => {
  it('returns same instance for AppApiError', () => {
    const e = new AppApiError('x', 400);
    expect(toAppApiError(e)).toBe(e);
  });

  it('uses response body message when present', () => {
    const err = axiosError({
      message: 'ignored',
      response: {
        status: 422,
        data: { message: 'from body' },
        statusText: '',
        headers: {},
        config: {} as AxiosError['config'],
      },
    });
    const out = toAppApiError(err);
    expect(out).toBeInstanceOf(AppApiError);
    expect(out.message).toBe('from body');
    expect(out.status).toBe(422);
  });

  it('falls back to axios message when body has no string message', () => {
    const err = axiosError({
      message: 'fallback',
      response: {
        status: 500,
        data: {},
        statusText: '',
        headers: {},
        config: {} as AxiosError['config'],
      },
    });
    expect(toAppApiError(err).message).toBe('fallback');
  });

  it('maps generic Error', () => {
    const out = toAppApiError(new Error('plain'));
    expect(out.message).toBe('plain');
    expect(out.status).toBeUndefined();
  });

  it('maps unknown to Unknown error', () => {
    expect(toAppApiError(null).message).toBe('Unknown error');
  });
});
