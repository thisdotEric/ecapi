import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import { ICreatedUser, User } from '../../../src/modules/user/user.model';
import UserService from '../../../src/modules/user/user.service';
import { createUserInput } from '../../helpers';

describe('User Service tests', () => {
  describe('create()', () => {
    test('should create a new user', async () => {
      const newUserInput = createUserInput();

      const expectedUser: ICreatedUser<string> = {
        id: expect.any(String),
        name: newUserInput.name,
        email: newUserInput.email,
      };

      const mockedUserModel: Partial<ReturnModelType<typeof User, BeAnObject>> =
        {
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

  describe('get()', () => {
    describe('user has provided a valid user_id', () => {
      test('return the user associated with the user_id', async () => {
        const user = createUserInput();

        const expectedUser: ICreatedUser<string> = {
          id: expect.any(String),
          name: user.name,
          email: user.email,
        };

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findById: jest.fn().mockReturnValue({
            _id: new mongoose.Types.ObjectId(),
            name: user.name,
            email: user.email,
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        const actualUser = await userService.get('user_id');

        expect(mockedUserModel.findById).toBeCalledTimes(1);
        expect(actualUser).toEqual(expectedUser);
      });
    });

    describe('user has provided an invalid user_id', () => {
      test("should throw an error 'User not found'", async () => {
        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findById: jest.fn().mockReturnValue(null),
        };
        // @ts-ignore
        const userService = new UserService(mockedUserModel);

        try {
          await userService.get('invalid_id');
        } catch (error) {
          expect(mockedUserModel.findById).toBeCalledTimes(1);
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('User not found');
        }
      });
    });
  });
});
