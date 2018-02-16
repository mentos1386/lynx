import { Connection, Repository } from 'typeorm';
import { DB_CONNECTION_TOKEN } from '../database/database.constants';
import { STORAGE_REPOSITORY_TOKEN } from './storage.constants';
import { StorageRepository } from './storage.repository';

export const storageRepositoryProviders = [
  {
    provide: STORAGE_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getCustomRepository(StorageRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
];
