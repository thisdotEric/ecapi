import { ReturnModelType } from '@typegoose/typegoose';
import {
  BeAnObject,
  IObjectWithTypegooseFunction,
} from '@typegoose/typegoose/lib/types';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt';
import { hashPassword, verifyPassword } from '../../utils/password';
import { ISessionService, ITokens, IUserService } from './user.interface';
import { ICreatedUser, ICreateUserInput, IUser, User } from './user.model';
import { Document, Types } from 'mongoose';

export type ProductModelType = ReturnModelType<typeof User, BeAnObject>;

type UserDoc = Document<any, BeAnObject, User> &
  User &
  IObjectWithTypegooseFunction & {
    _id: Types.ObjectId;
  };

export default class UserService implements IUserService, ISessionService {
  constructor(
    private readonly userModel: ReturnModelType<typeof User, BeAnObject>
  ) {}

  // Helper function to transform user document to ICreatedUser object
  private _toUser({ _id: id, name, email }: UserDoc): ICreatedUser<string> {
    return {
      id,
      name,
      email,
    };
  }

  /**
   * Get single user
   * @param user_id
   * @returns the user associated with the given user_id
   */
  public async get(user_id: string): Promise<ICreatedUser<string>> {
    const user = await this.userModel.findById({
      _id: user_id,
    });

    if (!user) throw new Error('User not found');

    return this._toUser(user);
  }

  /**
   * Create a new user
   * @param ICreateUserInput
   * @returns the newly created user
   */

  public async create({
    name,
    email,
    password,
  }: ICreateUserInput): Promise<ICreatedUser<string>> {
    const emailAlreadyExists = await this.userModel.findOne({ email });

    if (emailAlreadyExists) throw new Error('Email already exists');

    const { salt, hashedPassword } = await hashPassword(password);

    const userDoc = await this.userModel.create({
      name,
      email,
      hashedPassword,
      salt,
    });

    if (!userDoc) throw new Error('Error creating user');

    return this._toUser(userDoc);
  }

  /**
   * Delete a user
   * @param user_id
   * @returns true if the user is successfully deleted, otherwise throws an exception
   */
  public async delete(user_id: string): Promise<boolean> {
    const deletedUser = await this.userModel.findByIdAndDelete({
      _id: user_id,
    });

    if (deletedUser == null) throw new Error('Unable to delete user');

    return true;
  }

  /**
   * Update a given user
   * @param user_id
   * @param updatedUserInfo
   * @returns the updated user informations
   */
  public async update(
    user_id: string,
    updatedUserInfo: IUser
  ): Promise<ICreatedUser<string>> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        _id: user_id,
      },
      { ...updatedUserInfo },
      { returnDocument: 'after' }
    );

    if (!updatedUser) throw new Error('User not found');

    return this._toUser(updatedUser);
  }

  /**
   * Logs in user using their email and password
   * @param email
   * @param password
   * @param validatePasswordFn
   * @returns the access token and refresh token to be used for authentication/authorization
   */
  public async login(
    email: string,
    password: string,
    validatePasswordFn = verifyPassword
  ): Promise<ITokens> {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new Error('User does not exists');

    const user_id = user._id;
    const salt = user.salt;
    const hashedPassword = user.hashedPassword;

    const validPassword = await validatePasswordFn(
      password,
      hashedPassword,
      salt
    );

    if (!validPassword) throw new Error('Login failed');

    return {
      accessToken: generateAccessToken(user_id),
      refreshToken: generateRefreshToken(user_id),
    };
  }

  public async logout(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * Get all users
   * @returns an array of all users
   */
  public async getAll(): Promise<ICreatedUser<string>[]> {
    const users = await this.userModel.find({});

    if (!users) throw new Error('Users not found');

    return users.map((user) => this._toUser(user));
  }
}
