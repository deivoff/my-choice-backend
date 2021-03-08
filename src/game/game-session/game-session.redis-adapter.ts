import { GameSession } from 'src/game/game-session/game-session.entity';
import { ID, objectIdToString } from 'src/utils';
import { Types } from 'mongoose';

type GameSessionRedisAdapter = Omit<GameSession, '_id' | 'creator' | 'players' | 'observers'> & {
  _id: ID;
  creator: ID;
  players?: ID[];
  observers?: ID[];
}

type GameSessionRecord = Omit<GameSession, '_id' | 'creator' | 'players' | 'observers'>;

function fromIDsToString(ids?: ID[]):string {
  if (!ids?.length) return '';
  return ids.map(objectIdToString).join()
}

export const fromRedisToGameSession = ({
  _id,
  creator,
  players,
  observers,
  ...other
}: Record<string, string>): GameSession => ({
  ...other as unknown as GameSessionRecord,
  _id: Types.ObjectId(_id),
  creator: Types.ObjectId(creator),
  players: players.split(','),
  observers: observers.split(',')
});

export const fromGameSessionToRedis = ({
  _id,
  creator,
  players,
  observers,
  ...other
  }: GameSessionRedisAdapter): Record<string, string> => ({
  ...other,
  _id: objectIdToString(_id),
  creator: objectIdToString(creator),
  players: fromIDsToString(players),
  observers: fromIDsToString(observers),
});
