import { faBoltLightning, faBookmark, faCircleHalfStroke, faCircleQuestion, faClock, faExpand, faFlag, faGamepad, faGear, faHeart, faInfoCircle, faMagnifyingGlass, faMoon, faPause, faPencil, faPlay, faRankingStar, faStar, faStopwatch, faSun, faTrophy, faVolumeHigh, faVolumeLow, faVolumeOff, faVolumeXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion as faCircleQuestionToggled } from '@fortawesome/free-regular-svg-icons';
import { render } from 'preact';
import { useEffect, useReducer, useRef } from 'preact/hooks';
import messages from './messages';
import utils from './utils';



// #region Icons

const faIcons: Record<string, IconDefinition> = {
  faBoltLightning,
  faBookmark,
  faCircleHalfStroke,
  faCircleQuestion,
  faCircleQuestionToggled,
  faClock,
  faExpand,
  faFlag,
  faGamepad,
  faGear,
  faHeart,
  faInfoCircle,
  faMagnifyingGlass,
  faMoon,
  faPause,
  faPencil,
  faPlay,
  faRankingStar,
  faStar,
  faStopwatch,
  faSun,
  faTrophy,
  faVolumeXmark,
  faVolumeOff,
  faVolumeLow,
  faVolumeHigh,
};

function FontAwesomeIcon (props: { icon: IconDefinition }) {
  const icon = props.icon;

  return (
    <svg 
      aria-hidden='true' 
      focusable='false' 
      data-prefix={icon.prefix}
      data-icon={icon.iconName}
      className={`svg-inline--fa fa-${icon.iconName}`} 
      role='img' 
      xmlns='http://www.w3.org/2000/svg' 
      viewBox={`0 0 ${icon.icon[ 0 ]} ${icon.icon[ 1 ]}`}
    >
      <path 
        fill='currentColor' 
        d={icon.icon[ 4 ] as string}
      />
    </svg>
  );
}

function SWAGIcon (props: { icon: string, toggled?: boolean }) {
  const icon = props.icon;

  return (
    <i 
      aria-hidden='true'
      className={`swag-icon ${icon}-${props.toggled ? 'line' : 'fill'}`}
    />
  );
}

function Icon (props: { icon: string, toggled?: boolean }) {
  if (props.icon.startsWith('fa')) {
    return (
      <FontAwesomeIcon icon={faIcons[ props.icon ]} />
    );
  } else {
    return (
      <SWAGIcon icon={props.icon} toggled={props.toggled} />
    );
  }
}

// #endregion



// #region State

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

// #endregion



// #region Component

interface ToolbarProps {
  date: string;
  title: string;
  titleIcon?: string;
  titleIconDark?: string;
  useCustomRootEl?: boolean;
  onClickFullScreen?: () => void;
}

export function Toolbar (props: ToolbarProps) {
  /*
   * State
   */

  const [ toolbarState, dispatchToolbarState ] = useToolbarState();
  const elRef = useRef<HTMLDivElement>(null);

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


  /*
   * Methods
   */

  const onClickItem = (id: string) => {
    const item = toolbarState.items.find(item => item.id === id);
    if (!item) return;
    if (item.onClick) item.onClick();
  };


  /*
   * Effects
   */

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
  }, [ dispatchToolbarState ]);

  useEffect(() => {
    if (props.useCustomRootEl) return;

    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const height = rect.height;

    document.body.style.marginTop = `${height}px`;
  }, [ props.useCustomRootEl ]);


  /* 
   * Layout
   */

  return (
    <header className='swag-toolbar' ref={elRef}>
      <div className='swag-toolbar__container'>
        <div className='swag-toolbar__container__inner'>
          <aside className='swag-toolbar__flex --pull-left'>
            <span className='--hide-desktop'>
              {shortDate}
            </span>
            <span className='--hide-mobile'>
              {fullDate}
            </span>
          </aside>
          <div className='swag-toolbar__flex'>
            <h1>
              {
                props.titleIcon
                  ? (
                    <>
                      <img 
                        className='swag-toolbar__title-icon --hide-dark'
                        src={props.titleIcon} 
                        alt={`${props.title} logo`} 
                        aria-hidden 
                      />
                      <img 
                        className='swag-toolbar__title-icon --hide-light'
                        src={props.titleIconDark || props.titleIcon} 
                        alt={`${props.title} logo`} 
                        aria-hidden 
                      />
                    </>
                  )
                  : null
              }
              {props.title}
            </h1>
          </div>
          <aside className='swag-toolbar__flex swag-toolbar__icons --pull-right'>
            {
              props.onClickFullScreen 
                ? (
                  <span className='--hide-mobile' data-clickable>
                    <span
                      className='swag-toolbar__icon' 
                      onClick={props.onClickFullScreen} 
                    >
                      <Icon icon={'expand'} />
                    </span>
                  </span>
                )
                : null
            }
            {
              toolbarState.items.map((item) => (
                <span
                  key={item.id}
                  onClick={() => onClickItem(item.id)}
                  data-clickable={!!item.onClick}
                  data-disabled={item.disabled}
                >
                  { 
                    item.icon 
                      ? (
                        <span className='swag-toolbar__icon'>
                          <Icon icon={item.icon} toggled={item.toggled} />
                        </span>
                      )
                      : null 
                  }
                  { 
                    item.label 
                      ? (
                        <span className='swag-toolbar__icon-label'>{item.label}</span> 
                      )
                      : null 
                  }
                </span>
              ))
            }
          </aside>
        </div>
      </div>
    </header>
  );
}

// #endregion



// #region Toolbar API

enum ToolbarEventName {
  SET_ITEMS = 'swag.toolbar.setItems',
  UPDATE_ITEM = 'swag.toolbar.updateItem',
  REMOVE_ITEM = 'swag.toolbar.removeItem',
}

class ToolbarAPI {
  rootElId: string = 'swag-toolbar-root';

  getRootEl () {
    return document.getElementById(this.rootElId)!;
  }

  async showToolbar (options: {
    useCustomRootEl?: boolean;
    onClickFullScreen?: () => void;
  }) {
    let onClickFullScreen: () => void;

    if (utils.getPlatform() === 'embed') {
      onClickFullScreen = () => {
        messages.trySendMessage('swag.toggleFullScreen', '', true);
      };
    } else if (options.onClickFullScreen) {
      onClickFullScreen = options.onClickFullScreen;
    }

    const showToolbar = () => {
      render(
        <Toolbar
          date='2024-08-12'
          title='Toolbar Title'
          titleIcon='https://new.shockwave.com/images/SW25.svg'
          titleIconDark='https://new.shockwave.com/images/SW25_alt.svg'
          useCustomRootEl={options.useCustomRootEl}
          onClickFullScreen={onClickFullScreen}
        />, 
        this.getRootEl()
      );
    };

    return new Promise<void>((resolve) => {
      showToolbar();
      resolve();
    });
  }

  protected unmount () {
    render(null, this.getRootEl());
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



// #region Export

const toolbar = new ToolbarAPI();
export default toolbar;

// #endregion
