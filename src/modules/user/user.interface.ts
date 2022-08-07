import { ICreateUserInput, ICreatedUser, IUser } from './user.model';

export interface IUserService {
  create(createUserInput: ICreateUserInput): Promise<ICreatedUser<string>>;
  get(user_id: string): Promise<ICreatedUser<string>>;
  delete(user_id: string): Promise<boolean>;
  update(
    user_id: string,
    updatedUserInfo: IUser
  ): Promise<ICreatedUser<string>>;
}

export interface ITokens {
  refreshToken: string;
  accessToken: string;
}

export interface ISessionService {
  login(email: string, password: string): Promise<ITokens>;
  logout(): Promise<boolean>;
}
