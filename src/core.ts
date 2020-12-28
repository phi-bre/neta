import { NetaCallable, NetaExtendable } from './index';

export function callable<P extends NetaExtendable<P>>(prototype: P): NetaCallable<P> {
    const call = descriptor => callable(prototype.extend(descriptor));
    return Object.setPrototypeOf(call, prototype);
}

export function compose<T extends NetaExtendable<T>>(prototype): NetaCallable<T> {
    prototype.extend ||= extend;
    for (const key in prototype) if (prototype[key].extend) {
        define.call(prototype, key, prototype[key]);
    }
    return callable(prototype);
}

export function extend<P extends object, D extends object>(this: P, descriptor: D): P {
    const instance = Object.create(this);
    for (const key in descriptor) instance[key] = descriptor[key];
    return instance;
}

export function define<T>(key: string, value: T, symbol = 'neta:' + key) {
    return Object.defineProperties(this, {
        [symbol]: { value, writable: true },
        [key]: {
            enumerable: true,
            set(value) {
                this[symbol] = this[symbol]?.extend?.(value);
            },
            get() {
                return this[symbol];
            },
        },
    });
}

export function normalize(attribute, action) {
    if (typeof attribute?.then === 'function') {
        attribute.then(action);
    } else if (attribute) {
        action(attribute);
    }
}

export function snake(key: string) {
    return key.replace(/[A-Z]/g, '-$&').toLowerCase();
}
