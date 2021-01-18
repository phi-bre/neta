import { element, NetaElement, NetaElementDescriptor } from './element';
import { compose } from './core';

export interface NetaSVGElementDescriptor<T extends keyof SVGElementTagNameMap, E extends SVGElementTagNameMap[T] = SVGElementTagNameMap[T]>
    extends NetaElementDescriptor<E> {
    tag?: T;
}

export type NetaSVGElement<T extends keyof SVGElementTagNameMap = 'svg', E extends SVGElementTagNameMap[T] = SVGElementTagNameMap[T]> =
    NetaElement<E> & {
    tag: T;
    extend<T extends keyof SVGElementTagNameMap>(descriptor: NetaSVGElementDescriptor<T>): NetaSVGElement<T>;
    <T extends keyof SVGElementTagNameMap>(descriptor: NetaSVGElementDescriptor<T>): NetaSVGElement<T>;
}

export const svg = compose<NetaSVGElement>(<NetaSVGElement>element(<NetaElementDescriptor>{
    tag: 'svg',
    create(el?: SVGElement): SVGElement {
        el ||= document.createElementNS('http://www.w3.org/2000/svg', this.tag);
        return element.create.call(this, el);
    },
}));
