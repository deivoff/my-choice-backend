export interface IWriteAndRead<T> {
  write: (value: T) => string;
  read: (value: string) => T;
}
export type HashEntityOption<T extends {}> = {
  pk: keyof T,
  expires?: number
}

export interface IHashEntityConfig<T extends {}> extends HashEntityOption<T> {
  fields?: Record<keyof T, {
    type: string,
    isArray?: boolean,
    required?: boolean,
  }>;
}

export interface ITypeRedisHashClass {
  new (...args: any[])
}
