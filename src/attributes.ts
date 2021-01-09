import { compose, normalize } from './core';

export const attributes = compose({
    create(element: Element) {
        element.setAttribute('neta', '');
        for (const key in this) {
            normalize(value => {
                typeof value === 'function'
                    ? element[key] = value
                    : element.setAttribute(key, value.toString())
            })(this[key]);
        }
    },
});
