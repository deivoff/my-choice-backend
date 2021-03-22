import { Types } from 'mongoose';
import { isNil } from 'lodash';
import { Player } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromResourcesToString, fromStringToResources } from 'src/game/resources/resources.redis-adapter';

enum RedisBoolean {
  true = '1',
  false = '0'
}

function fromRedisBooleanToBoolean(boolean: string): boolean {
  return boolean === ''
    ? false
    : boolean === RedisBoolean.true
}

function fromBooleanToRedisBoolean(boolean?: boolean): RedisBoolean {
  return isNil(boolean) ? RedisBoolean.false : boolean ? RedisBoolean.true : RedisBoolean.false
}

type PlayerRedisAdapter = Omit<Player, '_id' | 'gameId'> & {
  _id: ID;
  gameId?: ID;
}

type PlayerRecord = Omit<Player, '_id' | 'resources' | 'gameId' | 'disconnected' | 'hold'>;


export const fromRedisToPlayer = ({
  winner,
  gameover,
  dream,
  resources,
  gameId,
  disconnected,
  hold,
  _id,
  ...other
  }: Record<string, string>): Player => ({
  ...other as unknown as PlayerRecord,
  _id: Types.ObjectId(_id),
  hold: hold ? Number(hold) : null,
  disconnected: fromRedisBooleanToBoolean(disconnected),
  gameId: gameId ? Types.ObjectId(gameId) : null,
  resources: fromStringToResources(resources),
  dream: dream === '' ? null : Number(dream),
  gameover: fromRedisBooleanToBoolean(gameover),
  winner: fromRedisBooleanToBoolean(winner)
});

export const fromPlayerToRedis = ({
  winner,
  gameover,
  dream,
  resources,
  gameId,
  disconnected,
  hold,
  _id,
  ...other
  }: PlayerRedisAdapter): Record<string, string> => ({
  ...other,
  _id: objectIdToString(_id),
  hold: hold ? String(hold) : '',
  disconnected: fromBooleanToRedisBoolean(disconnected),
  gameId: !gameId ? '' : objectIdToString(gameId),
  resources: fromResourcesToString(resources),
  dream: isNil(dream) ? '' : String(dream),
  gameover: fromBooleanToRedisBoolean(gameover),
  winner: fromBooleanToRedisBoolean(winner),
});
