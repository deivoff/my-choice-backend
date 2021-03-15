import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CardService } from 'src/game/card/card.service';
import { Card } from 'src/game/card/entities/card.entity';
import { ChoicesCardInput } from 'src/game/card/dto/create-card.input';
import { Types } from 'mongoose';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Mutation(() => Card)
  createChoicesCard(@Args('createChoicesCard') createChoicesCard: ChoicesCardInput) {
    return this.cardService.createChoicesCard(createChoicesCard);
  }

  @Mutation(() => Card)
  removeCard(
    @Args('cardId') cardId: Types.ObjectId
  ) {
    return this.cardService.remove(cardId)
  }

  @Query(() => [Card], { name: 'cards' })
  findAll() {
    return this.cardService.findAll();
  }

  @Query(() => Card, { name: 'card' })
  findOne(@Args('_id', { type: () => Types.ObjectId }) _id: Types.ObjectId) {
    return this.cardService.findOne(_id);
  }

}
