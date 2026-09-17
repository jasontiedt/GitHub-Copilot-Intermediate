// Single source of truth for runtime configuration.
// Override by setting VITE_API_BASE_URL in a .env file (see Vite env docs).
export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
