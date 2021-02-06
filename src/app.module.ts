import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from '$common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        useUnifiedTopology: true,
        useNewUrlParser: true,
        uri: configService.get<string>('DB_URL'),
        dbName: configService.get<string>('DB_NAME'),
        user: configService.get<string>('DB_USER'),
        pass: configService.get<string>('DB_PASS'),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    AuthModule,
    UserModule,
    ChatModule,
  ],
})
export class AppModule {}
