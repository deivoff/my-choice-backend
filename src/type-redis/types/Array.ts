import { IWriteAndRead } from 'src/type-redis/types/interfaces';

export default <T>(kind: IWriteAndRead<T>): IWriteAndRead<T[]> => ({
    read: (values: string): T[] => {
      return values.split(',').map(value => kind.read(value))
    },
    write: (values: T[]) => {
      // @ts-ignore
      return values.map(value => kind.write(value)).join(',')
    }
})
