import { Response, Request } from 'express';
import UserController from '../../../src/modules/user/user.controller';
import { IUserService } from '../../../src/modules/user/user.interface';
import { createUserInput } from '../../helpers';

type User = {
  user: {
    user_id: string;
  };
};

describe('User controller test', () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation((data) => data),
  };

  describe('create()', () => {
    describe('user has provided name, email, password and confirm password on request body', () => {
      test('should return the newly created user', async () => {
        const userInput = createUserInput();

        const req: Partial<Request> = {
          body: userInput,
        };

        const newUser = {
          user_id: expect.any(String),
          name: userInput.name,
          email: userInput.email,
        };

        const mockedService: Partial<IUserService> = {
          create: jest.fn().mockReturnValue(newUser),
        };

        // @ts-ignore
        const userController = new UserController(mockedService);
        // @ts-ignore
        await userController.create(req, res);

        expect(mockedService.create).toHaveBeenCalledWith(userInput);
        expect(res.status).toBeCalledWith(201);
        expect(res.json).toBeCalledWith(newUser);
      });
    });
  });

  describe('get()', () => {
    describe('user has a valid authorization token', () => {
      test('should return the user associated with the given user_id (from req.user object)', async () => {
        const user_id = 'test-id';

        const req: Partial<Request & User> = {
          user: {
            user_id,
          },
        };

        const sampleUser = {
          user_id,
          name: expect.any(String),
          email: expect.any(String),
        };

        const mockedService: Partial<IUserService> = {
          get: jest.fn().mockReturnValue(sampleUser),
        };

        // @ts-ignore
        const userController = new UserController(mockedService);
        // @ts-ignore
        await userController.get(req, res);

        expect(mockedService.get).toHaveBeenCalledWith(user_id);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(sampleUser);
      });
    });
  });

  describe('delete()', () => {
    describe('user has a valid authorization token', () => {
      test('should DELETE the user associated with the given user_id (from req.user object) and return 200 status', async () => {
        const user_id = 'test-id';

        const req: Partial<Request & User> = {
          user: {
            user_id,
          },
        };

        const mockedService: Partial<IUserService> = {
          delete: jest.fn().mockReturnValue(true),
        };

        // @ts-ignore
        const userController = new UserController(mockedService);
        // @ts-ignore
        await userController.delete(req, res);

        expect(mockedService.delete).toHaveBeenCalledWith(user_id);
        expect(res.status).toBeCalledWith(200);
        expect(res.json).not.toBeCalledWith();
      });
    });

    describe('user has failed to delete his/her account', () => {
      test('should return 400 status', async () => {
        const user_id = 'test-id';

        const req: Partial<Request & User> = {
          user: {
            user_id,
          },
        };

        const mockedService: Partial<IUserService> = {
          delete: jest.fn().mockReturnValue(false),
        };

        // @ts-ignore
        const userController = new UserController(mockedService);
        // @ts-ignore
        await userController.delete(req, res);

        expect(mockedService.delete).toHaveBeenCalledWith(user_id);
        expect(res.status).toBeCalledWith(400);
        expect(res.json).not.toBeCalledWith();
      });
    });
  });

  describe('update()', () => {
    describe('user has a valid authorization token', () => {
      test('should update the users name and email with values from the request body', async () => {
        const updatedUserInfo = {
          user_id: 'test_id',
          name: expect.any(String),
          email: expect.any(String),
        };

        const req: Partial<Request & User> = {
          user: {
            user_id: updatedUserInfo.user_id,
          },
          body: updatedUserInfo,
        };

        const mockedService: Partial<IUserService> = {
          update: jest.fn().mockReturnValue(updatedUserInfo),
        };

        // @ts-ignore
        const userController = new UserController(mockedService);
        // @ts-ignore
        await userController.update(req, res);

        expect(mockedService.update).toHaveBeenCalledWith(
          updatedUserInfo.user_id,
          updatedUserInfo
        );
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith(updatedUserInfo);
      });
    });
  });
});
