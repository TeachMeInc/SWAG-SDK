import messages from '@/api/messages';
import { ToolbarEventName, ToolbarItem, ToolbarState } from '@/components/features/toolbar/toolbarState';
import { Toolbar } from '@/components/features/toolbar/Toolbar';
import UserInterfaceAPI from '@/UserInterfaceAPI';
import utils from '@/utils';

class ToolbarUI extends UserInterfaceAPI {
  protected rootElId: string = 'swag-toolbar-root';
  protected rootElClassName: string = 'swag-toolbar-root';

  async show (options: {
    onClickFullScreen?: () => void;
    title?: string;
    titleIcon?: string;
    titleIconDark?: string;
    initialToolbarState?: ToolbarState;
  }) {
    let onClickFullScreen: (() => void) | undefined = undefined;

    if (utils.getPlatform() === 'embed') {
      onClickFullScreen = () => {
        messages.trySendMessage('swag.toggleFullScreen', '', true);
      };
    } else if (options.onClickFullScreen) {
      onClickFullScreen = options.onClickFullScreen;
    }

    this.mount(<Toolbar
      date={utils.getDateString()}
      title={options.title || ''}
      titleIcon={options.titleIcon}
      titleIconDark={options.titleIconDark}
      initialToolbarState={options.initialToolbarState}
      isInjected={this.isInjected}
      onClickFullScreen={onClickFullScreen}
    />);
  }

  showToolbar (options: {
    title: string;
  }) {
    document.dispatchEvent(new CustomEvent(ToolbarEventName.SHOW_TOOLBAR, {
      detail: {
        title: options.title,
      },
    }));
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

const toolbar = new ToolbarUI();
export default toolbar;
