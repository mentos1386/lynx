import * as Raven from 'raven';

export interface IRavenConfig {
  dsn: string;
  options: Raven.ConstructorOptions;
}
