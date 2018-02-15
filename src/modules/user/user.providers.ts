import { Connection } from 'typeorm';
import { USER_REPOSITORY_TOKEN } from './user.constants';
import { DB_CONNECTION_TOKEN } from '../core/database/database.constants';
import { UserRepository } from './user.repository';

export const userProviders = [
  {
    provide: USER_REPOSITORY_TOKEN,
    useFactory: (connection: Connection) => connection.getCustomRepository(UserRepository),
    inject: [DB_CONNECTION_TOKEN],
  },
];
