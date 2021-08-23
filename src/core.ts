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
export function extend<T>(this: NetaExtendable<T>, descriptor: Partial<NetaExtendable<T>>) {
    const instance = Object.create(this);
    instance.prototype = this;
    for (const key in descriptor) {
        instance[key] = typeof this[key]?.extend === 'function'
            ? this[key].extend(descriptor[key])
            : descriptor[key];
    }
    return instance;
}

/**
 * Creates a new extendable instance with the given initial prototype.
 * Used internally.
 * @param prototype The initial prototype
 */
export function describe<T>(prototype: Partial<NetaExtendable<T>>): NetaExtendable<T> {
    prototype.extend ||= extend;
    const instance = descriptor => describe((prototype.extend).call(prototype, descriptor));
    return Object.setPrototypeOf(instance, prototype);
}
