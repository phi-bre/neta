import { element, NetaElement, NetaElementDescriptor } from './element';
import { compose, state } from './core';

export interface NetaHTMLElementDescriptor<T extends keyof HTMLElementTagNameMap, E extends HTMLElementTagNameMap[T] = HTMLElementTagNameMap[T]>
    extends NetaElementDescriptor<E> {
    tag?: T;
    html?: string | PromiseLike<string>;
    text?: string | PromiseLike<string>;
}

export type NetaHTMLElement<T extends keyof HTMLElementTagNameMap = 'div', E extends HTMLElementTagNameMap[T] = HTMLElementTagNameMap[T]> =
    NetaElement<E> & {
    tag: T;
    extend<T extends keyof HTMLElementTagNameMap>(descriptor: NetaHTMLElementDescriptor<T>): NetaHTMLElement<T>;
    <T extends keyof HTMLElementTagNameMap>(descriptor: NetaHTMLElementDescriptor<T>): NetaHTMLElement<T>;
}

export const html = compose<NetaHTMLElement>(<NetaHTMLElement>element(<NetaElementDescriptor>{
    tag: 'div',
    create(el?: HTMLElement): HTMLElement {
        el ||= document.createElement(this.tag);
        state(this.text).then(value => value && (el.innerText = value));
        state(this.html).then(value => value && (el.innerHTML = value));
        return element.create.call(this, el);
    },
}));
