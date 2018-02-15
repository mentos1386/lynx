import { Connection, Repository } from 'typeorm';
import { DB_CONNECTION_TOKEN } from '../core/database/database.constants';
import { FILE_REPOSITORY_TOKEN } from './file.constants';
import { FileRepository } from './file.repository';

export const fileProviders = [
  {
    provide: FILE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getCustomRepository(FileRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
];
