import { JSXInternal } from 'node_modules/preact/src/jsx';
import { render } from 'preact';

export default class UserInterfaceAPI {
  protected rootElId: string = '';
  protected rootElClassName: string = '';
  protected isInjected: boolean = false;
  private timeout: number | null = null;

  setRootElId (id: string) {
    this.rootElId = id;
    this.isInjected = true;
  }

  getRootElId () {
    return this.rootElId;
  }

  protected getRootEl () {
    const el = document.getElementById(this.rootElId);
    if (el) return el;

    const newRootEl = document.createElement('div');
    newRootEl.setAttribute('id', this.rootElId);
    newRootEl.classList.add(this.rootElClassName);
    
    document.body.appendChild(newRootEl);
    
    return newRootEl;
  }

  protected onMount () { }

  protected mount (component: JSXInternal.Element, debounce?: number) {
    const doMount = () => {
      render(component, this.getRootEl());
      this.onMount();
    };

    if (debounce) {
      clearTimeout(this.timeout!);
      this.timeout = setTimeout(doMount, debounce);
    } else {
      doMount();
    }
  }

  async show (..._args: any[]) {
    throw new Error('show method must be implemented in subclass.');
  }

  protected onUnmount () { }

  protected unmount () {
    clearTimeout(this.timeout!);

    render(null, this.getRootEl());

    const parent = this.getRootEl().parentElement;
    if (parent) parent.removeChild(this.getRootEl());

    this.onUnmount();
  }

  async hide () {
    this.unmount();
  }
}
