export { describe, resolve, document } from './core';
export { element } from './element';
export { state } from './state';

export type NetaObserver<T, R = any> = (value: T) => R;
export type NetaPrimitive = string | number | bigint | boolean | null | undefined;
export type NetaChild = PromiseLike<NetaChild> | Array<NetaChild> | Node | NetaPrimitive;

export type NetaDocument = {
    body: Array<NetaChild>;
    head: Array<NetaChild>;
    target: {
        head: Node;
        body: Node;
    };
}

export type NetaObservable<T> = PromiseLike<T> & {
    observers: Set<NetaObserver<T>>;
    value: T;
    set(value: T): NetaObservable<T>;
    then<R>(observer: NetaObserver<T, R>): NetaObservable<R>;
};

export type NetaExtendable<P, D = Partial<P>> = P & {
    extend(descriptor: D): NetaExtendable<P>;
    (descriptor: D): NetaExtendable<P>;
};

export type NetaElementTagNameMap = HTMLElementTagNameMap & SVGElementTagNameMap;
export type NetaElement<K extends keyof NetaElementTagNameMap> =
    NetaExtendable<PromiseLike<NetaElementTagNameMap[K]> & Required<NetaElementDescriptor<K>>>;
export type NetaElementDescriptor<K extends keyof NetaElementTagNameMap> = {
    namespace?: string | undefined;
    tag?: keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
    text?: NetaPrimitive | PromiseLike<NetaPrimitive>;
    html?: NetaPrimitive | PromiseLike<NetaPrimitive>;
    attributes?: NetaAttributesDescriptor<K>;
    styles?: NetaStylesDescriptor;
    children?: Array<NetaChild>;
};

export type NetaAttributes<K extends keyof NetaElementTagNameMap> = NetaExtendable<NetaAttributesDescriptor<K>>;
export type NetaAttributesDescriptor<K extends keyof NetaElementTagNameMap> = {
    [key: string]: NetaPrimitive | PromiseLike<NetaPrimitive>;
};

export type NetaStyles = NetaExtendable<NetaStylesDescriptor>;
export type NetaStylesDescriptor = { selector: string } & {
    [P in keyof CSSStyleDeclaration]: NetaPrimitive | PromiseLike<NetaPrimitive>;
};
