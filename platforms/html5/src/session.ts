import { DrupalGame } from '@/api/drupal';
import { Entity } from '@/types/Entity';
import { Game } from '@/types/Game';

export interface Session {
  apiKey: string | null;
  entity: Entity | null;
  debug: boolean;
  jwt: string | null;
  gameTitle: string;
  game: Game | null;
  drupalGame: DrupalGame | null;
  toolbarHeight: number;
  analyticsId: string | null;
}

const session: Session = {
  apiKey: null,
  entity: null,
  debug: false,
  jwt: null,
  gameTitle: '',
  game: null,
  drupalGame: null,
  toolbarHeight: 48,
  analyticsId: null,
};

export default session;
