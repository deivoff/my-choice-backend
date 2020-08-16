import { ObjectId } from 'mongodb';
import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose';

export enum Sex {
  female,
  male,
}

@modelOptions({ schemaOptions: { timestamps: false, collection: 'users' } })
export class UserTest {
  readonly _id!: ObjectId;

  @prop({ required: true })
  id!: string;

  @prop({ required: true })
  createdAt!: string;

  @prop({ required: true })
  firstName!: string;

  @prop()
  middleName?: string;

  @prop({ required: true })
  lastName!: string;

  @prop({ required: true})
  sex!: Sex;

  @prop({ required: true})
  age!: number;

  @prop({ required: true })
  education!: string;

  @prop({ required: true })
  address!: string;

  @prop()
  phone?: number;

  @prop({ required: true })
  email!: string;

  @prop()
  result?: number;

  @prop({ type: Number })
  answers?: Map<string, number>;
}

export type UserTestModel = ReturnModelType<typeof UserTest>;
export const UserTestModel: UserTestModel = getModelForClass(UserTest);
