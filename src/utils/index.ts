import { Types } from 'mongoose';

export type ID = string | Types.ObjectId;
export function objectIdToString(objectId: ID) {
  return typeof objectId === 'string' ? objectId : objectId.toHexString()
}
