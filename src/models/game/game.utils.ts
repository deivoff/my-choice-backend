import { GameSession } from 'src/models/game/game-session/game-session.entity';
import { Types } from "mongoose";
import { Card } from 'src/models/game/card/entities/card.entity';
import { ID, objectIdToString } from 'src/common/scalars/objectId.scalar';

export type UpdateActiveGameVariables = {
  gameId: Types.ObjectId
}

export type CardDroppedPayload = {
  cardDropped: Card,
  gameId: ID,
  userId: ID,
}

export type CardDroppedVariables = {
  gameId: Types.ObjectId
}

export type PlayerChoicePayload = {
  choiceId?: ID,
  cardId: ID,
  gameId: ID,
}

export type UpdateActiveGamePayload = {
  gameId: ID,
  game: GameSession,
}

export type PlayerChoiceVariables = {
  gameId: Types.ObjectId
}

export function filterGameSessionSubscription<P extends { gameId: ID }, V extends { gameId: ID }>(
  payload: P,
  variables: V,
) {
  return objectIdToString(payload.gameId) === objectIdToString(variables.gameId);
}
