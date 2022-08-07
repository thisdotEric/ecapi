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
    const user = await this.userModel.findById({
      _id: user_id,
    });

    if (!user) throw new Error('User not found');

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
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

    const userDoc = await this.userModel.create({
      name,
      email,
      hashedPassword,
      salt,
    });

    if (!userDoc) throw new Error('Error creating user');

    return {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
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
