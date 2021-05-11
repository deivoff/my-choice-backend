import { GameSession } from 'src/models/game/game-session/game-session.entity';
import { Types } from 'mongoose';
import { ID, objectIdToString } from 'src/common/scalars/objectId.scalar';

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

function fromStringToIDs(idsString?: string) {
  return idsString?.split(',').filter(Boolean) ?? []
}

export const fromRedisToGameSession = ({
  _id,
  creator,
  players,
  observers,
  tournament,
  ...other
}: Record<string, string>): GameSession => ({
  ...other as unknown as GameSessionRecord,
  _id: Types.ObjectId(_id),
  creator: Types.ObjectId(creator),
  players: fromStringToIDs(players),
  observers: fromStringToIDs(observers),
  tournament: tournament ? Types.ObjectId(tournament) : undefined,
});

export const fromGameSessionToRedis = ({
  _id,
  creator,
  players,
  observers,
  tournament,
  ...other
  }: GameSessionRedisAdapter): Record<string, string | any> => ({
  ...other,
  _id: objectIdToString(_id),
  creator: objectIdToString(creator),
  players: fromIDsToString(players),
  observers: fromIDsToString(observers),
  tournament: tournament ? objectIdToString(tournament) : '',
});
