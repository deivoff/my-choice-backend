import { IWriteAndRead } from '../interfaces';

export enum RedisBoolean {
  true = '1',
  false = '0'
}

function fromRedisBooleanToBoolean(value: string): boolean {
  return value === ''
    ? false
    : value === RedisBoolean.true
}

function fromBooleanToRedisBoolean(value?: boolean | null): RedisBoolean {
  return value ? RedisBoolean.true : RedisBoolean.false
}

export default {
  read: fromRedisBooleanToBoolean,
  write: fromBooleanToRedisBoolean,
} as IWriteAndRead<boolean>
