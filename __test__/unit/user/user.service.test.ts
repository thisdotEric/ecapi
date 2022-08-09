import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import mongoose from 'mongoose';
import { ICreatedUser, User } from '../../../src/modules/user/user.model';
import UserService from '../../../src/modules/user/user.service';
import { createUserInput } from '../../helpers';
import { ITokens } from '../../../src/modules/user/user.interface';

describe('User Service tests', () => {
  describe('create()', () => {
    describe('user has provided valid name and email', () => {
      test('should create a new user', async () => {
        const newUserInput = createUserInput();

        const expectedUser: ICreatedUser<string> = {
          id: expect.any(String),
          name: newUserInput.name,
          email: newUserInput.email,
        };

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          create: jest.fn().mockReturnValue({
            _id: expect.any(String),
            name: newUserInput.name,
            email: newUserInput.email,
          }),
          findOne: jest.fn().mockReturnValue(null),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        const actualCreatedUser = await userService.create(newUserInput);

        expect(mockedUserModel.create).toBeCalledTimes(1);
        expect(actualCreatedUser).toEqual(expectedUser);
      });
    });

    describe('user has provided an existing email address', () => {
      test("should throw an error 'Email already exists'", async () => {
        const newUserInput = createUserInput();

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findOne: jest.fn().mockReturnValue({
            _id: expect.any(String),
            name: newUserInput.name,
            email: newUserInput.email,
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);

        try {
          await userService.create(newUserInput);
        } catch (error) {
          expect(mockedUserModel.findOne).toBeCalledWith({
            email: newUserInput.email,
          });
          expect(error).toBeInstanceOf(Error);
          expect(error.message).toBe('Email already exists');
        }
      });
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
            _id: expect.any(String),
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

  describe('getAll()', () => {
    describe('user is logged in', () => {
      test('return all the users', async () => {
        const user = createUserInput();

        const expectedUsers: ICreatedUser<string>[] = [
          {
            id: expect.any(String),
            name: user.name,
            email: user.email,
          },
        ];

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          find: jest
            .fn()
            .mockReturnValue([
              { _id: expect.any(String), name: user.name, email: user.email },
            ]),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        const allUsers = await userService.getAll();

        expect(mockedUserModel.find).toBeCalledTimes(1);
        expect(allUsers).toStrictEqual(expectedUsers);
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

  describe('update()', () => {
    describe('user has provided valid fields to be updated', () => {
      test('update and return the updated user information ', async () => {
        const user_id = 'user_id';

        const userInput = {
          name: expect.any(String),
          email: expect.any(String),
        };

        const expectedUser: ICreatedUser<string> = {
          id: user_id,
          name: userInput.name,
          email: userInput.email,
        };

        const mockedUserModel: Partial<
          ReturnModelType<typeof User, BeAnObject>
        > = {
          findOneAndUpdate: jest.fn().mockReturnValue({
            _id: user_id,
            name: userInput.name,
            email: userInput.email,
          }),
        };

        // @ts-ignore
        const userService = new UserService(mockedUserModel);
        const updatedUser = await userService.update(user_id, userInput);

        expect(mockedUserModel.findOneAndUpdate).toBeCalledTimes(1);
        expect(updatedUser).toEqual(expectedUser);
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
            _id: expect.any(String),
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
            _id: expect.any(String),
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
