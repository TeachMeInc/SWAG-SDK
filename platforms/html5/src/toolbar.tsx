
import { render } from 'preact';
import { useEffect, useReducer } from 'preact/hooks';



// #region Types

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  toggled?: boolean;
  onClick?: () => void;
}

interface ToolbarState {
  items: ToolbarItem[];
}

interface ToolbarStateAction {
  type: ToolbarStateActionType
  payload: any
}

enum ToolbarStateActionType {
  SET_ITEMS,
  ADD_OR_UPDATE_ITEM,
  REMOVE_ITEM,
}

enum ToolbarEventName {
  SET_ITEMS = 'swag.toolbar.setItems',
  UPDATE_ITEM = 'swag.toolbar.updateItem',
  REMOVE_ITEM = 'swag.toolbar.removeItem',
}

// #endregion



// #region Component

interface ToolbarProps {
  date: string
  title: string
  onClickFullScreen: () => void
  onClickItem: (id: string) => void;
}

const icons = {
  // faBoltLightning,
  // faBookmark,
  // faCircleHalfStroke,
  // faCircleQuestion,
  // faCircleQuestionToggled,
  // faClock,
  // faExpand,
  // faFlag,
  // faGamepad,
  // faGear,
  // faHeart,
  // faInfoCircle,
  // faMagnifyingGlass,
  // faMoon,
  // faPause,
  // faPencil,
  // faPlay,
  // faRankingStar,
  // faStar,
  // faStopwatch,
  // faSun,
  // faTrophy,
  // faVolumeXmark,
  // faVolumeOff,
  // faVolumeLow,
  // faVolumeHigh,
};

function useToolbarState () {
  return useReducer<ToolbarState, ToolbarStateAction>((state, action) => {
    switch (action.type) {
    case ToolbarStateActionType.SET_ITEMS: {
      return {
        ...state,
        items: action.payload as ToolbarItem[],
      };
    }
    case ToolbarStateActionType.ADD_OR_UPDATE_ITEM: {
      return {
        ...state,
        items: (
          (state.items.find(item => item.id === action.payload.id))
            ? state.items.map(item => {
              if (item.id === action.payload.id) {
                return {
                  ...item,
                  ...(action.payload as ToolbarItem),
                };
              }
              return item;
            })
            : [
              ...state.items,
              action.payload as ToolbarItem,
            ]
        )
      };
    }
    case ToolbarStateActionType.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.id !== (action.payload as string)),
      };
    }
    default: {
      return {
        ...state,
      };
    }
    }
  }, { items: [] });
}

export function Toolbar (props: ToolbarProps) {
  const [ toolbarState, dispatchToolbarState ] = useToolbarState();

  // 08-12-2024
  const shortDate = new Date(props.date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-'); 

  // August 12, 2024
  const fullDate = new Date(props.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  useEffect(() => {
    // Set Items
    const setItemsHandler = (evt: CustomEvent<{ items: ToolbarItem[] }>) => {
      const items = evt.detail.items;
      
      for (const item of items) {
        if (!item.id) throw new Error('Toolbar error: Missing ID');
        if (!item.icon && !item.label) throw new Error('Toolbar error: Missing icon or label');
      }

      const foundIds: string[] = [];
      for (const item of items) {
        if (foundIds.includes(item.id)) {
          throw new Error('Toolbar error: Duplicate IDs');
        }
        foundIds.push(item.id);
      }

      dispatchToolbarState({
        type: ToolbarStateActionType.SET_ITEMS,
        payload: items,
      });
    };
    document.addEventListener(ToolbarEventName.SET_ITEMS, setItemsHandler as EventListener);

    // Update Item
    const updateItemHandler = (evt: CustomEvent<{ item: ToolbarItem }>) => {
      const item = evt.detail.item;
      if (!item) throw new Error('Toolbar error: Missing item.');
      if (!item.id) throw new Error('Toolbar error: Missing ID');

      dispatchToolbarState({
        type: ToolbarStateActionType.ADD_OR_UPDATE_ITEM,
        payload: item,
      });
    };
    document.addEventListener(ToolbarEventName.UPDATE_ITEM, updateItemHandler as EventListener);

    // Remove Item
    const removeItemHandler = (evt: CustomEvent<{ id: string }>) => {
      const id = evt.detail.id;
      if (!id) throw new Error('Toolbar error: Missing ID.');

      dispatchToolbarState({
        type: ToolbarStateActionType.REMOVE_ITEM,
        payload: id,
      });
    };
    document.addEventListener(ToolbarEventName.REMOVE_ITEM, removeItemHandler as EventListener);

    return () => {
      document.removeEventListener(ToolbarEventName.SET_ITEMS, setItemsHandler as EventListener);
      document.removeEventListener(ToolbarEventName.UPDATE_ITEM, updateItemHandler as EventListener);
      document.removeEventListener(ToolbarEventName.REMOVE_ITEM, removeItemHandler as EventListener);
    };
  }, [  dispatchToolbarState ]);

  return (
    <header className='swag-toolbar'>
      <div className='swag-toolbar-container'>
        <div className='swag-toolba-container-inner'>
          <aside className='swag-toolbar-flex' data-pull-left>
            <span data-hide-desktop>
              {shortDate}
            </span>
            <span data-hide-mobile>
              {fullDate}
            </span>
          </aside>
          <div className='swag-toolbar-flex'>
            <h1>{props.title}</h1>
          </div>
          <div className='swag-toolbar-flex swag-toolbar-icons' data-pull-right>
            <span data-clickable data-hide-mobile>
              <i className='swag-toolbar-icon' onClick={props.onClickFullScreen} />
            </span>
            {
              toolbarState.items.forEach((item) => (
                <span
                  key={item.id}
                  onClick={() => props.onClickItem(item.id)}
                  data-clickable={item.onClick}
                  data-disabled={item.disabled}
                >
                  { item.icon ? <i className='swag-toolbar-icon' /> : null }
                  { item.label ? <span className='swag-toolbar-icon-label'>{item.label}</span> : null }
                </span>
              ))
            }
          </div>
        </div>
      </div>
    </header>
  );
}

// #endregion



// #region Toolbar API

class ToolbarAPI {
  async showToolbar (
  ) {
    const rootEl = document.getElementById('swag-react-root')!;

    const showToolbar = () => {
      render(<div></div>, rootEl);
    };

    return new Promise<void>((resolve) => {
      showToolbar();
      resolve();
    });
  }

  protected unmount () {
    const rootEl = document.getElementById('swag-react-root')!;
    render(null, rootEl);
    return Promise.resolve();
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

// #endregion



const toolbar = new ToolbarAPI();
export default toolbar;
