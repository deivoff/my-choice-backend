import { FieldType } from '$components/field';
import { ObjectId } from 'mongodb';
import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

class Choice {
  @prop({ required: true })
  type!: FieldType;

  @prop()
  choiceId!: number;

  @prop()
  id!: number;
}

@modelOptions({ schemaOptions: { timestamps: true} })
class Gamelog {
  readonly _id!: ObjectId;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  @prop({ required: true })
  message!: string;

  @prop({ required: true })
  user!: string;

  @prop()
  room?: string;

  @prop({ _id: false })
  choice?: Choice;

  @prop()
  win?: boolean;

  @prop()
  lose?: boolean;

  @prop()
  hold?: boolean;
}

export type GamelogModel = ReturnModelType<typeof Gamelog>;
export const GamelogModel: GamelogModel = getModelForClass(Gamelog);
