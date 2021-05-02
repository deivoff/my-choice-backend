import { IWriteAndRead } from '../interfaces';

function fromNumberToRedis(value: number): string {
  return String(value);
}

function fromRedisToNumber(value: string): number {
  return Number(value);
}

export default {
  read: fromRedisToNumber,
  write: fromNumberToRedis,
} as IWriteAndRead<number>
