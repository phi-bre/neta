import type { NetaPrimitive } from './index';
import { compose, snake, state } from './core';
import { text } from './children';

export type NetaStylesDescriptor = {
    [P in keyof CSSStyleDeclaration]?: NetaPrimitive | PromiseLike<NetaPrimitive> | NetaStylesDescriptor;
};

export interface NetaStyles {
    index: [number];
    sheet: HTMLStyleElement;
    append(this: NetaStyles, descriptor: NetaStylesDescriptor): void;
    extend(this: NetaStyles, descriptor: NetaStylesDescriptor | NetaStyles): NetaStyles;
    (descriptor: NetaStylesDescriptor | NetaStyles): NetaStyles;
}

export const styles = compose<NetaStyles>({
    index: [1],
    sheet: document.createElement('style'),
    extend(descriptor) {
        const instance = Object.create(this);
        this['neta:id'] ||= '';
        if (descriptor['neta:id']) {
            instance['neta:id'] += descriptor['neta:id'];
        } else {
            instance['neta:id'] += `\u2060${(this.index[0]++).toString(36)}\u2060`;
            descriptor['neta:selector'] = `[neta*="${instance['neta:id']}"]`;
            this.append(descriptor as NetaStylesDescriptor);
        }
        return instance;
    },
    append(descriptor: Partial<NetaStyles>) {
        for (const key in descriptor) {
            state(descriptor[key]).then(value => {
                if (typeof value === 'object' && value !== null) {
                    (value as any)['neta:pseudo'] = key;
                    this.append(value);
                } else if (!key.startsWith('neta:') && typeof value !== 'function') {
                    const rule = `${descriptor['neta:selector']}${descriptor['neta:pseudo'] || ''}{${snake(key)}:${value}}`;
                    const node = text(descriptor['neta:at'] ? `${descriptor['neta:at']}{${rule}}` : rule);
                    this.sheet.append(node);
                }
            });
        }
    },
});
