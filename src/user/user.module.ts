import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';


import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';

@Global()
@Module({
  imports: [ConfigModule, TypegooseModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [UserService, TypegooseModule.forFeature([User])],
})
export class UserModule {}
