import { neta, snake } from './core';
import { NetaObservable } from './observable';
import { NetaCSS } from './css';
import { NetaHTML } from './html';
import { NetaSVG } from './svg';

export type NetaObserver<T, R = void> = (value: T, prev: T) => R;
export type NetaMountable = { mount(parent: ParentNode): ChildNode };
export type NetaExtendable<D> = { extend(descriptor: D): NetaExtendable<D> };
export type NetaCallable<T extends NetaExtendable<T>> = T & { (descriptor: Partial<T>): NetaCallable<T> };
export type NetaChild = NetaMountable | Node | string | number | boolean | null | undefined;

export const html = neta(new NetaHTML())({ tag: 'div' });
export const svg = neta(new NetaSVG())({ tag: 'svg' });
export const style = neta(new NetaCSS());

export function global(descriptor: Record<string, Partial<NetaCSS>>) {
    return NetaCSS.global(descriptor);
}

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function state<T>(value: T) {
    return new NetaObservable<T>(value);
}

document.head.append(NetaCSS.stylesheet);
