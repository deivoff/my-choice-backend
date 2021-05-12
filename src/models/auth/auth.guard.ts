import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { IncomingMessage } from 'http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const { req } = context.getArgByIndex<{ req: IncomingMessage }>(2) || {};

    verify(req?.headers?.authorization || '', this.configService.get<string>('secretKey') || '');
    return true;
  }

}
