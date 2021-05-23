import { ITypeRedisHashClass, IHashEntityConfig } from './interfaces';
import { hashes, types } from './data';
import arrayConfig from './types/Array';
import * as Redis from 'ioredis';
import { isEmpty, isNil, union } from 'lodash';

type ModelKey<T> = {
  [K in keyof T]: T[K]
}[keyof T]

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface Class<T> {
  new(...args: any[]): T;
}

// @ts-ignore
export class HashModel<C = new (...args: any) => any, T = InstanceType<C>, ID = ModelKey<T>> {

  private readonly collectionName: string;
  private readonly writeId: (id: ID) => string;
  private readonly schema: IHashEntityConfig<T>;

  private stringId = (id: ID) => {
    return `${this.collectionName}:${this.writeId(id)}`;
  };

  constructor(
    name: string,
    private redisClient: Redis.Redis,
  ) {
    this.collectionName = name.toLowerCase();
    const schema = hashes.get(name);

    if (!schema) throw Error(`Hash entity for ${name} not defined!`);
    this.schema = schema;
    const config = types.get(this.schema.fields![this.schema.pk].type);
    if (!config) throw Error(`ID type for ${this.collectionName} not defined!`);
    const { write } = config;

    this.writeId = write;
  }

  private async getAllKeys(cursor: string = '0', keys: string[] = []): Promise<string[]> {
    const [newCursor, newKeys] = await this.redisClient.scan(cursor, 'match', `${this.collectionName}:*`);
    const unionKeys = union(keys, newKeys);

    if (newCursor === '0') {
      return unionKeys;
    }

    return await this.getAllKeys(newCursor, unionKeys)
  }

  private normalizeToRedisRecord = (obj: T): Record<string, string> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const config = this.schema.fields![(key as keyof T)];
      const isNilValue = isNil(value);

      if (config.required && isNilValue) {
        throw Error(`Cannot save non-nullable value in "${this.collectionName}" for field "${key}"!`);
      }

      if (value && config.isArray && !Array.isArray(value)) {
        throw Error(`Cannot save non-array value in "${this.collectionName}" for field "${key}"!`);
      }

      const normalizer = types.get(config.type);

      if (!normalizer) {
        throw Error(`Not found type-writer for value in "${this.collectionName}" for field "${key}"!`);
      }

      acc[key] = isNilValue
        ? ''
        : config.isArray
          ? arrayConfig(normalizer).write(value)
          : normalizer.write(value);

      return acc;
    }, {})
  };

  private normalizeToObject = (record: Record<string, string>): T  => {
    return Object.entries(record).reduce((acc, [key, value]) => {
      const config = this.schema?.fields![(key as keyof T)];
      if (config.required && !value) {
        throw Error(`Cannot get non-nullable value in "${this.collectionName}" for field "${key}"!`);
      }

      const normalizer = types.get(config.type);

      if (!normalizer) {
        throw Error(`Not found type-reader for value in "${this.collectionName}" for field "${key}"!`);
      }

      acc[key] = (isNil(value) || value === '')
        ? undefined
        : config.isArray
          ? arrayConfig(normalizer).read(value)
          : normalizer.read(value);

      return acc;
    }, {} as T)
  };

  private hset = async (id: ID, obj: T) => {
    const stringId = this.stringId(id);
    if (this.schema.expires) {
      await Promise.all([
        this.redisClient.hset(stringId, this.normalizeToRedisRecord(obj)),
        this.redisClient.expire(stringId, this.schema.expires)
      ]);
    } else {
      await this.redisClient.hset(stringId, this.normalizeToRedisRecord(obj));
    }
  };

  public create = async (id: ID, obj: T): Promise<T> => {
    await this.hset(id, obj);

    return await this.findOne(id) as T;
  };

  public delete = async (id: ID) => {
    const stringId = this.stringId(id);
    return await this.redisClient.del(stringId);
  };

  public findOne = async (id: ID): Promise<T | undefined> => {
    const stringId = this.stringId(id);
    const res = await this.redisClient.hgetall(stringId);

    return isEmpty(res) ? undefined : this.normalizeToObject(res)!;
  };

  public findOneAndUpdate = async (
    id: ID,
    updatedFields: Partial<T>,
    merge?: (exist: T, update: Partial<T>) => T,
  ): Promise<T | undefined> => {
    const res = await this.findOne(id);

    if (!res || isEmpty(res)) {
      return undefined;
    }

    const updatedRes: T = merge ? merge(res, updatedFields) : {
      ...res,
      ...updatedFields,
    };

    await this.hset(id, updatedRes);

    return updatedRes;
  };

  public findAll = async () => {
    const keys = await this.getAllKeys();
    return await Promise.all(keys.sort().reverse().map(
      id => this.redisClient.hgetall(id).then(this.normalizeToObject)
    ));
  };

  public findSome = (ids: ID[]): Promise<(T | undefined)[]> => {
    return Promise.all(ids.map(this.findOne))
  };

}

export function createHashServiceFromHashModel<T>(
  hashModel: ITypeRedisHashClass,
  redisClient: Redis.Redis
): HashModel<T> {
  // @ts-ignore
  const modelName = hashModel.name;

  return new HashModel<T>(modelName, redisClient)
}
