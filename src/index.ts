import { neta, snake } from './core';
import { NetaObservable } from './observable';
import { NetaCSS } from './css';
import { NetaHTML } from './html';
import { NetaSVG } from './svg';

export interface NetaObserver<T, R = void> {
    (value: T, prev: T): R;
}

export function html(descriptor: Partial<NetaHTML>) {
    return neta(new NetaHTML())({ tag: 'div' })(descriptor) as unknown as typeof html & NetaHTML;
}

export function svg(descriptor: Partial<NetaSVG>) {
    return neta(new NetaSVG())({ tag: 'svg' })(descriptor) as unknown as NetaSVG & typeof svg;
}

export function style(descriptor: Partial<NetaCSS>) {
    return neta(new NetaCSS())(descriptor) as unknown as NetaCSS & typeof html;
}

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function state<T>(value: T) {
    return new NetaObservable<T>(value);
}

document.head.append(NetaCSS.stylesheet);
