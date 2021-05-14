import { DynamicModule, Global, Module } from '@nestjs/common';
import { ITypeRedisHashClass } from './utils/interfaces';

@Global()
@Module({})
export class TypeRedisModule {

  static forHashFeature(module: ITypeRedisHashClass): DynamicModule {
    return {
      module: TypeRedisModule,
    }
  }

}
