import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Module({
  components: [
    CryptoService,
  ],
  exports: [
    CryptoService,
  ],
})
export class CryptoModule {
}
