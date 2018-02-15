
import { Connection } from 'typeorm';

declare let dbClient: Connection;

after(() => dbClient.close());
