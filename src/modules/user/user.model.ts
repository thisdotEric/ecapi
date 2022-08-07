import { prop } from '@typegoose/typegoose';

export interface IUser {
  name: string;
  email: string;
}

export interface ICreateUserInput extends IUser {
  password: string;
  confirm_password: string;
}

export interface ICreatedUser<TId> extends IUser {
  id: TId;
}

export class User implements IUser {
  @prop()
  name: string;

  @prop()
  email: string;

  @prop()
  hashedPassword: string;

  @prop()
  salt: string;
}
