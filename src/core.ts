import type { NetaExtendable } from './index';

/**
 * Normalizes a given value into a thenable form. Resolves synchronously for non-thenables values.
 * This is NOT a polyfill for Promise.resolve, as it does not guarantee a Promise in return.
 * @param value The value to be resolved
 */
export function resolve<T>(value: T | PromiseLike<T>): PromiseLike<T> {
    return typeof (value as PromiseLike<T>)?.then !== 'function'
        ? { then: callable => resolve(callable(value as T)) }
        : value as PromiseLike<T>;
}

/**
 * The default extension strategy used by neta extendable.
 * Extends the prototype chain and applies all properties of the descriptor.
 * Used internally.
 * @param descriptor
 */
// export function extend<T>(this: NetaExtendable<T>, descriptor: Partial<NetaExtendable<T>>) {
//     const instance = Object.create(this);
//     for (const key in descriptor) {
//         instance[key] = typeof this[key]?.extend === 'function'
//             ? this[key].extend(descriptor[key])
//             : descriptor[key];
//     }
//     return instance;
// }
//
// /**
//  * Creates a new extendable instance with the given initial prototype.
//  * Used internally.
//  * @param prototype The initial prototype
//  */
// export function describe<T>(prototype: Partial<NetaExtendable<T>>): NetaExtendable<T> {
//     return Object.setPrototypeOf(descriptor => {
//         return describe((prototype.extend || extend).call(prototype, descriptor));
//     }, prototype);
// }

export function extend(descriptor) {
    const instance = describe(this);
    for (const key in descriptor) {
        instance[key] = typeof instance[key]?.extend === 'function'
          ? instance[key].extend(descriptor[key])
          : descriptor[key];
    }
    return instance;
}

export function describe(prototype) {
    const neta = descriptor => neta.extend(descriptor);
    return Object.assign(neta, prototype, { prototype, extend: prototype.extend || extend });
}

function asd(descriptor) {
    console.log(asd === this.prototype.extend, this.prototype, descriptor);
    console.dir(this.prototype);
    return this.prototype.extend(descriptor);
}

const a = describe({
    blub: 'test',
})({
    abc: 'abc',
    extend: asd,
})({
    extend(descriptor) {
        console.log(this.prototype.abc, this.prototype.extend === extend);
    },
    asd: 'asd',
})

console.log(a({}));
