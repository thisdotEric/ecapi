import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import { ICreatedUser, User } from '../../../src/modules/user/user.model';
import UserService from '../../../src/modules/user/user.service';
import { createUserInput } from '../../helpers';

describe('User Service tests', () => {
  test('should create a new user', async () => {
    const newUserInput = createUserInput();

    const expectedUser: ICreatedUser<string> = {
      id: expect.any(String),
      name: newUserInput.name,
      email: newUserInput.email,
    };

    const mockedUserModel: Partial<ReturnModelType<typeof User, BeAnObject>> = {
      create: jest.fn().mockReturnValue({
        _id: new mongoose.Types.ObjectId(),
        name: newUserInput.name,
        email: newUserInput.email,
      }),
    };

    // @ts-ignore
    const userService = new UserService(mockedUserModel);
    const actualCreatedUser = await userService.create(newUserInput);

    expect(mockedUserModel.create).toBeCalledTimes(1);
    expect(actualCreatedUser).toEqual(expectedUser);
  });
});
