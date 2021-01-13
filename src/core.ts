import { NetaCallable, NetaChild, NetaCreatable, NetaExtendable, NetaPrimitive } from './index';
import { NetaObservable } from './observable';

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
                this[symbol] = this[symbol].extend(value);
            },
            get() {
                return this[symbol];
            },
        },
    });
}

export function text(value: NetaPrimitive): Text {
    return document.createTextNode(((value !== true && value) || '').toString());
}

export function node(value: NetaChild): Node | Element | Text {
    return typeof (value as NetaCreatable)?.create === 'function'
        ? (value as NetaCreatable).create()
        : value instanceof Node
            ? value : text(value as string);
}

export function snake(key: string) {
    return key.replace(/[A-Z]/g, '-$&').toLowerCase();
}

export function state<T>(value: T | PromiseLike<T>): NetaObservable<T> {
    if (value instanceof Promise) {
        const observable = new NetaObservable(undefined);
        Promise.resolve(value).then(observable.set);
        return observable;
    } else if (value instanceof NetaObservable) {
        return value;
    } else {
        return new NetaObservable(value as T);
    }
}
