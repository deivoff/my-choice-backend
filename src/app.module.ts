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
    GraphQLModule.forRootAsync({
      imports: [GameModule],
      inject: [GameService],
      useFactory: (gameService: GameService) => ({
        autoSchemaFile: 'schema.gql',
        installSubscriptionHandlers: true,
        subscriptions: {
          onConnect: (connectionParams) => {
            const authToken = connectionParams['authToken'];
            if (authToken) {
              gameService.connect(authToken);
            }
            return ({ authToken });
            },
          onDisconnect: ( _ ,ctx) => ctx?.initPromise?.then(res => {
            if (typeof res === 'object') {
              gameService.disconnect(res?.authToken)
            }
          }),
        }
      }),
    }),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        ...configService.get<ReturnType<typeof configuration>['database']>('database')!
      }),
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
