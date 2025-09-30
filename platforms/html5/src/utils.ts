import { DateString } from '@/types/DateString';
import session from './session';
import globalEventHandlerApi, { GlobalEventType } from '@/api/globalEventHandler';

const methods = {



  // #region URL Methods 

  formatParam (param: string | string[]) {
    if (!Array.isArray(param)) {
      return param;
    }
    const formatted = param.map((item) => `'${item}'`).join('');
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

  isMobileDevice () {
    const platform = this.getPlatform();
    if (platform === 'app') return true;
    
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];
    const isMobileUA = toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
    if (isMobileUA) return true;

    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch) return true;

    return false;
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

  setOsThemeColor (color: string) {
    let meta = document.querySelector('meta[name=\'theme-color\']');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  },

  getCssVariableValue: function (variableName: string, output: 'string' | 'number' = 'string') {
    const computedStyles = window.getComputedStyle(document.documentElement);
    const value = computedStyles.getPropertyValue(variableName);

    if (output === 'number') {
      const numericValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    }

    return value;
  },

  getToolbarHeight: function (): Promise<number> {
    return new Promise((resolve) => {
      // First try to get from CSS variable
      const headerHeight = this.getCssVariableValue('--swag-toolbar-height', 'number') as number;
      if (headerHeight && headerHeight !== 48) { // 48 is the default value
        resolve(headerHeight);
        return;
      }

      // Then try to get from DOM
      window.requestAnimationFrame(() => {
        const header = document.querySelector('.swag-toolbar');
        if (!header) {
          resolve(48); // default header height
          return;
        }
        
        const bRect = header.getBoundingClientRect();
        if (!bRect.height) {
          resolve(48); // default header height
          return;
        }

        resolve(bRect.height);
      });
    });
  },

  sendBeacon (callback: () => { url: string, payload: Record<string, any> }) {
    let sent = false;

    const sendOnce = () => {
      if (sent) return;
      sent = true;

      const { url, payload } = callback();

      // Prefer sendBeacon for reliability during unload
      const beaconPayload = new Blob([ JSON.stringify(payload) ], { type: 'application/json' });
      const ok = navigator.sendBeacon(url, beaconPayload);

      // Fallback if sendBeacon missing or returns false
      if (!ok) {
        try {
          fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' },
            keepalive: true
          });
        } catch (err: any) {
          this.error('Error sending data', err);
        }
      }
    };

    // Fire on any pagehide, including bfcache (back/forward navigation)
    const pageHideHandler = () => {
      sendOnce();
    };
    window.addEventListener('pagehide', pageHideHandler, { capture: true });

    // Extremely old fallback
    const beforeUnloadHandler = () => {
      sendOnce();
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      sent = true;
      window.removeEventListener('pagehide', pageHideHandler, { capture: true });
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  },

  // #endregion 



  // #region Logging Methods 

  log (...args: any[]) {
    // eslint-disable-next-line no-console
    console.log('[SWAG]', ...args);
  },

  error (...args: any[]) {
    globalEventHandlerApi.dispatchEvent(new CustomEvent(GlobalEventType.ERROR, { detail: args }));
    // eslint-disable-next-line no-console
    console.error('[SWAG error]', ...args);
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
