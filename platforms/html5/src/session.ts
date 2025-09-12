import { Entity } from '@/types/Entity';

export interface Session {
  apiKey: string | null;
  entity: Entity | null;
  debug: boolean;
  jwt: string | null;
  game: { name: string } | null;
  toolbarHeight: number;
}

const session: Session = {
  apiKey: null,
  entity: null,
  debug: false,
  jwt: null,
  game: null,
  toolbarHeight: 48,
};

export default session;
