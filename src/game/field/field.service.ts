import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PlayerService } from 'src/game/player/player.service';
import { CardService } from 'src/game/card/card.service';
import { Player, PlayerPosition } from 'src/game/player/player.entity';
import { Card } from 'src/game/card/entities/card.entity';
import { FieldType, INNER_FIELDS, OUTER_FIELDS } from 'src/game/field/field.dictionaries';

type FieldResult<C extends Card = Card> = C | number | undefined

@Injectable()
export class FieldService {
  constructor(
    @Inject('PUBLISHER') private readonly  redisClient: Redis,
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly cardService: CardService,
  ) {}


  stoodOnField = async (player: Player): Promise<FieldResult> => {
    const { position, cell: playerCell, gameId, dream, resources } = player;

    switch (true) {
      case position === PlayerPosition.Inner: {
        const [positionType] = INNER_FIELDS
          .find(([_, cells]) => cells.some(cell => cell === playerCell)) || [];
        return await this.cardService.getCardFromDeck(gameId!, positionType!)
      }
      case position === PlayerPosition.Outer: {
        const [positionType, dictionary] = OUTER_FIELDS
          .find(([_, cellsConfig]) => cellsConfig[playerCell!]) || [];

        switch (true) {
          case positionType === FieldType.Dream: {
            if (playerCell === dream && (resources?.white ?? 0) >= dictionary![playerCell!]) return undefined;

            return await this.cardService.getCardFromDeck(gameId!, positionType!)
          }
          case positionType === FieldType.Activity: {
            return dictionary![playerCell!]
          }
          case positionType === FieldType.Problem: {
            return -dictionary![playerCell!]
          }
        }

      }
    }
  }
}
