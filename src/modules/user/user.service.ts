import { IUserService } from './user.interface';
import { ICreatedUser, ICreateUserInput, IUser } from './user.model';

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

  public async delete(user_id: string): Promise<boolean> {
    console.log(user_id);
    throw new Error('');

    // return true;
  }

  public async update(
    user_id: string,
    updatedUserInfo: IUser
  ): Promise<ICreatedUser<string>> {
    return {
      id: user_id,
      name: updatedUserInfo.name,
      email: updatedUserInfo.email,
    };
  }
}
