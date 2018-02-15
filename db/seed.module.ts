import { DatabaseModule } from '../src/modules/core/database/database.module';
import { userProviders } from '../src/modules/user/user.providers';
import { Module } from '@nestjs/common';
import { UserModule } from '../src/modules/user/user.module';
import { UserSeed } from './seeds/user.seed';

@Module({
  modules: [
    DatabaseModule,
    // Add here modules that seed files depend upon
    UserModule,
  ],
  components: [
    // Repository providers
    ...userProviders,
    // Add seed files
    UserSeed,
  ],
})
export class SeedModule {
}
