export type NetaObserver<T, R = void> = (value: T, prev: T) => R;
export type NetaMountable = { mount(parent: ParentNode): ChildNode };
export type NetaCreatable = { create(parent: ParentNode): ChildNode };
export type NetaDestroyable = { destroy(parent: ParentNode): ChildNode };
export type NetaExtendable<D> = { extend(descriptor: D): NetaExtendable<D> };
export type NetaCallable<T extends NetaExtendable<T>> = T & { (descriptor: Partial<T>): NetaCallable<T> };
export type NetaChild = PromiseLike<NetaChild> | NetaMountable | Node | string | number | boolean | null | undefined;
export type NetaAttributes = NetaExtendable<Partial<HTMLElement | SVGElement>>;
export type NetaStyles = NetaExtendable<Partial<CSSStyleDeclaration>>;

export type NetaElement = NetaCreatable & NetaMountable & NetaDestroyable & {
    tag: keyof (HTMLElementTagNameMap & SVGElementTagNameMap);
    children: Array<NetaChild>;
    attributes: NetaAttributes;
    styles: NetaStyles;
    html?: string | PromiseLike<string>;
    text?: string | PromiseLike<string>;
    created: NetaObserver<HTMLElement | SVGElement>;
    mounted: NetaObserver<HTMLElement | SVGElement>;
    destroyed: NetaObserver<HTMLElement | SVGElement>;
    extend(descriptor: Partial<NetaElement>): NetaExtendable<NetaElement>;
};

export { styles } from './styles';
export { html, svg } from './element';
export * from './helpers';
