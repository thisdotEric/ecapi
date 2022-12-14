import { ILogger } from '../src/interfaces/logger.interface';
import { IProduct } from '../src/modules/product/product.model';
import { ICreateUserInput } from '../src/modules/user/user.model';

export const testLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

export const createUserInput = (): ICreateUserInput => {
  return {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'password',
    confirm_password: 'password',
  };
};

export const createProductInput = (): IProduct => {
  return {
    name: 'new product',
    description: 'product description',
    price: 100.55,
    tags: ['tag1', 'tag2'],
  };
};
