export type user = {
  id?: number;
  uid: number;
  filters: string | Array<string>;
};
export type dbUser = {
  id: number;
  uid: number;
  filters: string | Array<string>;
};
export type userExists = {
  id?: number;
  uid?: number;
  filters?: string | Array<string>;
};
