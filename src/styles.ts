import type { NetaPrimitive } from './index';
import { compose, snake, state } from './core';

export type NetaStylesDescriptor = {
    [P in keyof CSSStyleDeclaration]?: NetaPrimitive | PromiseLike<NetaPrimitive> | NetaStylesDescriptor;
};

export interface NetaStyles {
    index: number;
    sheet: HTMLStyleElement;
    create(element: Element);
    append(descriptor: NetaStylesDescriptor);
    extend(descriptor: NetaStylesDescriptor | NetaStyles): NetaStyles;
    (descriptor: NetaStylesDescriptor | NetaStyles): NetaStyles;
}

export const styles = compose<NetaStyles>({
    index: 0,
    sheet: document.createElement('style'),
    create(element) {
        element.setAttribute('neta', this['neta:id']);
    },
    extend(descriptor) {
        const id = (this['neta:id'] || '') +
            (descriptor['neta:id'] || ('\u2060' + (this.index++).toString(36) + '\u2060'));
        const instance = Object.assign(Object.create(this), { ['neta:id']: id });
        descriptor['neta:selector'] = `[neta*="${id}"]`;
        instance.append(descriptor);
        return instance;
    },
    append(descriptor: Partial<NetaStyles>) {
        for (const key in descriptor) {
            state(descriptor[key]).then(value => {
                if (typeof value === 'object') {
                    (value as any)['neta:pseudo'] = key;
                    this.append(value);
                } else if (!key.startsWith('neta:') && typeof value !== 'function') {
                    const rule = `${descriptor['neta:selector']}${descriptor['neta:pseudo'] || ''}{${snake(key)}:${value}}`;
                    this.sheet.append(descriptor['neta:at'] ? `${descriptor['neta:at']}{${rule}}` : rule);
                }
            });
        }
    },
});
