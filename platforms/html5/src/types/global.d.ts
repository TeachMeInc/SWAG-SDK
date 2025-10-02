import type APIWrapper from '../APIWrapper';

declare global {
  interface Window {
    SWAGAPI: APIWrapper;
  }
}
