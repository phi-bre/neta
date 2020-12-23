export function neta(prototype = { extend }) {
    const fn = descriptor => neta(prototype.extend(descriptor));
    return Object.setPrototypeOf(fn, prototype);
}

export function extend(descriptor: object): object {
    const instance = Object.create(this);
    for (const key in descriptor) {
        instance[key] = descriptor[key];
    }
    return instance;
}

export function define(key: string, symbol: symbol, value: any, action, descriptor?: PropertyDescriptor) {
    Object.defineProperties(this, {
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
    return this;
}

export function snake(key: string) {
    return key.replace(/[A-Z]/g, '-$&').toLowerCase();
}
