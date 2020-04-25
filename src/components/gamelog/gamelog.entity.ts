import { FieldType } from '$components/field';
import { getModelForClass, prop, ReturnModelType } from '@typegoose/typegoose';

class ChoiceSchema {
  @prop({ required: true })
  type!: FieldType;

  @prop()
  choiceId!: number;

  @prop()
  id!: number;
}

class GamelogSchema {
  @prop({ required: true })
  message!: string;

  @prop({ required: true })
  user!: string;

  @prop()
  room?: string;

  @prop({ _id: false })
  choice?: ChoiceSchema;

  @prop()
  win?: boolean;

  @prop()
  lose?: boolean;

  @prop()
  hold?: boolean;
}

export type GamelogModel = ReturnModelType<typeof GamelogSchema>;
export const GamelogModel: GamelogModel = getModelForClass(GamelogSchema);
