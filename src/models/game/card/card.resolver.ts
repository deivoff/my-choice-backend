import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CardService } from 'src/models/game/card/card.service';
import { Card } from 'src/models/game/card/entities/card.entity';
import { Types } from 'mongoose';
import { CreateIncidentCardInput } from 'src/models/game/card/dto/create-incident-card.input';
import { CreateChoicesCardInput } from 'src/models/game/card/dto/create-choices-card.input';
import { FIELD_DICTIONARY } from 'src/models/game/field/field.dictionaries';
import { UpdateChoicesCardInput } from 'src/models/game/card/dto/update-choices-card.input';
import { UpdateIncidentCardInput } from 'src/models/game/card/dto/update-incident-card.input';

@Resolver(() => Card)
export class CardResolver {
  constructor(private readonly cardService: CardService) {}

  @Mutation(() => Card)
  createChoicesCard(@Args('createChoicesCard') createChoicesCard: CreateChoicesCardInput) {
    return this.cardService.createChoicesCard(createChoicesCard);
  }

  @Mutation(() => Card)
  updateChoicesCard(
    @Args('updateChoicesCard') updateChoicesCard: UpdateChoicesCardInput,
    @Args('cardId') cardId: Types.ObjectId,
  ) {
    return this.cardService.updateChoicesCard(cardId, updateChoicesCard);
  }

  @Mutation(() => Card)
  createIncidentCard(@Args('createIncidentCard') createIncidentCard: CreateIncidentCardInput) {
    return this.cardService.createIncidentCard(createIncidentCard);
  }

  @Mutation(() => Card)
  updateIncidentCard(
    @Args('updateIncidentCard') updateIncidentCard: UpdateIncidentCardInput,
    @Args('cardId') cardId: Types.ObjectId,
  ) {
    return this.cardService.updateChoicesCard(cardId, updateIncidentCard);
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

  @ResolveField(() => String)
  typeName(
    @Parent() { type }: Card
  ) {
    return FIELD_DICTIONARY[type]
  }

}
