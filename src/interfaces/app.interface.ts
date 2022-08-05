export interface IApp<TServer, TLogger> {
  readonly server: TServer;
  readonly port: number;
  readonly logger: TLogger;

  run(): void;
}
