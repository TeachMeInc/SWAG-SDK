interface ImportMetaEnv {
  VITE_API_STAGING_URL?: string;
  VITE_API_DEVELOPMENT_URL?: string;
  VITE_API_URL?: string;
  VITE_DRUPAL_STAGING_URL?: string;
  VITE_DRUPAL_URL?: string;
  VITE_DEFAULT_TIMEZONE?: string;
  // Add other VITE_ variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
