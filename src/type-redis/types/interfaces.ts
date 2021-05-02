export interface IWriteAndRead<T> {
  write: (value: T) => string;
  read: (value: string) => T;
}
