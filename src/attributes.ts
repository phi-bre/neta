import { compose, state } from './core';

export const attributes = compose({
    create(element: Element) {
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
