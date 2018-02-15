import { DB_CONNECTION_TOKEN } from './database.constants';
import { createConnection } from 'typeorm';

export const databaseProviders = [
  {
    provide: DB_CONNECTION_TOKEN,
    useFactory: async () => {
      // Configuration is loaded from .env file automatically
      return await createConnection();
    },
  },
];
