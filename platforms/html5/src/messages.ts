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



// #region Toolbar Data Structures

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ToolbarState {
  items: ToolbarItem[];
}

export interface ToolbarStateAction {
  type: ToolbarStateActionType
  payload: any
}

export enum ToolbarStateActionType {
  SET_ITEMS,
  ADD_OR_UPDATE_ITEM,
  REMOVE_ITEM,
}

// #endregion



export type MessageEventName = 
  'swag.toolbar.setItems' |
  'swag.toolbar.updateItem' |
  'swag.toolbar.removeItem' |
  'swag.toolbar.click' |
  'swag.toggleFullScreen' |
  'swag.navigateToArchive' |
  'swag.navigateToGameLanding' |
  'swag.navigateToLogin' |
  'swag.navigateToTitle' | 
  'swag.displayAd' |
  'swag.displayShareDialog' |
  'swag.userLogout' |
  'swag.getRelatedGames' |
  'swag.captureEvent' | 
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
  ) {
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

      switch (parsed.eventName) {
      case 'swag.toolbar.click': {
        const id = parsed.message;
        if (this.toolbarClickEvents[ id ]) {
          this.toolbarClickEvents[ id ]();
        }
        return;
      }
      }
    });
  }

  setToolbarItems (items: ToolbarItem[]) {
    this.toolbarClickEvents = {};
    items.forEach(item => {
      if (item.onClick) {
        this.toolbarClickEvents[ item.id ] = item.onClick;
        item.onClick = true as any;
      }
    });
    return this.trySendMessage(
      'swag.toolbar.setItems', 
      JSON.stringify(Object.values(items)),
      true
    );
  }

  updateToolbarItem (item: ToolbarItem) {
    if (item.onClick) {
      this.toolbarClickEvents[ item.id ] = item.onClick;
      item.onClick = true as any;
    }
    return this.trySendMessage(
      'swag.toolbar.updateItem', 
      JSON.stringify(item),
      true
    );
  }

  removeToolbarItem (id: string) {
    if (this.toolbarClickEvents[ id ]) delete this.toolbarClickEvents[ id ];
    return this.trySendMessage(
      'swag.toolbar.removeItem', 
      id, 
      true
    );
  }
}

export default new MessagesAPI();
