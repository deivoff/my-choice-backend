import { isNil } from 'lodash';
import { types, hashes } from './data';
import { HashEntityOption } from 'src/type-redis/utils/interfaces';

type ObjectOptions<T> = {
  write: (obj: T) => string;
  read: (redisRecord: string) => T;
};

type Options = {
  type?: any;
  required?: boolean;
};

export function registerDataType<T>(type: (...args) => T, options: ObjectOptions<T>) {
  types.set(type.name, options);
}

export function HashField(options: Options = {}) {
  return (target: any, key: string | symbol) => {
    let isArray = false;
    let returnType;

    if (options?.type) {
      if (Array.isArray(options.type)) {
        isArray = true;
        returnType = options.type[0];
      } else {
        returnType = options.type;
      }
    } else {
      returnType = Reflect.getMetadata("design:type", target, key);
    }

    if (returnType?.name === 'Array' && !isArray) {
      throw Error(`InvalidType in ${String(key)} field! For Array need set type in options!`);
    }

    if (!types.has(returnType.name)) {
      throw Error(`Type ${returnType.name} not registered in ${String(key)} field!`);
    }

    const hashEntity = hashes.get(target.constructor.name);
    const settings = {
      type: returnType.name,
      isArray,
      required: isNil(options.required) ? true : options.required,
    };
    if (!hashEntity) {
      hashes.set(target.constructor.name, {
        pk: '',
        fields: {
          [key]: settings,
        }
      })
    } else {
      // @ts-ignore
      hashEntity.fields[key] = settings
    }
  };
}

export function HashFieldType<T = any>(options: ObjectOptions<T>) {
  return (target: new (...args) => T) => {
    types.set(target.name, options);
  };
}

export function HashEntity<T>(options: HashEntityOption<T>)
export function HashEntity<T>(pk: string & keyof T)
export function HashEntity<T>(options: (string & keyof T) | HashEntityOption<T>) {
  const pk = typeof options === 'string' ? options : (options as HashEntityOption<T>).pk;
  return (target: new (...args) => T) => {
    hashes.set(target.name, {
      ...(hashes.get(target.name) || {}),
      pk,
      expires: typeof options === 'object' ? options.expires : undefined,
    });
  };
}
