import * as request from 'supertest';
import { config } from 'dotenv';
import { Client } from 'pg';
import LogUtil from '../src/utils/Log.util';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from '../db/seed.module';
import { UserSeed } from '../db/seeds/user.seed';
import { databaseProviders } from '../src/modules/core/database/database.providers';

process.env.NODE_ENV = 'test';

(global as any).dbClient = null;
(global as any).server = '';
(global as any).seed = {};
declare let server, seed, dbClient;

before(async function () {
  this.timeout(200000);

  // load .env config
  config();
  LogUtil.init();

  // cleaning
  // TODO: (mentos1386) we shouldn't use providers directly, we should use nestjs, like the seed.ts
  dbClient = await databaseProviders[0].useFactory();

  // Drops and recreates database
  await dbClient.synchronize(true);

  // Wait until server is up
  let serverResponded = false;
  while (!serverResponded) {
    try {
      await request(server).get('').expect(404);
      serverResponded = true;
    } catch (ignored) {
      console.log('Waiting...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const seedModule = await NestFactory.create(SeedModule);

  console.log(seedModule);

  // TODO: (mentos1386) get specific seed and run .seed on it
  seed.users = await seedModule.get(UserSeed).seed();
});
