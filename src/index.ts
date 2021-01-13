import type { NetaObservable } from './observable';

export type NetaObserver<T, R = void> = (value: T, prev: T) => R;
export type NetaMountable = { mount(parent: ParentNode): ChildNode };
export type NetaCreatable = { create(parent?: ParentNode): ChildNode };
export type NetaDestroyable = { destroy(parent: ParentNode): ChildNode };
export type NetaExtendable<D> = { extend(descriptor: D): NetaExtendable<D> };
export type NetaCallable<T extends NetaExtendable<T>> = T & { (descriptor: Partial<T>): NetaCallable<T> };
export type NetaPrimitive = string | number | boolean | null | undefined;
export type NetaHook<T> = (this: NetaElement, element: T) => void;
export type NetaChild = NetaCreatable | Node | NetaPrimitive;
export type NetaAttributes = NetaExtendable<Partial<HTMLElement | SVGElement>>;
export type NetaStyles = NetaExtendable<Partial<CSSStyleDeclaration> | NetaObservable<Partial<CSSStyleDeclaration>>>;
export type NetaElement = NetaCreatable & NetaMountable & NetaDestroyable & {
    tag: keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
    children: Array<NetaChild | PromiseLike<NetaChild> | Array<NetaChild>>;
    attributes: NetaAttributes;
    styles: NetaStyles;
    html?: string | PromiseLike<string>;
    text?: string | PromiseLike<string>;
    created: NetaHook<HTMLElement | SVGElement>;
    mounted: NetaHook<HTMLElement | SVGElement>;
    destroyed: NetaHook<HTMLElement | SVGElement>;
    extend(descriptor: Partial<NetaElement>): NetaExtendable<NetaElement>;
};

export { styles } from './styles';
export * from './helpers';
