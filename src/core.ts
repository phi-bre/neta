import type { NetaExtendable, NetaDocument } from './index';
import { fragment } from './element';

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
 * Mounts a neta document to a given target.
 * @param target An object defining the target nodes where body and head should be mounted on
 * @param body The neta element to mount onto the target's body
 * @param head The neta element to mount onto the target's head
 */
export function document({ target = window.document, body, head }: Partial<NetaDocument>) {
    // root.events.create.initEvent('create', false, true);
    // root.events.destroy.initEvent('destroy', false, true);
    target.body.appendChild(fragment([body]));
    target.head.appendChild(fragment([head]));
}

/**
 * The default extension strategy used by neta extendable.
 * Extends the prototype chain and applies all properties of the descriptor.
 * Used internally.
 * @param descriptor
 */
export function extend<T>(this: NetaExtendable<T>, descriptor: Partial<NetaExtendable<T>>) {
    const instance = Object.create(this);
    for (const key in descriptor) {
        instance[key] = this[key] && typeof this[key].extend === 'function'
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
    const instance = descriptor => describe((prototype.extend || extend).call(prototype, descriptor));
    return Object.setPrototypeOf(instance, prototype);
}

// TODO: Create object from actual prototype and new keyword without the need for .setPrototypeOf and .create
// describe.prototype
// describe.extend = extend
