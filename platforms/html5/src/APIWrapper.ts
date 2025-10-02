import SWAGAPI, { SWAGAPIOptions } from '@/SWAGAPI';

export default class APIWrapper {
  getInstance (options: SWAGAPIOptions) {
    return new SWAGAPI(options);
  }
}
