import type { NetaElement } from './element';

export type NetaObserver<T, R = void> = (value: T, prev: T) => R;
export type NetaPrimitive = string | number | bigint | boolean | null | undefined;
export type NetaHook<E extends Element> = (this: NetaElement<E>, element: E) => void;
export type NetaChild = NetaElement | Node | NetaPrimitive;

export interface NetaComposition<D, T> {
    extend(descriptor: D): T;
    (descriptor: D): T;
}

export { html, NetaHTMLElement, NetaHTMLElementDescriptor } from './html';
export { svg, NetaSVGElement, NetaSVGElementDescriptor } from './svg';
export { styles, NetaStyles, NetaStylesDescriptor } from './styles';
export { state } from './core';
export * from './helpers';
