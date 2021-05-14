import { IHashEntityConfig, IWriteAndRead } from './interfaces';
import primitives from './types/primitive';

export const types = new Map<string, IWriteAndRead<any>>(Object.entries(primitives));

export const hashes = new Map<string, IHashEntityConfig<any>>();
