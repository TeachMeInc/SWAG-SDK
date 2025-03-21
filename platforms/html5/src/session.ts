export interface Entity {
  _id: string;
  memberName: string;
  token: string;
}

export interface Session {
  api_key: string | null;
  uid: string | null;
  entity: string | null;
  wrapper: HTMLElement | null;
  theme: 'shockwave' | null;
  debug: boolean;
  provider: 'shockwave' | null;
}

const session: Session = {
  api_key: null,
  uid: null,
  entity: null,
  wrapper: null,
  theme: null,
  debug: false,
  provider: null
};

export default session;
