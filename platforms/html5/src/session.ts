import { Entity } from '@/types/Entity';
import { Game } from '@/types/Game';

export interface Session {
  apiKey: string | null;
  entity: Entity | null;
  debug: boolean;
  jwt: string | null;
  game: Game | null;
  gameTitle: string;
  toolbarHeight: number;
}

const session: Session = {
  apiKey: null,
  entity: null,
  debug: false,
  jwt: null,
  game: null,
  gameTitle: '',
  toolbarHeight: 48,
};

export default session;
