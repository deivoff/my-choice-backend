import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as Sentry from '@sentry/node';
import { LogLevel } from '@sentry/types';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  app.useLogger(console);
  Sentry.init({
    dsn: configService.get('sentry.dsn'),
    debug: !configService.get<boolean>('isProd'),
    environment: configService.get<string>('env'),
    release: 'some_release', // must create a release in sentry.io dashboard
    logLevel: LogLevel.Debug, //based on sentry.io loglevel //
    tracesSampleRate: 1.0,
  });

  const port = configService.get<number>('port') || 3000;
  app.setViewEngine({
    engine: {
      pug: require('pug'),
    },
    templates: join(__dirname, '..', 'views'),
  });
  console.log('Port: ', port);
  await app.listen(port);
}
bootstrap();
