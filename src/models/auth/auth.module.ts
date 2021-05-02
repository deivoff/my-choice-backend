import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from 'src/models/auth/auth.service';
import { VkService } from 'src/models/auth/vk/vk.service';
import { AuthResolver } from 'src/models/auth/auth.resolver';
import { UserModule } from 'src/models/user/user.module';
import { AuthController } from 'src/models/auth/auth.controller';

@Module({
  imports: [ConfigModule, HttpModule, UserModule],
  providers: [AuthResolver, AuthService, VkService],
  controllers: [AuthController]
})
export class AuthModule {}
