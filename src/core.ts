import { NetaCallable, NetaExtendable, NetaObserver } from './index';

export function neta<P extends NetaExtendable<P>>(prototype: P): NetaCallable<P> {
    const callable = descriptor => neta(prototype.extend(descriptor));
    return Object.setPrototypeOf(callable, prototype);
}

export function extend<P extends object, D extends object>(this: P, descriptor: D): P {
    const instance = Object.create(this);
    for (const key in descriptor) instance[key] = descriptor[key];
    return instance;
}

export function define<T>(key: string, symbol: symbol, value: T, action: NetaObserver<T>, descriptor?: PropertyDescriptor) {
    return Object.defineProperties(this, {
        [symbol]: { value, writable: true },
        [key]: {
            enumerable: descriptor?.enumerable || false,
            set(value) {
                this[symbol] = action(this[symbol], value);
            },
            get() {
                return this[symbol];
            },
        },
    });
}

export function snake(key: string) {
    return key.replace(/[A-Z]/g, '-$&').toLowerCase();
}
