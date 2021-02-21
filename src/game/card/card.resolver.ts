import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CardService } from 'src/game/card/card.service';
import { Card } from 'src/game/card/entities/card.entity';
import { CreateCardInput } from 'src/game/card/dto/create-card.input';
import { Types } from 'mongoose';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Mutation(() => Card)
  createCard(@Args('createFieldInput') createFieldInput: CreateCardInput) {
    return this.cardService.create(createFieldInput);
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
