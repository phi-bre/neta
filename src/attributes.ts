import { compose, extend } from './core';

export type NetaAttributesDescriptor<E extends Element> = {
    [P in keyof E]?: (E[P] | PromiseLike<E[P]>);
};

export interface NetaAttributes<E extends Element = Element> {
    extend(descriptor: NetaAttributesDescriptor<E>): NetaAttributes<E>;
    (descriptor: NetaAttributesDescriptor<E>): NetaAttributes<E>;
}

export const attributes = compose<NetaAttributes>({ extend });
