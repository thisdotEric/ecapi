import { ILogger } from './logger.interface';
export interface IApp<TServer> {
  readonly server: TServer;
  readonly port: number;
  readonly logger: ILogger;

  run(): void;
}
