import 'dotenv/config';
import { Application } from 'express';
import { Logger as PinoLogger } from 'pino';
import { IApp } from './interfaces/app.interface';
import App from './server';
import logger from './utils/logger';

const expressApp: IApp<Application, PinoLogger> = new App(logger);

expressApp.run();
