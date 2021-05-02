import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';


import { UserService } from 'src/models/user/user.service';
import { UserResolver } from 'src/models/user/user.resolver';
import { User } from 'src/models/user/entities/user.entity';

@Global()
@Module({
  imports: [ConfigModule, TypegooseModule.forFeature([User])],
  providers: [UserService, UserResolver],
  exports: [UserService, TypegooseModule.forFeature([User])],
})
export class UserModule {}
