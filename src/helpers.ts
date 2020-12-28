import { NetaObservable } from './observable';
import { snake } from './core';

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function state<T>(value: T) {
    return new NetaObservable<T>(value);
}
