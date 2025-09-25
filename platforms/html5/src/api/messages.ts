import utils from '@/utils';



// #region Utility Functions

function tryParse <T> (data: string): T | undefined {
  let parsed: MessagePayload;

  try {
    parsed = JSON.parse(data);
  } catch (err) {
    return;
  }

  return parsed as T;
}

// #endregion



export type MessageEventName = 
  'noop' |
  'swag.toolbar.show' |
  'swag.toolbar.hide' |
  'swag.toggleFullScreen' |
  'swag.navigateToArchive' |
  'swag.navigateToGameLanding' |
  'swag.navigateToTitle' | 
  'swag.dailyGameProgress.start' |
  'swag.dailyGameProgress.complete';

export interface MessagePayload {
  eventName: MessageEventName;
  message: string;
}

class MessagesAPI {
  trySendMessage (
    eventName: MessageEventName, 
    message: string = '', 
    ignoreResponse: boolean = false
  ): Promise<MessagePayload> {
    if (!window.parent || window.parent === window) {
      utils.warn(`Failed to send message for event ${eventName}. Reason: No parent window`);
      return Promise.resolve({ eventName: 'noop', message: '' });
    }

    if (!ignoreResponse) {
      if (this.currentMessageRequests.includes(eventName)) {
        return Promise.reject(new Error(`Failed to send message for event ${eventName}. Reason: Already in progress`));
      }
      this.currentMessageRequests.push(eventName);
    }

    if (ignoreResponse) {
      window.parent.postMessage(
        JSON.stringify({ eventName, message }),
        '*',
      );

      return new Promise<MessagePayload>((resolve) => resolve);
    }

    return new Promise<MessagePayload>((resolve, reject) => {
      const completeRequest = () => {
        this.currentMessageRequests.splice(this.currentMessageRequests.indexOf(eventName), 1);
        window.removeEventListener('message', eventListener);
      };

      const timeoutRef = setTimeout(() => {
        completeRequest();
        reject(new Error(`Failed to send message for event ${eventName}. Reason: Timeout`));
      }, 100);

      const eventListener = (event: { data: string }) => {
        const parsed = tryParse<MessagePayload>(event.data);
        if (!parsed) return;

        if (parsed.eventName === `${eventName}.ack`) {
          clearTimeout(timeoutRef);
        }
        else if (parsed.eventName === `${eventName}.success`) {
          clearTimeout(timeoutRef);
          completeRequest();
          resolve(parsed);
        }
        else if (parsed.eventName === `${eventName}.error`) {
          clearTimeout(timeoutRef);
          completeRequest();
          reject(new Error(`Failed to send message for event ${eventName}. Reason: ${parsed.message}`));
        }
      };

      window.addEventListener('message', eventListener);

      window.parent.postMessage(
        JSON.stringify({ eventName, message }),
        '*',
      );
    });
  }

  currentMessageRequests: string[] = [];
  toolbarClickEvents: Record<string, () => void> = {};

  constructor () {
    window.addEventListener('message', (event: { data: string }) => {
      const parsed = tryParse<MessagePayload>(event.data);
      if (!parsed) return;
    });
  }
}

export default new MessagesAPI();
