import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { hashPassword } from '../../utils/password';
import { IUserService } from './user.interface';
import { ICreatedUser, ICreateUserInput, IUser, User } from './user.model';

export default class UserService implements IUserService {
  constructor(
    private readonly userModel: ReturnModelType<typeof User, BeAnObject>
  ) {}

  public async get(user_id: string): Promise<ICreatedUser<string>> {
    return {
      id: user_id,
      name: 'sdf',
      email: 'john@gmail.com',
    };
  }

  /**
   * Create a new user
   * @param ICreateUserInput
   * @returns ICreatedUser<number>
   */

  public async create({
    name,
    email,
    password,
  }: ICreateUserInput): Promise<ICreatedUser<string>> {
    const { salt, hashedPassword } = await hashPassword(password);

    const doc = await this.userModel.create({
      name,
      email,
      hashedPassword,
      salt,
    });

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
    };
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
