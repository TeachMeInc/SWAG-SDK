import { useEffect, useRef, useState } from 'preact/hooks';
import { ToolbarEventName, ToolbarItem, ToolbarState, ToolbarStateActionType, useToolbarState } from '@/components/features/toolbar/toolbarState';
import Icon from '@/components/ui/Icon';



// #region Component

interface ToolbarProps {
  date: string;
  title?: string;
  titleIcon?: string;
  titleIconDark?: string;
  initialToolbarState?: ToolbarState;
  onClickFullScreen?: () => void;
  isInjected?: boolean;
}

function parseLocalDate (dateStr: string) {
  const [ year, month, day ] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function Toolbar (props: ToolbarProps) {
  /*
   * State
   */

  const [ toolbarState, dispatchToolbarState ] = useToolbarState(props.initialToolbarState);
  const [ title, setTitle ] = useState<string>(props.title || '');
  const elRef = useRef<HTMLDivElement>(null);
  const date = parseLocalDate(props.date);

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
    if (props.isInjected) return;

    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const height = rect.height;

    document.body.style.marginTop = `${height}px`;
  }, [ props.isInjected ]);

  /* 
   * Layout
   */

  return (
    <header className='swag-toolbar' ref={elRef} style={{ opacity: title ? 1 : 0 }}>
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
                        alt={`${title} logo`} 
                        aria-hidden 
                      />
                      <img 
                        className='swag-toolbar__title-icon --hide-light'
                        src={props.titleIconDark || props.titleIcon} 
                        alt={`${title} logo`} 
                        aria-hidden 
                      />
                    </>
                  )
                  : null
              }
              {title}
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
