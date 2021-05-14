import { IWriteAndRead } from '../interfaces';

const SEPARATOR = '-A|A-';

export default <T>(kind: IWriteAndRead<T>): IWriteAndRead<T[]> => ({
    read: (values: string): T[] => {
      return values.split(SEPARATOR).map(value => kind.read(value))
    },
    write: (values: T[]) => {
      // @ts-ignore
      return values.map(value => kind.write(value)).join(SEPARATOR)
    }
})
