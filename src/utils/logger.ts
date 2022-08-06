import pino, { Logger } from 'pino';
import dayjs from 'dayjs';
import { ILogger } from 'src/interfaces/logger.interface';

export class PinoLogger implements ILogger {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino({
      transport: {
        target: 'pino-pretty',
      },
      base: {
        pid: false,
      },
      timestamp: () => `,"time":"${dayjs().format()}"`,
    });
  }

  info(message = ''): void {
    this.logger.info(message);
  }
  warn(message = ''): void {
    this.logger.warn(message);
  }
  error(message = ''): void {
    this.logger.error(message);
  }
}
