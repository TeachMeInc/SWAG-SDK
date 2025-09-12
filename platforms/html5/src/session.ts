export interface Entity {
  _id: string;
  memberName: string;
  isMember: boolean;
  token: string;
}

export interface Session {
  apiKey: string | null;
  uid: string | null;
  entity: Entity | null;
  theme: 'shockwave' | null;
  debug: boolean;
  provider: 'shockwave' | null;
  jwt: string | null;
  game: { name: string } | null;
}

const session: Session = {
  apiKey: null,
  uid: null,
  entity: null,
  theme: null,
  debug: false,
  provider: null,
  jwt: null,
  game: null,
};

export default session;
