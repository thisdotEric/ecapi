import { IUserService } from './user.interface';
import { ICreatedUser, ICreateUserInput } from './user.model';

export default class UserService implements IUserService {
  public async get(user_id: string): Promise<ICreatedUser<string>> {
    return {
      id: user_id,
      name: 'sdf',
      email: 'john@gmail.com',
    };
  }

  /**
  s * Create a new user
   * @param ICreateUserInput
   * @returns ICreatedUser<number>
   */

  public async create(
    newUserInput: ICreateUserInput
  ): Promise<ICreatedUser<string>> {
    const createdUser: ICreatedUser<string> = {
      id: '',
      name: newUserInput.name,
      email: newUserInput.email,
    };

    return createdUser;
  }
}
