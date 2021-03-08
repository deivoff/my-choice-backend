import { Types } from 'mongoose';
import { Resources } from 'src/game/resources/resources.entity';
import { Player } from 'src/game/player/player.entity';
import { ID, objectIdToString } from 'src/utils';

enum Connection {
  Disconnect = '1',
  Connect = '0'
}

type PlayerRedisAdapter = Omit<Player, '_id' | 'gameId'> & {
  _id: ID;
  gameId?: ID;
}

type PlayerRecord = Omit<Player, '_id' | 'resources' | 'gameId' | 'disconnected' | 'hold'>;
function fromStringToResources(resources?: string | null): Resources | null {
  if (!resources) return null;
  const [white, dark, money, lives] = resources.split(',');

  return {
    white: white ? Number(white) : null,
    dark: dark ? Number(dark) : null,
    money: money ? Number(money) : null,
    lives: lives ? Number(lives) : null
  };
}

function fromResourcesToString(resources?: Resources | null): string {
  if (!resources) return '';
  const { white, dark, money, lives} = resources;
  return [white, dark, money, lives].join();
}

export const fromRedisToPlayer = ({
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
});

export const fromPlayerToRedis = ({
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
});
