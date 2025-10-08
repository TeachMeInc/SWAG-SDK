import { version } from '../package.json';

function getApiRoot (): string {
  if (window.location.href.includes('env=staging')) {
    return import.meta.env.VITE_API_STAGING_URL ?? '';
  }
  if (window.location.href.includes('env=development')) {
    return import.meta.env.VITE_API_DEVELOPMENT_URL ?? '';
  }
  return import.meta.env.VITE_API_URL ?? '';
}

function getDrupalRoot (): string {
  if (
    window.location.href.includes('env=development') ||
    window.location.href.includes('env=staging')
  ) {
    return import.meta.env.VITE_DRUPAL_STAGING_URL ?? '';
  }
  return import.meta.env.VITE_DRUPAL_URL ?? '';
}

export interface Config {
  version: string;
  apiRoot: string;
  drupalRoot: string;
  loaderDelay: number;
}

const config: Config = {
  version,
  apiRoot: getApiRoot(),
  drupalRoot: getDrupalRoot(),
  loaderDelay: Number(import.meta.env.VITE_LOADER_DELAY),
};

export default config;
