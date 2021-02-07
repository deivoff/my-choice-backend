import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [ConfigModule]
})
export class AuthModule {}
