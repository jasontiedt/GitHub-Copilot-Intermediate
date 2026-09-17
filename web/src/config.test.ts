import { afterEach, describe, expect, it, vi } from 'vitest';

describe('config', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('defaults to localhost when VITE_API_BASE_URL is not set', async () => {
    const { API_BASE_URL } = await import('./config');
    expect(API_BASE_URL).toBe('http://localhost:8000');
  });

  it('uses VITE_API_BASE_URL when it is set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
    vi.resetModules();
    const { API_BASE_URL } = await import('./config');
    expect(API_BASE_URL).toBe('https://api.example.com');
  });
});
