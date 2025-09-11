import { useReducer } from 'preact/hooks';

export enum ToolbarEventName {
  SET_ITEMS = 'swag.toolbar.setItems',
  UPDATE_ITEM = 'swag.toolbar.updateItem',
  REMOVE_ITEM = 'swag.toolbar.removeItem',
  SHOW_TOOLBAR = 'swag.toolbar.showToolbar',
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

export interface ToolbarStateAction {
  type: ToolbarStateActionType
  payload: any
}

export enum ToolbarStateActionType {
  SET_ITEMS,
  ADD_OR_UPDATE_ITEM,
  REMOVE_ITEM,
}

export function useToolbarState (initialState?: ToolbarState) {
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
  }, initialState || { items: [] });
}
