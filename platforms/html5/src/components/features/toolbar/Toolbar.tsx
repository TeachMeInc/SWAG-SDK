import { useEffect, useRef } from 'preact/hooks';
import { ToolbarEventName, ToolbarItem, ToolbarState, useToolbarState } from '@/components/features/toolbar/toolbarState';
import Icon from '@/components/ui/Icon';
import { DateString } from '@/types/DateString';
import utils from '@/utils';
import session from '@/session';



// #region Component

interface ToolbarProps {
  date: DateString;
  titleIcon?: string;
  titleIconDark?: string;
  initialToolbarState?: ToolbarState;
  onClickFullScreen?: () => void;
  isInjected?: boolean;
}

export function Toolbar (props: ToolbarProps) {
  /*
   * State
   */

  const [ toolbarState, dispatchToolbarState ] = useToolbarState(props.initialToolbarState);
  const elRef = useRef<HTMLDivElement>(null);
  const date = utils.getDateFromDateString(props.date);

  // 2025-01-10
  const shortDate = date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-'); 

  // January 10, 2025
  const fullDate = date.toLocaleDateString('en-US', {
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
        type: ToolbarEventName.SET_ITEMS,
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
        type: ToolbarEventName.UPDATE_ITEM,
        payload: item,
      });
    };
    document.addEventListener(ToolbarEventName.UPDATE_ITEM, updateItemHandler as EventListener);

    // Remove Item
    const removeItemHandler = (evt: CustomEvent<{ id: string }>) => {
      const id = evt.detail.id;
      if (!id) throw new Error('Toolbar error: Missing ID.');

      dispatchToolbarState({
        type: ToolbarEventName.REMOVE_ITEM,
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
    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const height = rect.height;

    session.toolbarHeight = height;

    if (!props.isInjected) {
      document.body.style.marginTop = `${height}px`;
    }
  }, [ props.isInjected ]);

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
                        alt={`${session.gameTitle} logo`} 
                        aria-hidden 
                      />
                      <img 
                        className='swag-toolbar__title-icon --hide-light'
                        src={props.titleIconDark || props.titleIcon} 
                        alt={`${session.gameTitle} logo`} 
                        aria-hidden 
                      />
                    </>
                  )
                  : null
              }
              {session.gameTitle}
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
                          <Icon icon={item.icon} iconStyle={item.toggled ? 'line' : 'fill'} />
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
