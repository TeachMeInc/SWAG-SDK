import { Entity } from '@/types/Entity';
import { Game } from '@/types/Game';

export interface Session {
  apiKey: string | null;
  entity: Entity | null;
  debug: boolean;
  jwt: string | null;
  gameTitle: string;
  game: Game | null;
  toolbarHeight: number;
  analyticsId: string | null;
  hostUrl: string;
}

const session: Session = {
  apiKey: null,
  entity: null,
  debug: false,
  jwt: null,
  gameTitle: '',
  game: null,
  toolbarHeight: 48,
  analyticsId: null,
  hostUrl: '',
};

export default session;
