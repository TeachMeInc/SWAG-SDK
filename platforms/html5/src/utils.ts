import { DateString } from '@/types/DateString';
import session from './session';

const methods = {



  // #region URL Methods 

  formatParam (param: string | string[]) {
    if (!Array.isArray(param)) {
      return param;
    }
    const formatted = param.map((item) => `"${item}"`).join('');
    return `[${formatted}]`;
  },

  parseUrlParams () {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  },

  parseUrlOptions (prop?: string) {
    const url = new URL(window.location.href);
    const params = Object.fromEntries(url.searchParams.entries());
    return prop ? params[ prop ] : params;
  },

  getDateString (): DateString {
    const { date: dateParam } = methods.parseUrlParams();

    if (dateParam) {
      const results = dateParam.split('-'); 
      let [ year ] = results;
      const [ month, day ] = results;
      if (year.length === 2) year = `20${year}`;

      return `${year}-${month}-${day}` as DateString;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}` as DateString;
  },

  getDateStringFromDate (date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}` as DateString;
  },

  getDateFromDateString (dateStr: DateString) {
    const [ year, month, day ] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  },

  // #endregion 



  // #region Platform Methods 

  getPlatform (): 'embed' | 'app' | 'standalone' {
    // @ts-ignore
    if (typeof window.ReactNativeWebView !== 'undefined') {
      return 'app';
    }
    if (window.self === window.top) {
      return 'standalone';
    }
    return 'embed';
  },

  getPlatformTheme (): 'light' | 'dark' {
    const theme = this.parseUrlOptions('theme');
    if (theme) {
      return theme === 'dark' ? 'dark' : 'light';
    }
    if (this.getPlatform() === 'standalone') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemTheme ? 'dark' : 'light';
    }
    return 'light';
  },

  getTimeZone (): string {
    if (
      typeof window === 'undefined' ||
      typeof Intl?.DateTimeFormat !== 'function' ||
      typeof Intl?.DateTimeFormat().resolvedOptions !== 'function'
    ) {
      return import.meta.env.VITE_DEFAULT_TIMEZONE;
    }

    return (
      Intl.DateTimeFormat().resolvedOptions()?.timeZone 
      ?? import.meta.env.VITE_DEFAULT_TIMEZONE
    );
  },

  // #endregion 



  // #region UI Methods 

  parseLottie (lottie: object, value: string | number): object {
    let stringifyLottie = '';
    try {
      stringifyLottie = JSON.stringify(lottie).replace(/0123456789:%\./g, value.toString());
    } catch (e) {
      this.debug('Error stringifying Lottie animation', e);
      return {};
    }
    try {
      return JSON.parse(stringifyLottie);
    } catch (e) {
      this.debug('Error parsing Lottie animation', e);
      return {};
    }
  },

  // #endregion 



  // #region Logging Methods 

  log (...args: any[]) {
    // eslint-disable-next-line no-console
    console.log('[SWAG]', ...args);
  },

  error (...args: any[]) {
    if (session.debug) {
      // eslint-disable-next-line no-console
      console.error('[SWAG error]', ...args);
    }
  },

  warn (...args: any[]) {
    if (session.debug) {
      // eslint-disable-next-line no-console
      console.warn('[SWAG debug]', ...args);
    }
  },

  debug (...args: any[]) {
    if (session.debug) {
      // eslint-disable-next-line no-console
      console.log('[SWAG debug]', ...args);
    }
  },

  // #endregion 



};

export default methods;
