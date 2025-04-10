import session from './session';

const mediaBreakpoints = [
  { name: 'phone', value: 400, class:'media-phone' },
  { name: 'phablet', value: 800, class:'media-phablet' },
  { name: 'tablet', value: 1200, class:'media-tablet' },
  { name: 'desktop', value: 1400, class:'media-desktop', default: true }
];

const methods = {
  getBreakpoint: function () {
    const defaultBreakpoint = mediaBreakpoints.find(function (breakpoint) {
      return breakpoint.default;
    });
    const mmatch = mediaBreakpoints.find(function (breakpoint) {
      return session.wrapper!.clientWidth <= breakpoint.value;
    });
    return mmatch || defaultBreakpoint;
  },

  applyBreakpointClass: function () {
    const breakpoint = methods.getBreakpoint();
    if(breakpoint && breakpoint.class) {
      session.wrapper!.dataset.breakpoint = breakpoint.class;
    } else {
      session.wrapper!.dataset.breakpoint = '';
    }
  },

  checkBreakpoint: function (mediaKey: string) {
    const breakpoint = methods.getBreakpoint();
    return breakpoint && (breakpoint.name === mediaKey);
  },

  formatParam: function (param: string | string[]) {
    if(!Array.isArray(param)) {
      return param;
    }
    const formatted = param.map(function (item) {
      return '"' + item + '"';
    }).join('');
    return '[' + formatted + ']';
  },

  toParam: function (source: string) {
    if(source) {
      return source.toLowerCase()
        .replace(/[^a-z0-9-\s]/g, '')
        .replace(/[\s-]+/g, '-');
    } else {
      return '';
    }
  },

  parseUrlParams: function () {
    const vars: Record<string, string> = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (_m: string, key: string, value: string) {
      vars[ key ] = value;
      return '';
    });
    return vars;
  },

  getDate: function (day: string) {
    const parts = day.split('-');
    return new Date(parseInt(parts[ 0 ]), parseInt(parts[ 1 ]) - 1, parseInt(parts[ 2 ]));
  },

  debug: function (message: string, data?: any) {
    if(session.debug) {
      // eslint-disable-next-line no-console
      console.log('SWAG API :::: ' + message);
      if(data) {
        // eslint-disable-next-line no-console
        console.log(data);
      }
    }
  },

  getPlatform: function (): ('embed' | 'app' | 'standalone') {
    // @ts-ignore
    if (typeof window.ReactNativeWebView !== 'undefined') {
      return 'app';
    }
    if (window.self === window.top) {
      return 'standalone';
    }
    return 'embed';
  },

  getTimeZone: function (): string {
    if (
      typeof window === 'undefined' || 
      typeof Intl?.DateTimeFormat !== 'function' || 
      typeof Intl?.DateTimeFormat().resolvedOptions !== 'function'
    ) {
      return import.meta.env.VITE_DEFAULT_TIMEZONE;
    }

    return Intl.DateTimeFormat().resolvedOptions()?.timeZone ?? import.meta.env.VITE_DEFAULT_TIMEZONE;
  },

};

export default methods;
