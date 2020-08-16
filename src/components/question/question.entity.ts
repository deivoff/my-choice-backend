import { ObjectId } from 'mongodb';
import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

class Answer {
  @prop({ required: true })
  value!: number;

  @prop({ required: true })
  label!: string;
}

@modelOptions({ schemaOptions: { timestamps: false } })
class Question {
  readonly _id!: ObjectId;

  @prop({ required: true })
  id!: number;

  @prop({ required: true })
  video!: string;

  @prop({ required: true })
  question!: string;

  @prop({ required: true, _id: false, type: Answer })
  values!: Answer[];

  @prop({ required: true })
  correct!: number;

}

export type QuestionModel = ReturnModelType<typeof Question>;
export const QuestionModel: QuestionModel = getModelForClass(Question);
