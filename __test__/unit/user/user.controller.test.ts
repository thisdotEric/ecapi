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
});
