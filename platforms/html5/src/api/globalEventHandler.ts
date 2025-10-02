export enum GlobalEventType {
  API_COMMUNICATION_ERROR = 'API_COMMUNICATION_ERROR',
  ERROR = 'ERROR',
  SESSION_READY = 'SESSION_READY',
  SPLASH_SCREEN_CLICK_PLAY = 'SPLASH_SCREEN_CLICK_PLAY',
  TOOLBAR_CLICK_FULL_SCREEN = 'TOOLBAR_CLICK_FULL_SCREEN',
}

class GlobalEventHandlerAPI {
  protected eventTarget: EventTarget = new EventTarget();

  public addEventListener (
    type: GlobalEventType,
    listener: EventListenerOrEventListenerObject,
  ): void {
    this.eventTarget.addEventListener(type, listener);
  }

  public removeEventListener (
    type: GlobalEventType,
    listener: EventListenerOrEventListenerObject,
  ): void {
    this.eventTarget.removeEventListener(type, listener);
  }

  public dispatchEvent (event: CustomEvent): boolean {
    return this.eventTarget.dispatchEvent(event);
  }
}

export default new GlobalEventHandlerAPI();
