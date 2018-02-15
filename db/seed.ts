import { config } from 'dotenv';
import { UserSeed } from './seeds/user.seed';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';


init(process.argv.slice(2))
.then(() => process.exit())
.catch(err => {
  console.error(err);
  process.exit(1);
});

async function init(commands: string[]) {
  config();

  const seedModule = await NestFactory.create(SeedModule);

  for (let seedName of commands) {
    // TODO: (mentos1386) get specific seed and run .seed on it
    await seedModule.get(UserSeed).seed();
  }
}
