import { NetaStyles } from './index';
import { compose, snake } from './core';

export const stylesheet = document.createElement('style');
export const delimiter = '\u2060';
export let index = 0;

export const styles = compose({
    'neta:id': '',
    create(element: Element) {
        if (this['neta:id']) {
            element.setAttribute('neta', this['neta:id']);
        }
    },
    extend(descriptor: Partial<NetaStyles>) {
        const id = this['neta:id'] + (descriptor['neta:id'] || (delimiter + index.toString(36) + delimiter));
        if (!id.endsWith(descriptor['neta:id'])) {
            stylesheet.append(...this.append(descriptor, `[neta*="${delimiter + (index++).toString(36) + delimiter}"]`));
        }
        return Object.assign(Object.create(this), { ['neta:id']: id });
    },
    append(descriptor: Partial<NetaStyles>, selector?: string, at?: string): string[] {
        let body = '', nested = [];
        for (const key in descriptor) {
            const type = typeof descriptor[key];
            if (type === 'object' && typeof descriptor[key].then === 'function') {
                const node = document.createTextNode('');
                descriptor[key].then(value => node.data = `${selector}{${snake(key)}:${value}}`);
                nested.push(node);
            } else if (type === 'object') {
                nested.push(...this.append.apply(this,
                    key.startsWith('@')
                        ? [descriptor[key], selector, key]
                        : [descriptor[key], selector + ':' + key]
                ));
            } else if (type === 'string' || type === 'number') {
                body += snake(key) + ':' + descriptor[key] + ';';
            }
        }
        if (body) {
            nested.unshift(at ? `${at}{${selector}{${body}}}` : `${selector}{${body}}`);
        }
        return nested;
    },
    global(descriptor: Record<string, Partial<NetaStyles>>) {
        for (const key in descriptor) {
            stylesheet.append(...this.append(descriptor[key], key));
        }
    },
});

document.head.append(stylesheet);
