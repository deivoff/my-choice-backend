import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PlayerService } from 'src/game/player/player.service';
import { CardService } from 'src/game/card/card.service';
import { Player, PlayerPosition } from 'src/game/player/player.entity';
import { Card } from 'src/game/card/entities/card.entity';
import { FieldType, INNER_FIELDS, OUTER_FIELDS } from 'src/game/field/field.dictionaries';
import { OpportunityCardType } from 'src/game/card/entities/opportunity.utils';
import { Resources } from 'src/game/resources/resources.entity';

type FieldResult<C extends Card = Card> = {
  card?: C,
  white?: number,
  winner?: boolean,
}

@Injectable()
export class FieldService {
  constructor(
    @Inject('PUBLISHER') private readonly  redisClient: Redis,
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly cardService: CardService,
  ) {}

  private checkOuterMove = ({ white = 0, lives = 0, money = 0 }: Resources) => {
    return (((lives! + 6) >= 10 && white! >= 10)
      || (lives! >= 10 && (white! + 6) >= 10)
      || ((lives! + 6) >= 15 && money! >= 100))
  };

  stoodOnField = async (player: Player): Promise<FieldResult> => {
    const {
      position,
      cell: playerCell,
      gameId,
      dream,
      resources = {}
    } = player;

    const {
      white = 0,
      dark = 0,
      money = 0,
      lives = 0,
    } = resources!;

    switch (position) {
      case PlayerPosition.Inner: {
        const [positionType] = INNER_FIELDS
          .find(([_, cells]) => cells.some(cell => cell === playerCell)) || [];

        switch (positionType) {
          case FieldType.Opportunity: {
            if (dark) {
              return {
                card: this.cardService.getOpportunityCard(OpportunityCardType.darkFail)
              }
            } else {
              if ((lives! >= 10 && white! >= 10) || (lives! >= 15 && money! >= 100)) {
                return {
                  card: this.cardService.getOpportunityCard(OpportunityCardType.success)
                }
              } else if (this.checkOuterMove({ white, lives, money })) {
                return {
                  card: this.cardService.getOpportunityCard(OpportunityCardType.tryYourLuck)
                }
              } else {
                return {
                  card: this.cardService.getOpportunityCard(OpportunityCardType.resourcesFail)
                }
              }
            }
          }
          default: {
            const card = await this.cardService.getCardFromDeck(gameId!, positionType!);
            return {
              card
            }
          }
        }
      }
      default: {
        const [positionType, dictionary] = OUTER_FIELDS
          .find(([_, cellsConfig]) => cellsConfig[playerCell!]) || [];

        switch (positionType) {
          case FieldType.Activity: {
            return {
              white: dictionary![playerCell!]
            }
          }
          case FieldType.Problem: {
            return {
              white: -dictionary![playerCell!]
            }
          }
          default: {
            if (playerCell === dream && (white ?? 0) >= dictionary![playerCell!]) return {
              winner: true
            };

            const card = await this.cardService.getCardFromDeck(gameId!, positionType!);
            return {
              card
            }
          }
        }

      }
    }
  }
}
