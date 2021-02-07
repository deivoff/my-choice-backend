import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { VkService } from './vk/vk.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [ConfigModule, HttpModule, UserModule],
  providers: [AuthResolver, AuthService, VkService],
  controllers: [AuthController]
})
export class AuthModule {}
