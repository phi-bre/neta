import { compose, extend, state } from './core';

export type NetaAttributesDescriptor<E extends Element> = {
    [P in keyof E]?: (E[P] | PromiseLike<E[P]>);
};

export interface NetaAttributes<E extends Element = Element> {
    create(element: E): void;
    extend(descriptor: NetaAttributesDescriptor<E>): NetaAttributes<E>;
    (descriptor: NetaAttributesDescriptor<E>): NetaAttributes<E>;
}

export const attributes = compose<NetaAttributes>({
    extend,
    create(element) {
        element.setAttribute('neta', '');
        for (const key in this) {
            state(this[key]).then(value => {
                typeof value === 'function'
                    ? element[key] = value
                    : element.setAttribute(key, value.toString())
            });
        }
    },
});
