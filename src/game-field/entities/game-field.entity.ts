import { prop } from '@typegoose/typegoose';
import { Field as GQLField, Int, InterfaceType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';

export enum FieldType {
  Start = 'Start',
  Situation = 'Situation',
  Incident = 'Incident',
  Offer = 'Offer',
  Reaction = 'Reaction',
  Opportunity = 'Opportunity',
  DreamTest = 'Dream',
  Activity = 'Activity',
  Problem = 'Problem'
}

registerEnumType(FieldType, {
  name: 'FieldType',
});

export const FIELD_DICTIONARY = {
  [FieldType.Situation]: 'Ситуация',
  [FieldType.Incident]: 'Случай',
  [FieldType.Offer]: 'Предложение',
  [FieldType.Reaction]: 'Реакция',
  [FieldType.Opportunity]: 'Возможность',
  [FieldType.DreamTest]: 'Мечта-тест',
  [FieldType.Activity]: 'Активность',
  [FieldType.Problem]: 'Проблема',
};

@ObjectType()
export class Resources {

  @GQLField(() => Int, { nullable: true })
  @prop()
  lives?: number;

  @GQLField(() => Int, { nullable: true })
  @prop()
  money?: number;

  @GQLField(() => Int, { nullable: true })
  @prop()
  white?: number;

  @GQLField(() => Int, { nullable: true })
  @prop()
  dark?: number;

}

@ObjectType()
export class Option {

  @GQLField()
  readonly _id: Types.ObjectId;

  @GQLField()
  @prop()
  description: string;

  @GQLField()
  @prop({ _id: false })
  resources: Resources

}

@ObjectType()
export class Result {

  @GQLField(() => FieldType, { nullable: true })
  @prop()
  move?: FieldType;

  @GQLField({ nullable: true })
  @prop()
  resources?: Resources;

  @GQLField(() => Int, { nullable: true })
  @prop()
  hold?: number;

  @GQLField({ nullable: true })
  @prop({ default: true })
  gameover?: true;
}

@ObjectType()
export class Action {

  @GQLField({ nullable: true })
  @prop({ _id: false })
  less?: Resources;

  @GQLField({ nullable: true })
  @prop({ _id: false })
  more?: Resources;

  @GQLField()
  @prop({ _id: false })
  result: Result

}

@InterfaceType()
export class Field {

  @GQLField()
  readonly _id: Types.ObjectId;

  readonly type: FieldType;

  @GQLField()
  get typeName(): string {
    return FIELD_DICTIONARY[this.type]
  }

  @GQLField()
  @prop()
  description: string;

}

@ObjectType({
  implements: [Field],
})
export class ChoiceField extends Field {

  @GQLField(() => [Option])
  @prop({ type: [Option] })
  choices: Option[]

}

@ObjectType({
  implements: [Field]
})
export class Incident extends Field {

  @GQLField()
  @prop()
  action: Action;

}

export class DreamTest extends ChoiceField {}
export class Situation extends ChoiceField {}
export class Reaction extends ChoiceField {}
export class Offer extends ChoiceField {}

@ObjectType({
  implements: [Field],
})
export class Opportunity extends Field {}

