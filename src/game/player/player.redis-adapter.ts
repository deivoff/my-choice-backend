import { Types } from 'mongoose';
import { Player } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';
import { fromResourcesToString, fromStringToResources } from 'src/game/resources/resources.redis-adapter';
import { isNil } from '@nestjs/common/utils/shared.utils';

enum Connection {
  Disconnect = '1',
  Connect = '0'
}

type PlayerRedisAdapter = Omit<Player, '_id' | 'gameId'> & {
  _id: ID;
  gameId?: ID;
}

type PlayerRecord = Omit<Player, '_id' | 'resources' | 'gameId' | 'disconnected' | 'hold'>;


export const fromRedisToPlayer = ({
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
  disconnected: disconnected === Connection.Disconnect,
  gameId: gameId ? Types.ObjectId(gameId) : null,
  resources: fromStringToResources(resources),
  dream: dream === '' ? null : Number(dream),
});

export const fromPlayerToRedis = ({
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
  disconnected: disconnected ? Connection.Disconnect : Connection.Connect,
  gameId: !gameId ? '' : objectIdToString(gameId),
  resources: fromResourcesToString(resources),
  dream: isNil(dream) ? '' : String(dream)
});
