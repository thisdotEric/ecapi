import 'dotenv/config';
import { Application } from 'express';
import { IApp } from './interfaces/app.interface';
import App from './server';
import { PinoLogger } from './utils/logger';
import { connect } from './utils/mongo';

const pinoLogger = new PinoLogger();

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await connect();
    } catch (error) {
      pinoLogger.error('Error connecting to the database');
    }
  })();
}

const expressApp: IApp<Application> = new App(pinoLogger);

expressApp.run();
