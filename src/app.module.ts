import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';

import configuration from './configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { GameModule } from './game/game.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const configuration = configService.get('redis');
        return [
          {
            name:'publisher',
            ...configuration
          },
          {
            name:'subscriber',
            ...configuration
          },
        ]
      },
      inject:[ConfigService]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        useUnifiedTopology: true,
        useNewUrlParser: true,
        ...configService.get('database')
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UserModule,
    GameModule,
    MessageModule,
  ],
})
export class AppModule {}
