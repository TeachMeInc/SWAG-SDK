export interface Entity {
  _id: string;
  memberName: string;
  isMember: boolean;
  token: string;
}

export interface Session {
  api_key: string | null;
  uid: string | null;
  entity: Entity | null;
  wrapper: HTMLElement | null;
  theme: 'shockwave' | null;
  debug: boolean;
  provider: 'shockwave' | null;
  jwt: string | null;
}

const session: Session = {
  api_key: null,
  uid: null,
  entity: null,
  wrapper: null,
  theme: null,
  debug: false,
  provider: null,
  jwt: null,
};

export default session;
