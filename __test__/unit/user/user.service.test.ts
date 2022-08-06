import { ICreatedUser } from '../../../src/modules/user/user.model';
import UserService from '../../../src/modules/user/user.service';
import { createUserInput } from '../../helpers';

describe('User Service tests', () => {
  test('should create a new user', async () => {
    const newUserInput = createUserInput();

    const expectedUser: ICreatedUser<number> = {
      id: expect.any(String),
      name: newUserInput.name,
      email: newUserInput.email,
    };

    const userService = new UserService();
    const actualCreatedUser = await userService.create(newUserInput);

    expect(actualCreatedUser).toEqual(expectedUser);
  });
});
