import { prop } from '@typegoose/typegoose';
import { Field, Int, InterfaceType, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { FIELD_DICTIONARY, FieldType } from 'src/game/field/field.dictionaries';
import { Resources } from 'src/game/resources/resources.entity';

const CHOICES_CARD = [FieldType.Dream, FieldType.Situation, FieldType.Reaction, FieldType.Offer];

@ObjectType()
export class Option {

  @Field()
  readonly _id: Types.ObjectId;

  @Field()
  @prop()
  description: string;

  @Field(() => Resources)
  @prop({ _id: false, type: Resources })
  resources: Resources

}

@ObjectType()
export class Result {

  @Field(() => FieldType, { nullable: true })
  @prop()
  move?: FieldType;

  @Field(() => Resources, { nullable: true })
  @prop({ _id: false, type: Resources })
  resources?: Resources;

  @Field(() => Int, { nullable: true })
  @prop()
  hold?: number;

  @Field(() => Boolean, { nullable: true })
  @prop()
  gameover?: boolean;

}

@ObjectType()
export class Action {

  @Field(() => Resources, { nullable: true})
  @prop({ _id: false, type: Resources })
  less?: Resources;

  @Field(() => Resources, { nullable: true})
  @prop({ _id: false, type: Resources })
  more?: Resources;

  @Field(() => Result, { nullable: true})
  @prop({ _id: false, type: Result })
  result: Result

}

@InterfaceType({
  resolveType: args => {
    return CHOICES_CARD.includes(args.type) ? ChoiceCard.name : args.type;
  }
})
export class Card {

  @Field()
  readonly _id: Types.ObjectId;

  @Field(() => FieldType)
  type: FieldType;

  @Field()
  @prop()
  description: string;

}

@ObjectType({
  implements: [Card],
})
export class ChoiceCard extends Card {

  @Field(() => [Option])
  @prop({ type: [Option] })
  choices: Option[]

}

@ObjectType({
  implements: [Card]
})
export class Incident extends Card {

  @Field(() => Action)
  @prop({ _id: false })
  action: Action;

}

@ObjectType()
export class DroppedCard {

  @Field()
  forPlayer: Types.ObjectId;

  @Field()
  card: Card;

}

export class Opportunity extends Card {}
export class Dream extends ChoiceCard {}
export class Situation extends ChoiceCard {}
export class Reaction extends ChoiceCard {}
export class Offer extends ChoiceCard {}

