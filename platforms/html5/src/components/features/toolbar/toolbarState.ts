import { useReducer } from 'preact/hooks';

export enum ToolbarEventName {
  SET_ITEMS = 'swag.toolbar.setItems',
  UPDATE_ITEM = 'swag.toolbar.updateItem',
  REMOVE_ITEM = 'swag.toolbar.removeItem',
}

export interface ToolbarItem {
  id: string;
  label?: string;
  icon?: string;
  disabled?: boolean;
  toggled?: boolean;
  onClick?: () => void;
}

export interface ToolbarState {
  items: ToolbarItem[];
}

export type ToolbarStateAction =
  | { type: ToolbarEventName.SET_ITEMS, payload: ToolbarItem[] }
  | { type: ToolbarEventName.UPDATE_ITEM, payload: ToolbarItem }
  | { type: ToolbarEventName.REMOVE_ITEM, payload: string }

export function useToolbarState (initialState?: ToolbarState) {
  return useReducer<ToolbarState, ToolbarStateAction>((state, action) => {
    switch (action.type) {

    case ToolbarEventName.SET_ITEMS: {
      return {
        ...state,
        items: action.payload,
      };
    }

    case ToolbarEventName.UPDATE_ITEM: {
      return {
        ...state,
        items: (
          (state.items.find(item => item.id === action.payload.id))
            ? state.items.map(item => {
              if (item.id === action.payload.id) {
                return {
                  ...item,
                  ...action.payload,
                };
              }
              return item;
            })
            : [
              ...state.items,
              action.payload,
            ]
        )
      };
    }

    case ToolbarEventName.REMOVE_ITEM: {
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
  }, initialState || { items: [] });
}
