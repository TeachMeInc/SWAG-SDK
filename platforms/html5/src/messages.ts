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
  onClick?: () => void;
};

export interface ToolbarState {
  items: ToolbarItem[];
};

export interface ToolbarStateAction {
  type: ToolbarStateActionType
  payload: any
};

enum ToolbarStateActionType {
  SET_ITEMS,
  ADD_OR_UPDATE_ITEM,
  REMOVE_ITEM,
};

// #endregion



type MessageEventName = 
  'swag.toolbar.setItems' |
  'swag.toolbar.updateItem' |
  'swag.toolbar.removeItem' |
  'swag.toolbar.click' |
  'swag.toggleFullScreen' |
  'swag.navigateToArchive' |
  'swag.navigateToLogin' |
  'swag.navigateToTitle' | 
  'swag.displayAd' |
  'swag.displayShareDialog' |
  'swag.userLogout';

interface MessagePayload {
  eventName: MessageEventName;
  message: string;
}

class MessagesAPI {
  trySendMessage (eventName: MessageEventName, message: string = '', timeout: number = 1000) {
    if (this.currentMessageRequests.includes(eventName)) {
      return Promise.reject(new Error(`Failed to send message for event ${eventName}. Reason: Already in progress`));
    }
    this.currentMessageRequests.push(eventName);

    window.parent.postMessage(
      JSON.stringify({ eventName, message }),
      '*',
    );

    return new Promise<void>((resolve, reject) => {
      const completeRequest = () => {
        this.currentMessageRequests.splice(this.currentMessageRequests.indexOf(eventName), 1);
        window.removeEventListener('message', eventListener);
      };

      const timeoutRef = setTimeout(() => {
        completeRequest();
        reject(new Error(`Failed to send message for event ${eventName}. Reason: Timeout`));
      }, timeout);

      const eventListener = (event: { data: string }) => {
        const parsed = tryParse<MessagePayload>(event.data);
        if (!parsed) return;

        if (parsed.eventName === `${eventName}.ack`) {
          clearTimeout(timeoutRef);
        }
        else if (parsed.eventName === `${eventName}.success`) {
          clearTimeout(timeoutRef);
          completeRequest();
          resolve();
        }
        else if (parsed.eventName === `${eventName}.error`) {
          clearTimeout(timeoutRef);
          completeRequest();
          reject(new Error(`Failed to send message for event ${eventName}. Reason: ${parsed.message}`));
        }
      };

      window.addEventListener('message', eventListener);
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

  setToolbarItems (items: Record<string, ToolbarItem>) {
    this.toolbarClickEvents = {};
    for (const [ id, item ] of Object.entries(items)) {
      if (item.onClick) this.toolbarClickEvents[ id ] = item.onClick;
      delete item.onClick;
    }
    return this.trySendMessage('swag.toolbar.setItems', JSON.stringify(Object.values(items)));
  }

  updateToolbarItem (item: ToolbarItem) {
    if (item.onClick) this.toolbarClickEvents[ item.id ] = item.onClick;
    delete item.onClick;
    return this.trySendMessage('swag.toolbar.updateItem', JSON.stringify(item));
  }

  removeToolbarItem (id: string) {
    delete this.toolbarClickEvents[ id ];
    return this.trySendMessage('swag.toolbar.removeItem', id);
  }
}

export default new MessagesAPI();
