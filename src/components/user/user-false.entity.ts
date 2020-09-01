import { getModelForClass, modelOptions, prop, ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

@modelOptions({ schemaOptions: { timestamps: false, collection: 'users-false' } })
export class UserFalse {
  readonly _id!: ObjectId;

  @prop({ required: true })
  firstName!: string;

  @prop()
  middleName?: string;

  @prop({ required: true })
  lastName!: string;

  @prop()
  result?: number;
}

export type UserFalseModel = ReturnModelType<typeof UserFalse>;
export const UserFalseModel: UserFalseModel = getModelForClass(UserFalse);
