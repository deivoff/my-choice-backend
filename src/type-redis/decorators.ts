type ObjectOptions<T> = {
  write: (obj: T) => string;
  read: (redisRecord: string) => T;
};

type Options = {
  type?: any;
  required?: boolean;
};
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

    console.log("HashField: ", { key, returnType, isArray });
  };
}

export function HashFieldType<T = any>(options: ObjectOptions<T>) {
  return (target: new (...args) => T) => {
    console.log("HashFieldType: ", { target });
  };
}

export function HashEntity<T>(pk: keyof T) {
  return (target: new (...args) => T) => {
    console.log("HashEntity: ", { target, pk });
  };
}
