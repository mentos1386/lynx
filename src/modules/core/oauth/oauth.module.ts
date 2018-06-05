import { Module } from '@nestjs/common';
import { OAuthFacebookService } from './facebook/facebook.service';
import { OAuthGoogleService } from './google/google.service';

@Module({
  providers: [
    OAuthFacebookService,
    OAuthGoogleService,
  ],
  exports: [
    OAuthFacebookService,
    OAuthGoogleService,
  ],
})
export class OAuthModule {
}
