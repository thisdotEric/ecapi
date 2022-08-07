import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import { ICreatedUser, User } from '../../../src/modules/user/user.model';
import UserService from '../../../src/modules/user/user.service';
import { createUserInput } from '../../helpers';
import { ITokens } from '../../../src/modules/user/user.interface';

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

  describe('delete()', () => {
    describe('user has provided a valid user_id', () => {
      test('should delete the user and return true', async () => {
        const user = createUserInput();

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findByIdAndDelete: jest.fn().mockReturnValue({
            _id: new mongoose.Types.ObjectId(),
            name: user.name,
            email: user.email,
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        const userIsDeleted = await userService.delete('user_id');

        expect(mockedUserModel.findByIdAndDelete).toBeCalledTimes(1);
        expect(userIsDeleted).toBeTruthy();
      });
    });

    describe('user has provided an invalid user_id', () => {
      test("should throw an error 'Unable to delete user'", async () => {
        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findByIdAndDelete: jest.fn().mockReturnValue(null),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);

        try {
          await userService.delete('invalid_id');
        } catch (error) {
          expect(mockedUserModel.findByIdAndDelete).toBeCalledTimes(1);
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Unable to delete user');
        }
      });
    });
  });

  describe('login()', () => {
    describe('user has provided both email and password', () => {
      test('should return an object with access token and refresh token', async () => {
        const email = 'johndoe@gmail.com';
        const password = 'password';
        const salt = 'samplesalt';
        const hashedPassword = 'samplehashedpassword';

        const mockTokens: ITokens = {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        };

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findOne: jest.fn().mockReturnValue({
            _id: new mongoose.Types.ObjectId(),
            name: 'name',
            email,
            salt,
            hashedPassword,
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        let actualTokens;

        const mockVerifyPasswordFn = jest.fn().mockReturnValue(true);

        // @ts-ignore
        actualTokens = await userService.login(
          email,
          password,
          mockVerifyPasswordFn
        );

        expect(mockedUserModel.findOne).toHaveBeenCalled();
        expect(mockVerifyPasswordFn).toHaveBeenCalledWith(
          password,
          hashedPassword,
          salt
        );
        expect(actualTokens).toStrictEqual(mockTokens);
      });
    });

    describe('user has provided both email and password but the password is incorrect', () => {
      test("should throw an error 'Login failed'", async () => {
        const email = 'johndoe@gmail.com';
        const password = 'incorrectPassword';

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findOne: jest.fn().mockReturnValue({
            _id: new mongoose.Types.ObjectId(),
            name: 'name',
            email,
            salt: 'invalidsalt',
            hashedPassword: 'wronghashedpassword',
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);

        const mockVerifyPasswordFn = jest.fn().mockReturnValue(false);

        try {
          await userService.login(email, password, mockVerifyPasswordFn);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Login failed');
          expect(mockedUserModel.findOne).toHaveBeenCalled();
        }
      });
    });

    describe('user has provided both email and password but the user does not exists', () => {
      test("should throw an error 'User does not exists'", async () => {
        const email = 'userdoesnotexists@gmail.com';
        const password = '';

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findOne: jest.fn().mockReturnValue(null),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);

        try {
          await userService.login(email, password);
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('User does not exists');
          expect(mockedUserModel.findOne).toHaveBeenCalled();
        }
      });
    });
  });
});
