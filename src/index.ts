export type NetaObserver<T, R = void> = (value: T, prev: T) => R;
export type NetaMountable = { mount(parent: ParentNode): ChildNode };
export type NetaExtendable<D> = { extend(descriptor: D): NetaExtendable<D> };
export type NetaCallable<T extends NetaExtendable<T>> = T & { (descriptor: Partial<T>): NetaCallable<T> };
export type NetaChild = NetaMountable | Node | string | number | boolean | null | undefined;

export { styles } from './styles';
export { html, svg } from './element';
export * from './helpers';
