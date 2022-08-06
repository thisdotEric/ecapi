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
