import { ILogger } from '../src/interfaces/logger.interface';

export const testLogger: ILogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
