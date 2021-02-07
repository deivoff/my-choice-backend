import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';


import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';

@Module({
  imports: [ConfigModule, TypegooseModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
