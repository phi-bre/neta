export { describe, resolve } from './core';
export { element } from './element';
export { state } from './state';
export { document } from './document';

export type NetaObserver<T, R = any> = (value: T) => R;
export type NetaPrimitive = string | number | bigint | boolean | null | undefined;
export type NetaChild = PromiseLike<NetaChild> | Array<NetaChild> | Node | NetaPrimitive;

export interface NetaDocument {
    body?: NetaChild;
    head?: NetaChild;
    target: Document;
}

export interface NetaObservable<T> extends PromiseLike<T> {
    observers: Set<NetaObserver<T>>;
    value: T;
    set(value: T): NetaObservable<T>;
    then<R>(observer: NetaObserver<T, R>): NetaObservable<R>;
}

export type NetaExtendable<P, D = Partial<P>> = P & {
    extend(descriptor: D): NetaExtendable<P>;
    (descriptor: D): NetaExtendable<P>;
};

export type NetaElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;
export type NetaElement<K extends keyof NetaElementTagNameMap = 'div'> =
    NetaExtendable<PromiseLike<NetaElementTagNameMap[K]> & Required<NetaElementDescriptor<K>>>;
export type NetaElementDescriptor<K extends keyof NetaElementTagNameMap> = {
    namespace?: string | undefined;
    tag?: keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
    text?: NetaPrimitive | PromiseLike<NetaPrimitive>;
    html?: NetaPrimitive | PromiseLike<NetaPrimitive>;
    attributes?: NetaAttributesDescriptor<K> | PromiseLike<NetaAttributesDescriptor<K>>;
    styles?: NetaStylesDescriptor | PromiseLike<NetaStylesDescriptor>;
    children?: NetaChild;
};

export type NetaAttributes<K extends keyof NetaElementTagNameMap = 'div'> = NetaExtendable<NetaAttributesDescriptor<K>>;
export type NetaAttributesDescriptor<K extends keyof NetaElementTagNameMap> = {
    [key: string]: NetaPrimitive | PromiseLike<NetaPrimitive>;
};

export type NetaStyles = NetaExtendable<NetaStylesDescriptor>;
export type NetaStylesDescriptor = { selector: string } & {
    [P in keyof CSSStyleDeclaration]: NetaPrimitive | PromiseLike<NetaPrimitive>;
};
