export interface IUser {
  name: string;
  email: string;
}

export interface ICreateUserInput extends IUser {
  password: string;
}

export interface ICreatedUser<TId> extends IUser {
  id: TId;
}
