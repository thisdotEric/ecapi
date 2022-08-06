import 'dotenv/config';
import { Application } from 'express';
import { IApp } from './interfaces/app.interface';
import App from './server';
import { PinoLogger } from './utils/logger';

const pinoLogger = new PinoLogger();

const expressApp: IApp<Application> = new App(pinoLogger);

expressApp.run();
