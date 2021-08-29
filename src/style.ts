// import type { NetaElementDescriptor, NetaStyles, NetaStylesDescriptor } from './index';
import { resolve } from './core';
import { element } from './index';

// TODO: Add types
export function create(selector, descriptor) {
    return resolve(descriptor).then(descriptor => {
        const children = [];
        for (const key in descriptor) {
            children.push(
                resolve(descriptor[key]).then(value => {
                    if (typeof value === 'object' && value !== null) {
                        return create(selector + ' ' + key, value);
                    } else if (typeof value === 'string' || typeof value === 'number') {
                        return `${selector} {${key.replace(/[A-Z]/g, '-$&').toLowerCase()}:${value}}`;
                    }
                }),
            );
        }
        return children;
    });
}

export const stylesheet = element({
    // TODO: Extend should add nested describes for hover, focus, active overrides when it encounters new properties.
    then(resolve) {
        const descriptor = { ...this, tag: 'style', children: create('html', this.styles), styles: {} };
        return element.then.call(descriptor, resolve);
    },
});

export const styled = element({
    attributes: { neta: '-' },
    extend(descriptor) {
        const instance = element.extend.call(this, descriptor);
        const selector = descriptor.neta || Math.random().toString(16).substr(2, 6);
        const name = this.attributes.neta + selector + '-';
        if (descriptor.styles) {
            instance.styles = {};
            instance.attributes = instance.attributes.extend({ neta: name });
            stylesheet({ styles: { [`[neta*="-${selector}-"]`]: descriptor.styles } })
                .then(style => document.head.appendChild(style));
        }
        return instance;
    },
});
