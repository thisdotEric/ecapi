import { ICreatedUser, ICreateUserInput } from './user.model';

export default class UserService {
  /**
   * Create new user
   */
  public async create(
    newUserInput: ICreateUserInput
  ): Promise<ICreatedUser<number>> {
    const createdUser: ICreatedUser<number> = {
      id: 3,
      name: newUserInput.name,
      email: newUserInput.email,
    };

    return createdUser;
  }
}
