interface ImportMetaEnv {
  VITE_API_STAGING_URL?: string;
  VITE_API_DEVELOPMENT_URL?: string;
  VITE_API_URL?: string;
  VITE_DEFAULT_TIMEZONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
