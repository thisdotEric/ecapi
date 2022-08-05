import express, { Application, Response } from 'express';
import { IApp } from './interfaces/app.interface';
import { Logger, LoggerOptions } from 'pino';

export default class App implements IApp<Application, Logger> {
  readonly server: Application;
  readonly port: number;
  readonly logger: Logger<LoggerOptions>;

  constructor(logger: Logger, port = 3000) {
    this.server = this._setupExpressServer();

    this.port = port;
    this.logger = logger;
  }

  /**
   * run
   */
  public run(): void {
    this.server.listen(this.port, () => {
      this.logger.info(`Server running on port ${this.port}`);
    });
  }

  private _setupExpressServer(): Application {
    const app = express();

    app.get('/', (_, res: Response) => {
      res.send('Ok');
    });

    return app;
  }
}
