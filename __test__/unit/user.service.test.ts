import { ICreatedUser } from '../../src/modules/user/user.model';
import UserService from '../../src/modules/user/user.service';
import { createUserInput } from '../helpers';

describe('User Service tests', () => {
  test('should create a new user', async () => {
    const newUserInput = createUserInput();

    const expectedUser: ICreatedUser<number> = {
      id: 1,
      name: newUserInput.name,
      email: newUserInput.email,
    };

    const userService = new UserService();

    const actualCreatedUser = await userService.create(newUserInput);

    expect(actualCreatedUser.id).toBeDefined();
    expect(actualCreatedUser.id).toBeGreaterThan(0);
    expect(actualCreatedUser.name).toBe(expectedUser.name);
    expect(actualCreatedUser.email).toBe(expectedUser.email);
  });
});
