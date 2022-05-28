import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { RedisModule } from 'nestjs-redis';
import configuration from './configuration';
import { AuthModule } from './models/auth/auth.module';
import { UserModule } from './models/user/user.module';
import { CommonModule } from './common/common.module';
import { GameModule } from './models/game/game.module';
import { MessageModule } from './models/message/message.module';
import { GameService } from './models/game/game.service';
import { TournamentModule } from './models/tournament/tournament.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'src/dataloader';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
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
            showFriendlyErrorStack: true,
            name: 'publisher',
            ...configuration,
          },
          {
            showFriendlyErrorStack: true,
            name: 'subscriber',
            ...configuration,
          },
        ];
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [GameModule, ConfigModule],
      inject: [GameService, ConfigService],
      useFactory: (gameService: GameService, configService: ConfigService) => ({
        autoSchemaFile: 'schema.gql',
        installSubscriptionHandlers: true,
        playground: true, //!configService.get('isProd'),
        subscriptions: {
          onConnect: (connectionParams) => {
            const authToken = connectionParams['authToken'];
            if (authToken) {
              void gameService.connect(authToken);
            }
            return { authToken };
          },
          onDisconnect: (_, ctx) =>
            ctx?.initPromise?.then((res) => {
              if (typeof res === 'object') {
                void gameService.disconnect(res?.authToken);
              }
            }),
        },
      }),
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const configuration = configService.get('database');
        return {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false,
          ...configuration,
        };
      },
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UserModule,
    GameModule,
    MessageModule,
    TournamentModule,
  ],
})
export class AppModule {}
