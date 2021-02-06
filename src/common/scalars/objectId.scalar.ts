import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { Types } from 'mongoose';


@Scalar('ObjectId', () => Types.ObjectId)
export class ObjectIdScalar implements CustomScalar<string, Types.ObjectId> {
  description = 'Mongo objectId scalar type';

  parseValue(value: string) {
    return new Types.ObjectId(value);
  }

  serialize(value: Types.ObjectId) {
    return value.toHexString(); // value sent to the client
  }

  parseLiteral(ast: ValueNode) {
    if (ast.kind === Kind.STRING) {
      return new Types.ObjectId(ast.value); // value from the client query
    }
    return null;
  }

}
