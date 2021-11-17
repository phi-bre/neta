import type { NetaExtendable } from './index';

export function is_thenable<T>(value: any): value is PromiseLike<T> {
  return typeof value?.then === 'function';
}

export function is_primitive<T>(value: any): value is string | number | bigint | symbol | boolean | null | undefined {
  const type = typeof value;
  return (
    type === 'string' ||
    type === 'number' ||
    type === 'bigint' ||
    type === 'symbol' ||
    type === 'boolean' ||
    value === null ||
    value === undefined
  );
}

/**
 * Recursively normalizes a given value into a thenable form. Resolves synchronously if possible.
 * This is NOT a polyfill for Promise.resolve, as it does not guarantee a Promise in return.
 * @param value the value to be resolved
 */
export function resolve<T>(value: T | PromiseLike<T>): PromiseLike<T> {
  if (is_thenable(value)) {
    return { then: callable => resolve(value.then(callable)) };
  }
  return { then: callable => resolve(callable(value)) };
}

/**
 * The default extension strategy used by neta extendable.
 * Extends the prototype chain and applies all properties of the descriptor.
 * Used internally.
 * @param descriptor
 */
export function extend<T>(this: NetaExtendable<T>, descriptor: Partial<NetaExtendable<T>>): NetaExtendable<T> {
  const instance = describe(this);
  for (const key in descriptor) {
    instance[key] = typeof instance[key]?.extend === 'function'
      ? instance[key].extend(descriptor[key])
      : descriptor[key];
  }
  return instance as any; // TODO: Fix any
}

export function cached<T>(value: T | PromiseLike<T>, equals = (cache: T, value: T) => cache == value) {
  let cache: T;
  return {
    then(callable) {
      return resolve(value).then(value => {
        if (equals(value, cache)) return cache;
        cache = value;
        return value;
      });
    },
  }
}

export function middleware<T extends Function>(prototype: T): PromiseLike<Function> {
  return {
    then(callable) {
      return middleware((...args) => callable(prototype(...args)));
    }
  };
}

export function flattened<T>(value: T | PromiseLike<T>): PromiseLike<T[]> {
  return {
    then(callable) {
      return;
    }
  };
}

export function layered<T extends object>(prototype: T | PromiseLike<T>): PromiseLike<Partial<T>> {
  return {
    then(callable) {
      const instance: Partial<T> = {};
      resolve(prototype).then(prototype => {
        for (const key in prototype) {
          resolve(prototype[key]).then(property => {
            instance[key] = property;
            callable(prototype);
          });
        }
      });
      return layered(callable(instance));
    }
  };
}

layered({
  attrs: layered({
    name: resolve('delayed')
  }),
  created: middleware((element) => {
    console.log('created');
  })
}).then(() => ({
  attrs: {
    another: 10
  },
  created(element) {

    return element;
  },
}));

describe(
  layered({
    attrs: layered({
      name: resolve('delayed')
    }),
  }),
)({
  attrs: {
    another: 10
  }
})

type Reflective<T> = PromiseLike<T> & {
  <R>(descriptor: R | PromiseLike<R>): PromiseLike<R>;
};

/**
 * Creates a new extendable instance with the given initial prototype.
 * Used internally.
 * @param prototype the initial prototype
 */
export function describe<T>(prototype: T | PromiseLike<T>): Reflective<T> {
  const callable: Reflective<T> = (descriptor) => describe(callable.then(() => descriptor));
  callable.then = resolve(prototype).then;
  return callable;
}
