import { NetaStyles, styles } from './index';
import { snake, state } from './core';
import { element } from './element';

export const html = element({
    create(el?: HTMLElement): HTMLElement {
        el ||= document.createElement(this.tag || 'div');
        state(this.text).then(value => value && (el.innerText = value));
        state(this.html).then(value => value && (el.innerHTML = value));
        return element.create.call(this, el);
    },
});

export const svg = element({
    create(el?: SVGElement): SVGElement {
        el ||= document.createElementNS('http://www.w3.org/2000/svg', this.tag || 'svg');
        return element.create.call(this, el);
    },
});

export function media(value: object): string {
    return `@media screen and (${Object.keys(value).map(key => snake(key) + ':' + value[key]).join(';')})`;
}

export function global(descriptor: Record<string, Partial<NetaStyles>>) {
    for (const key in descriptor) {
        (styles as any).append({ ['neta:selector']: key, ...descriptor[key] });
    }
}
