import { LeaderboardData } from '@/api/data';
import session from '@/session';
import { DateString } from '@/types/DateString';
import utils from '@/utils';
import { useReducer } from 'preact/hooks';

function formatDate (date: Date) {
  const today = new Date();
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  if (isSameDate(date, today)) {
    return 'Today';
  }

  return date.toLocaleDateString(
    undefined, 
    { month: 'short', day: 'numeric' }
  );
}

export function makeDefaultState (initialState: Partial<LeaderboardScreenState> = {}): LeaderboardScreenState {
  const userDisplayName = (() => {
    return (session.entity?.member
      ? (
        session.entity?.leaderboard_name ||
        session.entity?.member.shockwave.screen_name ||
        ''
      )
      : (
        session.entity?.leaderboard_name || 
        ''
      )
    );
  })();

  const days = (() => {
    const days: LeaderboardScreenState['days'] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push({
        key: utils.getDateStringFromDate(date),
        label: formatDate(date),
      });
    }
    return days;
  })();

  const currentDateString = utils.getDateString();
  const currentDate = utils.getDateFromDateString(currentDateString);
  const currentDay = currentDateString
    ? (
      days.find(d => d.key === currentDateString) || 
      { 
        key: currentDateString, 
        label: formatDate(currentDate) 
      }
    )
    : days[ 0 ];

  const rooms = (session.entity?.leaderboards || []).map((room) => ({
    key: room,
    label: `Room: ${room}`,
  }));

  const currentRoom = initialState.currentRoom || rooms.at(-1) || null;

  return {
    userDisplayName,
    rooms,
    currentRoom,
    days,
    currentDay,
    leaderboardData: initialState.leaderboardData || null,
  };
}

export interface LeaderboardScreenState {
  userDisplayName: string;
  rooms: { key: string, label: string }[];
  currentRoom: { key: string, label: string } | null;
  days: { key: DateString, label: string }[];
  currentDay: { key: DateString, label: string };
  leaderboardData: any | null;
}

export type LeaderboardScreenStateAction =
  | { type: 'setUserDisplayName', payload: string }
  | { type: 'setCurrentRoom', payload: string }
  | { type: 'setCurrentDay', payload: DateString }

export function useLeaderboardScreenState (initialState: LeaderboardScreenState) {
  return useReducer<LeaderboardScreenState, LeaderboardScreenStateAction>((state, action) => {
    switch (action.type) {

    case 'setUserDisplayName': {
      return {
        ...state,
        userDisplayName: action.payload,
      };
    }

    case 'setCurrentRoom': {
      const room = state.rooms.find(r => r.key === action.payload);
      return {
        ...state,
        currentRoom: room || { key: action.payload, label: `Room: ${action.payload}` },
      };
    }

    case 'setCurrentDay': {
      const day = state.days.find(d => d.key === action.payload);
      return {
        ...state,
        currentDay: day || { key: action.payload, label: `Day: ${action.payload}` },
      };
    }

    default: {
      return {
        ...state,
      };
    }

    }
  }, initialState);
}
