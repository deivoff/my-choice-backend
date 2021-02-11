import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GameFieldService } from './game-field.service';
import { Field } from './entities/game-field.entity';
import { CreateFieldInput } from './dto/create-game-field.input';
import { Types } from 'mongoose';

@Resolver(() => Field)
export class GameFieldResolver {
  constructor(private readonly gameFieldService: GameFieldService) {}

  @Mutation(() => Field)
  createGameField(@Args('createFieldInput') createFieldInput: CreateFieldInput) {
    return this.gameFieldService.create(createFieldInput);
  }

  @Query(() => [Field], { name: 'fields' })
  findAll() {
    return this.gameFieldService.findAll();
  }

  @Query(() => Field, { name: 'field' })
  findOne(@Args('_id', { type: () => Types.ObjectId }) _id: string) {
    return this.gameFieldService.findOne(_id);
  }

}
