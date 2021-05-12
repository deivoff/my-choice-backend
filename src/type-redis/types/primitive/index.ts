import RedisBoolean from './Boolean';
import RedisNumber from './Number';
import { IWriteAndRead } from 'src/type-redis/types/interfaces';

export default {
  Number: RedisNumber,
  Boolean: RedisBoolean,
  String: {
    write: value => value,
    read: value => value
  } as IWriteAndRead<string>
}
