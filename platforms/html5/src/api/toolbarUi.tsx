import messages from '@/api/messages';
import { ToolbarEventName, ToolbarItem, ToolbarState } from '@/components/features/toolbar/toolbarState';
import { Toolbar } from '@/components/features/toolbar/Toolbar';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import utils from '@/utils';
import globalEventHandler, { GlobalEventType } from '@/api/globalEventHandler';

class ToolbarUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-toolbar-root';
  protected rootElClassName: string = 'swag-toolbar-root';

  async show (options: {
    titleIcon?: string;
    titleIconDark?: string;
    initialToolbarState?: ToolbarState;
    onClickFullScreen?: () => void;
  }) {
    let onClickFullScreen: (() => void) | undefined = undefined;

    // Embeded on Shockwave.com
    if (utils.getPlatform() === 'embed') {
      onClickFullScreen = () => {
        globalEventHandler.dispatchEvent(new CustomEvent(GlobalEventType.TOOLBAR_CLICK_FULL_SCREEN));
        messages.trySendMessage('swag.toggleFullScreen', '', true);
      };
    }
    
    this.mount(<Toolbar
      date={utils.getDateString()}
      titleIcon={options.titleIcon}
      titleIconDark={options.titleIconDark}
      initialToolbarState={options.initialToolbarState}
      isInjected={this.isInjected}
      onClickFullScreen={onClickFullScreen}
    />);
  }

  setItems (items: ToolbarItem[]) {
    document.dispatchEvent(new CustomEvent(ToolbarEventName.SET_ITEMS, {
      detail: {
        items,
      },
    }));
  }

  updateItem (item: ToolbarItem) {
    document.dispatchEvent(new CustomEvent(ToolbarEventName.UPDATE_ITEM, {
      detail: {
        item,
      },
    }));
  }

  removeItem (id: string) {
    document.dispatchEvent(new CustomEvent(ToolbarEventName.REMOVE_ITEM, {
      detail: {
        id,
      },
    }));
  }
}

export default new ToolbarUI();
