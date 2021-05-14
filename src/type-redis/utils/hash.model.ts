import { ITypeRedisHashClass, IHashEntityConfig } from './interfaces';
import { hashes } from './data';

// class HashModel<T, PK = keyof T, ID = T[PK]> {
//
//   private readonly collectionName: string;
//   private readonly schema: IHashEntityConfig<T>;
//
//   private key(id: string) {
//     return `${this.collectionName}:${id}`;
//   }
//
//   constructor(
//     name: string,
//   ) {
//     this.collectionName = name;
//     const schema = hashes.get(name);
//
//     if (!schema) throw Error(`Hash entity for ${name} not defined!`);
//     this.schema = schema;
//   }
//
//   public findOne(id: ID): T {
//
//   }
//
//
// }

// export function createHashServiceFromHashModel<T>(hashModel: ITypeRedisHashClass): HashModel<T> {
//   const modelName = hashModel.name;
//
//   return new HashModel<T>(modelName)
// }
