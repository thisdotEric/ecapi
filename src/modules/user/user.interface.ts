import { ICreateUserInput, ICreatedUser } from './user.model';

export interface IUserService {
  create(createUserInput: ICreateUserInput): Promise<ICreatedUser<string>>;
  get(user_id: string): Promise<ICreatedUser<string>>;
}
