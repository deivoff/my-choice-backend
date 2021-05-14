import RedisBoolean from './Boolean';
import RedisNumber from './Number';
import { IWriteAndRead } from '../../interfaces';

export default {
  Number: RedisNumber,
  Boolean: RedisBoolean,
  String: {
    write: value => value,
    read: value => value
  } as IWriteAndRead<string>
}
