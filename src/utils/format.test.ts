import { describe, expect, it } from 'vitest';
import { formatPriceUSD } from './format';

describe('formatPriceUSD', () => {
  it('formats with USD symbol and no fraction digits', () => {
    expect(formatPriceUSD(0)).toBe('$0');
    expect(formatPriceUSD(1_234_567)).toBe('$1,234,567');
  });
});
