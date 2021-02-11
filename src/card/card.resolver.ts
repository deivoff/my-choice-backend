import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CardService } from './card.service';
import { Card } from './entities/card.entity';
import { CreateCardInput } from './dto/create-card.input';
import { Types } from 'mongoose';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly gameFieldService: CardService) {}

  @Mutation(() => Card)
  createGameField(@Args('createFieldInput') createFieldInput: CreateCardInput) {
    return this.gameFieldService.create(createFieldInput);
  }

  @Query(() => [Card], { name: 'cards' })
  findAll() {
    return this.gameFieldService.findAll();
  }

  @Query(() => Card, { name: 'card' })
  findOne(@Args('_id', { type: () => Types.ObjectId }) _id: string) {
    return this.gameFieldService.findOne(_id);
  }

}
