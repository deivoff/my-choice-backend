import { DynamicModule, Global, Module } from '@nestjs/common';
import { ITypeRedisHashClass } from './utils/interfaces';
import * as Redis from 'ioredis';

type PublisherClient = {
  publisher: Redis.Redis;
}

type TypeRedisModuleAsyncOptions = {
  inject: any[]
  useFactory: (...args: any[]) => PublisherClient;
}

@Global()
@Module({})
export class TypeRedisModule {
  private static publisher: Redis.Redis;

  static forRootAsync(options: TypeRedisModuleAsyncOptions): DynamicModule {
    return {
      module: TypeRedisModule,
    }
  }

  static forHashFeature(module: ITypeRedisHashClass): DynamicModule {
    return {
      module: TypeRedisModule,
    }
  }

}
