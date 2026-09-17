import { describe, expect, it } from 'vitest';

describe('config', () => {
  it('defaults to localhost when VITE_API_BASE_URL is not set', async () => {
    const { API_BASE_URL } = await import('./config');
    expect(API_BASE_URL).toBe('http://localhost:8000');
  });
});
