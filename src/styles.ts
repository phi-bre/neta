import { compose, snake, state } from './core';
import { NetaStyles } from './index';

export let index = 0;
export const delimiter = '\u2060';
export const stylesheet = document.createElement('style');
document.head.append(stylesheet);

export const styles = compose({
    'neta:selector': '',
    create(element: Element) {
        element.setAttribute('neta', this['neta:selector']);
    },
    extend(descriptor: Partial<NetaStyles>) {
        const id = this['neta:selector'] + (descriptor['neta:selector'] || (delimiter + (index++).toString(36) + delimiter));
        const instance = Object.assign(Object.create(this), { ['neta:selector']: id });
        descriptor['neta:selector'] = `[neta*="${id}"]`;
        instance.append(descriptor);
        return instance;
    },
    append(descriptor: Partial<NetaStyles>) {
        for (const key in descriptor) {
            state(descriptor[key]).then(value => {
                if (typeof value === 'object') {
                    (value['neta:pseudo'] = key.startsWith(':') ? key : '')
                    || (value['neta:at'] = key.startsWith('@') ? key : '');
                    this.append(value);
                } else if (!key.startsWith('neta:') && typeof value !== 'function') {
                    const rule = `${descriptor['neta:selector']}${descriptor['neta:pseudo'] || ''}{${snake(key)}:${value}}`;
                    stylesheet.append(descriptor['neta:at'] ? `${descriptor['neta:at']}{${rule}}` : rule);
                }
            });
        }
    },
});
